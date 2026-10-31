-- =============================================================================
-- PostgreSQL / NeonDB Database Schema: Student Interview Scheduling System
-- =============================================================================

-- 1. Allowed Schedule Emails Table
CREATE TABLE IF NOT EXISTS allowed_schedule_emails (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Index for high-speed email authorization checks
CREATE INDEX IF NOT EXISTS idx_allowed_schedule_emails_email 
  ON allowed_schedule_emails(email);


-- 2. Schedule OTPs Table (References allowed_schedule_emails with cascade delete)
CREATE TABLE IF NOT EXISTS schedule_otps (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) NOT NULL,
  otp_code VARCHAR(10) NOT NULL,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_schedule_otps_email 
    FOREIGN KEY (email) 
    REFERENCES allowed_schedule_emails(email) 
    ON DELETE CASCADE
);

-- Indexes for OTP verification & expiration cleanup
CREATE INDEX IF NOT EXISTS idx_schedule_otps_email 
  ON schedule_otps(email);
CREATE INDEX IF NOT EXISTS idx_schedule_otps_expires_at 
  ON schedule_otps(expires_at);


-- 3. Interview Bookings Table (References allowed_schedule_emails with cascade delete)
CREATE TABLE IF NOT EXISTS interview_bookings (
  id SERIAL PRIMARY KEY,
  student_name VARCHAR(255) NOT NULL,
  student_email VARCHAR(255) NOT NULL,
  company_name VARCHAR(255) NOT NULL,
  booking_date DATE NOT NULL,
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_interview_bookings_student_email 
    FOREIGN KEY (student_email) 
    REFERENCES allowed_schedule_emails(email) 
    ON DELETE CASCADE
);

-- Indexes for collision checks and student booking lookups
CREATE INDEX IF NOT EXISTS idx_interview_bookings_student_email 
  ON interview_bookings(student_email);
CREATE INDEX IF NOT EXISTS idx_interview_bookings_slot 
  ON interview_bookings(booking_date, start_time, end_time);
