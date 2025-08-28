import { type NextRequest, NextResponse } from "next/server"

// Dynamically import Prisma to avoid build-time issues
const getPrisma = async () => {
  const { prisma } = await import("@/lib/prisma")
  return prisma
}

// Rate limiting map (use Redis in production)
const checkRateLimitMap = new Map<string, { count: number; resetTime: number }>()

function checkRateLimit(
  key: string,
  windowMs: number,
  maxRequests: number
): { allowed: boolean; resetTime?: number; remaining?: number } {
  const now = Date.now()
  const current = checkRateLimitMap.get(key)

  if (!current || now > current.resetTime) {
    checkRateLimitMap.set(key, { count: 1, resetTime: now + windowMs })
    return { allowed: true, remaining: maxRequests - 1 }
  }

  if (current.count >= maxRequests) {
    return { allowed: false, resetTime: current.resetTime, remaining: 0 }
  }

  current.count++
  return { allowed: true, remaining: maxRequests - current.count }
}

function calculateRiskScore(reports: Array<{ createdAt: Date }>, daysSinceFirst: number): {
  level: "safe" | "low" | "medium" | "high"
  score: number
  message: string
} {
  if (reports.length === 0) {
    return { level: "safe", score: 0, message: "No reports found" }
  }

  let totalScore = 0
  const now = Date.now()

  // Calculate time-weighted score for each report
  reports.forEach(report => {
    const daysOld = Math.floor((now - report.createdAt.getTime()) / (1000 * 60 * 60 * 24))
    
    // Base score per report: 15 points, but decreases with age
    let reportScore = 15
    
    // Time decay factor - older reports have less impact
    if (daysOld <= 7) {
      // Very recent (1 week): full weight
      reportScore = 15
    } else if (daysOld <= 30) {
      // Recent (1 month): 80% weight
      reportScore = 12
    } else if (daysOld <= 90) {
      // Moderate age (3 months): 60% weight
      reportScore = 9
    } else if (daysOld <= 180) {
      // Old (6 months): 40% weight
      reportScore = 6
    } else if (daysOld <= 365) {
      // Very old (1 year): 20% weight
      reportScore = 3
    } else {
      // Ancient (1+ year): 10% weight
      reportScore = 1.5
    }
    
    totalScore += reportScore
  })

  // Additional factors for overall pattern
  
  // Recent activity bonus (reports in last 30 days get extra weight)
  const recentReports = reports.filter(r => 
    (now - r.createdAt.getTime()) < 30 * 24 * 60 * 60 * 1000
  )
  if (recentReports.length > 0) {
    totalScore += Math.min(recentReports.length * 5, 20) // Max 20 bonus points
  }
  
  // Frequency factor (but less aggressive than before)
  const reportsPerDay = reports.length / Math.max(daysSinceFirst, 1)
  if (reportsPerDay > 0.5) {
    totalScore += 10 // Reduced from 15
  } else if (reportsPerDay > 0.1) {
    totalScore += 3 // Reduced from 5
  }

  // Determine risk level with adjusted thresholds
  if (totalScore < 15) {
    return { level: "low", score: Math.round(totalScore * 10) / 10, message: "Low risk detected" }
  } else if (totalScore < 35) {
    return { level: "medium", score: Math.round(totalScore * 10) / 10, message: "Moderate risk - exercise caution" }
  } else {
    return { level: "high", score: Math.round(totalScore * 10) / 10, message: "High risk - proceed with extreme caution" }
  }
}

function normalizePhoneNumber(phone: string): string {
  // Remove all spaces, dashes, parentheses, but keep + and digits
  let cleaned = phone.replace(/[\s\-\(\)]/g, "")
  
  // Convert all formats to local format (0XXXXXXXXX) to match database storage
  if (cleaned.startsWith("+213")) {
    // Convert +213xxxxxxxx to 0xxxxxxxx
    cleaned = "0" + cleaned.substring(4)
  } else if (cleaned.startsWith("00213")) {
    // Convert 00213xxxxxxxx to 0xxxxxxxx
    cleaned = "0" + cleaned.substring(5)
  } else if (cleaned.startsWith("213")) {
    // Convert 213xxxxxxxx to 0xxxxxxxx
    cleaned = "0" + cleaned.substring(3)
  } else if (cleaned.match(/^[567]\d{8}$/)) {
    // If it starts with 5, 6, or 7 and has 9 digits total, add 0
    cleaned = "0" + cleaned
  }
  // If it already starts with 0, keep it as is
  
  return cleaned
}

// POST endpoint for checking phone numbers (using POST for request body security)
export async function POST(request: NextRequest) {
  try {
    // Get IP address from request headers directly
    const forwardedFor = request.headers.get("x-forwarded-for")
    const realIp = request.headers.get("x-real-ip")
    const ip = forwardedFor?.split(',')[0] || realIp || "unknown"

    // Rate limiting for checks: 100 per hour per IP
    const rateLimit = checkRateLimit(
      ip,
      60 * 60 * 1000, // 1 hour
      100 // max requests
    )

    if (!rateLimit.allowed) {
      return NextResponse.json(
        {
          error: "Too many check requests. Please try again later.",
          code: "RATE_LIMITED_CHECK",
          resetTime: rateLimit.resetTime,
        },
        { status: 429 }
      )
    }

    // Add proper error handling for request body parsing
    let body;
    try {
      body = await request.json()
    } catch (error) {
      return NextResponse.json(
        {
          error: "Invalid JSON in request body",
          code: "INVALID_JSON",
        },
        { status: 400 }
      )
    }

    const { phone } = body

    if (!phone) {
      return NextResponse.json(
        {
          error: "Phone number is required",
          code: "MISSING_PHONE",
        },
        { status: 400 }
      )
    }

    // Normalize and validate phone number
    const normalizedPhone = normalizePhoneNumber(phone)
    // Updated regex to match local Algerian format stored in DB: 0 followed by 5,6,or 7 then 8 digits
    const phoneRegex = /^0[567]\d{8}$/

    if (!phoneRegex.test(normalizedPhone)) {
      return NextResponse.json(
        {
          error: "Invalid Algerian mobile phone number format. Expected format: 0XXXXXXXXX",
          code: "INVALID_PHONE",
          debug: process.env.NODE_ENV === "development" ? { 
            input: phone, 
            normalized: normalizedPhone,
            expected: "0XXXXXXXXX (where second digit is 5, 6, or 7)"
          } : undefined
        },
        { status: 400 }
      )
    }

    // Get Prisma client dynamically
    const prisma = await getPrisma()

    // Query reports using the normalized phone number
    const reports = await prisma.report.findMany({
      where: {
        phoneNumber: normalizedPhone,
      },
      orderBy: {
        createdAt: "asc",
      },
      select: {
        reason: true,
        customReason: true,
        createdAt: true,
      },
    })

    // Calculate risk score with time decay
    const firstReport = reports[0]
    const daysSinceFirst = firstReport 
      ? Math.floor((Date.now() - firstReport.createdAt.getTime()) / (1000 * 60 * 60 * 24))
      : 0

    const riskAnalysis = calculateRiskScore(reports, daysSinceFirst)

    // Group reasons but don't show exact counts
    const reasonTypes = Array.from(new Set(reports.map(r => r.reason)))
    const hasCustomReasons = reports.some(r => r.customReason)

    // Response with privacy-focused data
    const response = {
      isReported: reports.length > 0,
      risk: {
        level: riskAnalysis.level,
        message: riskAnalysis.message,
        // Only include score for internal use if needed
        ...(process.env.NODE_ENV === "development" && { score: riskAnalysis.score })
      },
      // Only show general patterns, not exact data
      patterns: reports.length > 0 ? {
        reasonTypes: reasonTypes.slice(0, 3), // Limit to top 3 reason types
        hasCustomReasons,
        reportedRecently: reports.some(r => 
          Date.now() - r.createdAt.getTime() < 30 * 24 * 60 * 60 * 1000 // 30 days
        ),
        reportingTimespan: firstReport ? {
          first: daysSinceFirst > 365 ? "over a year ago" : 
                daysSinceFirst > 30 ? "over a month ago" : 
                daysSinceFirst > 7 ? "over a week ago" : "recently"
        } : null
      } : null,
      metadata: {
        checkedAt: new Date().toISOString(),
        remaining: rateLimit.remaining,
      }
    }

    // Log the check for monitoring (with debug info in development)
    console.log(`Phone check performed from IP: ${ip}, Risk: ${riskAnalysis.level}, Reports found: ${reports.length}`)
    
    if (process.env.NODE_ENV === "development") {
      console.log(`Debug - Input: ${phone}, Normalized: ${normalizedPhone}, Query result: ${reports.length} reports`)
    }

    return NextResponse.json(response)
  } catch (error) {
    console.error("Error checking phone number:", error)
    return NextResponse.json(
      {
        error: "Internal server error",
        code: "INTERNAL_ERROR",
      },
      { status: 500 }
    )
  }
}