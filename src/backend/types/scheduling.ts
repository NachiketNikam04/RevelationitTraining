export interface AllowedScheduleEmail {
  id: number;
  email: string;
  created_at: Date;
}

export interface InterviewBooking {
  id: number;
  student_name: string;
  student_email: string;
  company_name: string;
  booking_date: string; // YYYY-MM-DD
  start_time: string;   // HH:MM:SS
  end_time: string;     // HH:MM:SS
  created_at: Date;
}

export interface ScheduleOtp {
  id: number;
  email: string;
  otp_code: string;
  expires_at: Date;
  created_at: Date;
}

export interface CreateAllowedEmailDTO {
  email: string;
}

export interface CreateBookingDTO {
  student_name: string;
  student_email: string;
  company_name: string;
  booking_date: string;
  start_time: string;
  end_time: string;
}

export interface UpdateBookingDTO {
  student_name?: string;
  student_email?: string;
  company_name?: string;
  booking_date?: string;
  start_time?: string;
  end_time?: string;
}

export interface BookingFilters {
  date?: string;
  email?: string;
}

export interface CalendarEvent {
  student_name: string;
  booking_date: string; // YYYY-MM-DD
  start_time: string;   // HH:MM:SS
  end_time: string;     // HH:MM:SS
}

export interface StudentBookDTO {
  name?: string;
  student_name?: string;
  company?: string;
  company_name?: string;
  date?: string;
  booking_date?: string;
  start_time: string;
  end_time: string;
}

export interface StudentAuthPayload {
  email: string;
  role: "student";
  iat?: number;
  exp?: number;
}

export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  error?: string;
}
