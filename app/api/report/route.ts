import { type NextRequest, NextResponse } from "next/server"

// Force this API route to be dynamic (not pre-rendered)
export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

interface ReportRequest {
  phone: string
  reason: string
  customReason?: string
}

interface CheckRequest {
  phone: string
}

// Rate limiting maps (use Redis in production)
const reportRateLimitMap = new Map<string, { count: number; resetTime: number }>()
const checkRateLimitMap = new Map<string, { count: number; resetTime: number }>()

function getRateLimitKey(ip: string, phone?: string): string {
  return phone ? `${ip}:${phone}` : ip
}

function checkRateLimit(
  key: string,
  windowMs: number,
  maxRequests: number,
  rateLimitMap: Map<string, { count: number; resetTime: number }>
): { allowed: boolean; resetTime?: number; remaining?: number } {
  const now = Date.now()
  const current = rateLimitMap.get(key)

  if (!current || now > current.resetTime) {
    rateLimitMap.set(key, { count: 1, resetTime: now + windowMs })
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

// Helper function to get location data from IP
async function getLocationFromIP(ip: string): Promise<{
  country?: string
  city?: string
  timezone?: string
}> {
  try {
    // Skip lookup for local/unknown IPs
    if (ip === "unknown" || ip.startsWith("127.") || ip.startsWith("192.168.") || ip.startsWith("10.") || ip.startsWith("172.")) {
      console.log(`Skipping location lookup for local IP: ${ip}`)
      return {}
    }

    console.log(`Looking up location for IP: ${ip}`)

    // Try with ipapi.co first (more reliable)
    const response = await fetch(`https://ipapi.co/${ip}/json/`, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; ReportBot/1.0)'
      },
      timeout: 5000
    })

    if (!response.ok) {
      console.log(`ipapi.co failed with status: ${response.status}`)
      throw new Error(`HTTP ${response.status}`)
    }

    const data = await response.json()
    console.log(`Location data received:`, data)

    // Check if we got valid data
    if (data.error) {
      console.log(`ipapi.co error: ${data.reason}`)
      return {}
    }

    return {
      country: data.country_code || null,
      city: data.city || null,
      timezone: data.timezone || null
    }

  } catch (error) {
    console.log(`Primary location lookup failed for IP ${ip}:`, error)
    
    // Fallback to ip-api.com
    try {
      console.log(`Trying fallback location service for IP: ${ip}`)
      const fallbackResponse = await fetch(`http://ip-api.com/json/${ip}?fields=status,countryCode,city,timezone`, {
        timeout: 5000
      })
      
      const fallbackData = await fallbackResponse.json()
      console.log(`Fallback location data:`, fallbackData)
      
      if (fallbackData.status === 'success') {
        return {
          country: fallbackData.countryCode || null,
          city: fallbackData.city || null,
          timezone: fallbackData.timezone || null
        }
      }
    } catch (fallbackError) {
      console.log(`Fallback location lookup also failed:`, fallbackError)
    }
  }
  
  console.log(`No location data available for IP: ${ip}`)
  return {}
}

// Lazy load Prisma client
async function getPrismaClient() {
  try {
    const { PrismaClient } = await import('@prisma/client')
    return new PrismaClient()
  } catch (error) {
    console.error('Failed to load Prisma client:', error)
    throw new Error('Database connection failed')
  }
}

// POST endpoint for reporting phone numbers
export async function POST(request: NextRequest) {
  let prisma: any = null
  
  try {
    // Get IP address from request headers directly
    const forwardedFor = request.headers.get("x-forwarded-for")
    const realIp = request.headers.get("x-real-ip")
    const ip = forwardedFor?.split(',')[0] || realIp || "unknown"

    // Get User-Agent
    const userAgent = request.headers.get("user-agent") || null

    // Rate limiting for reports: 3 per hour per IP/phone combo
    const reportRateLimitResult = checkRateLimit(
      getRateLimitKey(ip),
      60 * 60 * 1000, // 1 hour
      3, // max requests
      reportRateLimitMap
    )

    if (!reportRateLimitResult.allowed) {
      return NextResponse.json(
        {
          error: "Too many reports. Please try again later.",
          code: "RATE_LIMITED",
          resetTime: reportRateLimitResult.resetTime,
        },
        { status: 429 }
      )
    }

    // Add proper error handling for request body parsing
    let body: ReportRequest;
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

    // Enhanced validation
    if (!body.phone || !body.reason) {
      return NextResponse.json(
        {
          error: "Phone number and reason are required",
          code: "MISSING_FIELDS",
        },
        { status: 400 }
      )
    }

    // Validate phone number format (Algerian numbers)
    const phoneRegex = /^(\+213|0)[5-7]\d{8}$/
    const cleanPhone = body.phone.replace(/\s/g, "")

    if (!phoneRegex.test(cleanPhone)) {
      return NextResponse.json(
        {
          error: "Invalid Algerian phone number format",
          code: "INVALID_PHONE",
        },
        { status: 400 }
      )
    }

    const validReasons = [
      "Product dissatisfaction",
      "Refused to open package",
      "Package damaged during delivery",
      "Customer changed mind",
      "Other",
      "عدم الرضا عن المنتج",
      "رفض فتح الطرد",
      "تلف الطرد أثناء التوصيل",
      "تغيير رأي العميل",
      "أخرى",
    ]

    if (!validReasons.includes(body.reason)) {
      return NextResponse.json(
        {
          error: "Invalid reason provided",
          code: "INVALID_REASON",
        },
        { status: 400 }
      )
    }

    // Initialize Prisma client
    prisma = await getPrismaClient()

    // Check for recent reports (24 hours) using plain phone number
    const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000)
    const recentReport = await prisma.report.findFirst({
      where: {
        phoneNumber: cleanPhone,
        createdAt: {
          gte: twentyFourHoursAgo,
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    })

    if (recentReport) {
      return NextResponse.json(
        {
          error: "This phone number has already been reported recently",
          code: "DUPLICATE_REPORT",
          lastReported: recentReport.createdAt,
        },
        { status: 409 }
      )
    }

    // Get location data from IP (async operation)
    const locationData = await getLocationFromIP(ip)

    // Create new report with plain phone number and reporter data
    const newReport = await prisma.report.create({
      data: {
        phoneNumber: cleanPhone,
        reason: body.reason,
        customReason: body.customReason,
        // Auto-collected reporter data
        reporterIp: ip !== "unknown" ? ip : null,
        reporterUserAgent: userAgent,
        reporterCountry: locationData.country || null,
        reporterCity: locationData.city || null,
        reporterTimezone: locationData.timezone || null,
      },
    })

    // Update stats - use a consistent UUID for global stats
    const GLOBAL_STATS_ID = "00000000-0000-0000-0000-000000000001"
    
    await prisma.reportStats.upsert({
      where: { id: GLOBAL_STATS_ID },
      update: {
        totalReports: {
          increment: 1,
        },
        lastUpdated: new Date(),
      },
      create: {
        id: GLOBAL_STATS_ID,
        totalReports: 1,
      },
    })

    return NextResponse.json(
      {
        message: "Report submitted successfully",
        id: newReport.id,
        timestamp: newReport.createdAt,
      },
      { status: 201 }
    )
  } catch (error) {
    console.error("Error processing report:", error)
    return NextResponse.json(
      {
        error: "Internal server error",
        code: "INTERNAL_ERROR",
      },
      { status: 500 }
    )
  } finally {
    // Clean up Prisma connection
    if (prisma) {
      try {
        await prisma.$disconnect()
      } catch (error) {
        console.error('Error disconnecting Prisma:', error)
      }
    }
  }
}

// GET endpoint for checking phone numbers
export async function GET(request: NextRequest) {
  let prisma: any = null
  
  try {
    // Get IP address from request headers directly
    const forwardedFor = request.headers.get("x-forwarded-for")
    const realIp = request.headers.get("x-real-ip")
    const ip = forwardedFor?.split(',')[0] || realIp || "unknown"

    // Rate limiting for checks: 100 per hour per IP
    const checkRateLimitResult = checkRateLimit(
      ip,
      60 * 60 * 1000, // 1 hour
      100, // max requests
      checkRateLimitMap
    )

    if (!checkRateLimitResult.allowed) {
      return NextResponse.json(
        {
          error: "Too many check requests. Please try again later.",
          code: "RATE_LIMITED_CHECK",
          resetTime: checkRateLimitResult.resetTime,
        },
        { status: 429 }
      )
    }

    const { searchParams } = new URL(request.url)
    const phone = searchParams.get("phone")

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

    // Initialize Prisma client
    prisma = await getPrismaClient()

    const reports = await prisma.report.findMany({
      where: {
        phoneNumber: cleanPhone,
      },
      orderBy: {
        createdAt: "asc",
      },
      select: {
        reason: true,
        customReason: true,
        createdAt: true,
        // Include reporter data for analytics (optional - you might want to exclude this for privacy)
        reporterCountry: true,
        reporterCity: true,
      },
    })

    // Calculate risk score
    const firstReport = reports[0]
    const daysSinceFirst = firstReport 
      ? Math.floor((Date.now() - firstReport.createdAt.getTime()) / (1000 * 60 * 60 * 24))
      : 0

    const riskAnalysis = calculateRiskScore(reports.length, daysSinceFirst)

    // Group reasons
    const reasonTypesSet = new Set(reports.map((r: any) => r.reason))
    const reasonTypes = Array.from(reasonTypesSet)
    const hasCustomReasons = reports.some((r: any) => r.customReason)

    // Get geographic diversity (new insight from reporter data)
    const countries = new Set(reports.map((r: any) => r.reporterCountry).filter(Boolean))
    const cities = new Set(reports.map((r: any) => r.reporterCity).filter(Boolean))

    // Response with detailed report data
    const response = {
      isReported: reports.length > 0,
      reportCount: reports.length,
      risk: {
        level: riskAnalysis.level,
        score: riskAnalysis.score,
        message: riskAnalysis.message,
      },
      // Show detailed patterns and reports
      patterns: reports.length > 0 ? {
        reasonTypes,
        hasCustomReasons,
        reportedRecently: reports.some((r: any) => 
          Date.now() - r.createdAt.getTime() < 30 * 24 * 60 * 60 * 1000 // 30 days
        ),
        firstReportDate: firstReport ? firstReport.createdAt : null,
        daysSinceFirstReport: daysSinceFirst,
        // New geographic insights
        geographicDiversity: {
          countriesCount: countries.size,
          citiesCount: cities.size,
          countries: Array.from(countries),
        }
      } : null,
      // Return all reports for transparency (excluding sensitive reporter data)
      reports: reports.map((report: any) => ({
        reason: report.reason,
        customReason: report.customReason,
        createdAt: report.createdAt,
        // Optional: include geographic context (consider privacy implications)
        country: report.reporterCountry,
        city: report.reporterCity,
      })),
      checkedAt: new Date().toISOString(),
      remaining: checkRateLimitResult.remaining,
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
  } finally {
    // Clean up Prisma connection
    if (prisma) {
      try {
        await prisma.$disconnect()
      } catch (error) {
        console.error('Error disconnecting Prisma:', error)
      }
    }
  }
}