-- Initialize the database with proper indexes and constraints
-- This script will be automatically executed when the database is created

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_reports_phone_number ON reports(phone_number);
CREATE INDEX IF NOT EXISTS idx_reports_created_at ON reports(created_at);
CREATE INDEX IF NOT EXISTS idx_reports_phone_created ON reports(phone_number, created_at);

-- Add any additional constraints or triggers here
