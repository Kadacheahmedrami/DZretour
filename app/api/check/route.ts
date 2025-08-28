import { type NextRequest, NextResponse } from "next/server"
import { headers } from "next/headers"
import { prisma } from "@/lib/prisma"
import crypto from "crypto"

// Salt for phone number hashing - use environment variable in production
const PHONE_SALT = process.env.PHONE_SALT || "default-salt-change-in-production"

// Rate limiting map (use Redis in production)
const checkRateLimitMap = new Map<string, { count: number; resetTime: number }>()

function hashPhoneNumber(phone: string): string {
  return crypto
    .createHash("sha256")
    .update(phone + PHONE_SALT)
    .digest("hex")
}

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

function calculateRiskScore(reportCount: number, daysSinceFirst: number): {
  level: "safe" | "low" | "medium" | "high"
  score: number
  message: string
} {
  if (reportCount === 0) {
    return { level: "safe", score: 0, message: "No reports found" }
  }

  // Calculate base score from report count
  let score = Math.min(reportCount * 15, 70) // Max 70 points from count

  // Add recency factor (more recent = higher risk)
  if (daysSinceFirst < 30) {
    score += 20
  } else if (daysSinceFirst < 90) {
    score += 10
  }

  // Add frequency factor
  const reportsPerDay = reportCount / Math.max(daysSinceFirst, 1)
  if (reportsPerDay > 0.5) score += 15
  else if (reportsPerDay > 0.1) score += 5

  // Determine risk level
  if (score < 20) {
    return { level: "low", score, message: "Low risk detected" }
  } else if (score < 50) {
    return { level: "medium", score, message: "Moderate risk - exercise caution" }
  } else {
    return { level: "high", score, message: "High risk - proceed with extreme caution" }
  }
}

// POST endpoint for checking phone numbers (using POST for request body security)
export async function POST(request: NextRequest) {
  try {
    const headersList = headers()
    const ip = headersList.get("x-forwarded-for") || headersList.get("x-real-ip") || "unknown"

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

    const { phone } = await request.json()

    if (!phone) {
      return NextResponse.json(
        {
          error: "Phone number is required",
          code: "MISSING_PHONE",
        },
        { status: 400 }
      )
    }

    // Clean and validate phone number
    const cleanPhone = phone.replace(/\s/g, "")
    const phoneRegex = /^(\+213|0)[5-7]\d{8}$/

    if (!phoneRegex.test(cleanPhone)) {
      return NextResponse.json(
        {
          error: "Invalid phone number format",
          code: "INVALID_PHONE",
        },
        { status: 400 }
      )
    }

    // Hash the phone number for lookup
    const hashedPhone = hashPhoneNumber(cleanPhone)

    const reports = await prisma.report.findMany({
      where: {
        phoneNumber: hashedPhone,
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

    // Calculate risk score instead of showing exact counts
    const firstReport = reports[0]
    const daysSinceFirst = firstReport 
      ? Math.floor((Date.now() - firstReport.createdAt.getTime()) / (1000 * 60 * 60 * 24))
      : 0

    const riskAnalysis = calculateRiskScore(reports.length, daysSinceFirst)

    // Group reasons but don't show exact counts
    const reasonTypes = [...new Set(reports.map(r => r.reason))]
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
        // Don't expose the hashed phone or exact counts
      }
    }

    // Log the check for monitoring (without exposing the actual phone number)
    console.log(`Phone check performed from IP: ${ip}, Risk: ${riskAnalysis.level}`)

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