import { promises as fs } from "fs"
import path from "path"

export interface Report {
  id: string
  phone: string
  reason: string
  timestamp: Date
  ipAddress?: string
}

const DATA_FILE = path.join(process.cwd(), "data", "reports.json")

// Ensure data directory exists
async function ensureDataDir() {
  const dataDir = path.dirname(DATA_FILE)
  try {
    await fs.access(dataDir)
  } catch {
    await fs.mkdir(dataDir, { recursive: true })
  }
}

export async function getReports(): Promise<Report[]> {
  try {
    await ensureDataDir()
    const data = await fs.readFile(DATA_FILE, "utf-8")
    const reports = JSON.parse(data)
    // Convert timestamp strings back to Date objects
    return reports.map((report: any) => ({
      ...report,
      timestamp: new Date(report.timestamp),
    }))
  } catch (error) {
    // File doesn't exist or is empty, return empty array
    return []
  }
}

export async function saveReport(report: Report): Promise<void> {
  const reports = await getReports()
  reports.push(report)
  await ensureDataDir()
  await fs.writeFile(DATA_FILE, JSON.stringify(reports, null, 2))
}

export async function getReportsByPhone(phone: string): Promise<Report[]> {
  const reports = await getReports()
  return reports.filter((report) => report.phone === phone)
}
