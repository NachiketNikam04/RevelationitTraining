import { InquiryRepository, CreateInquiryDTO, Inquiry } from "../repositories/InquiryRepository";
import { EmailService } from "./EmailService";

export class InquiryService {
  /**
   * Handles new inquiry creation and notifies the admin via EmailService.
   */
  public static async handleNewInquiry(data: CreateInquiryDTO): Promise<Inquiry> {
    // 1. Create inquiry in database
    const inquiry = await InquiryRepository.createInquiry(data);

    // 2. Format and dispatch notification email to admin
    const adminEmail = process.env.SMTP_USER || "info@revelationit.com";
    const subject = `🔥 New Lead: ${data.full_name} (${data.course_interest || "General Inquiry"})`;

    const html = `
      <div style="font-family: 'Lato', Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #ffffff; border: 1px solid #e5e7eb; border-radius: 16px; overflow: hidden;">
        <div style="background: #0d121c; padding: 24px; text-align: center; color: #ffffff;">
          <h2 style="margin: 0; font-size: 20px; font-weight: 700; color: #ff5722;">Revelation IT Training</h2>
          <p style="margin: 4px 0 0 0; font-size: 13px; color: #9ca3af;">New Student Course Inquiry Received</p>
        </div>
        <div style="padding: 24px; color: #1f2937;">
          <h3 style="margin-top: 0; font-size: 18px; color: #111827;">Inquiry Details</h3>
          <table style="width: 100%; border-collapse: collapse; margin-top: 12px;">
            <tr>
              <td style="padding: 10px; font-weight: bold; width: 35%; color: #4b5563; border-bottom: 1px solid #f3f4f6;">Full Name</td>
              <td style="padding: 10px; color: #111827; border-bottom: 1px solid #f3f4f6; font-weight: 600;">${data.full_name}</td>
            </tr>
            <tr>
              <td style="padding: 10px; font-weight: bold; color: #4b5563; border-bottom: 1px solid #f3f4f6;">Email</td>
              <td style="padding: 10px; border-bottom: 1px solid #f3f4f6;"><a href="mailto:${data.email}" style="color: #2563eb; text-decoration: none;">${data.email}</a></td>
            </tr>
            <tr>
              <td style="padding: 10px; font-weight: bold; color: #4b5563; border-bottom: 1px solid #f3f4f6;">Phone</td>
              <td style="padding: 10px; border-bottom: 1px solid #f3f4f6;"><a href="tel:${data.phone || ""}" style="color: #2563eb; text-decoration: none;">${data.phone || "Not provided"}</a></td>
            </tr>
            <tr>
              <td style="padding: 10px; font-weight: bold; color: #4b5563; border-bottom: 1px solid #f3f4f6;">Interested Track</td>
              <td style="padding: 10px; color: #ea580c; font-weight: bold; border-bottom: 1px solid #f3f4f6;">${data.course_interest || "General Inquiry"}</td>
            </tr>
            <tr>
              <td style="padding: 10px; font-weight: bold; color: #4b5563; border-bottom: 1px solid #f3f4f6;">Message / Notes</td>
              <td style="padding: 10px; color: #374151; border-bottom: 1px solid #f3f4f6;">${data.message || "No message provided."}</td>
            </tr>
            <tr>
              <td style="padding: 10px; font-weight: bold; color: #4b5563;">Timestamp</td>
              <td style="padding: 10px; color: #6b7280;">${new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" })}</td>
            </tr>
          </table>
          <div style="margin-top: 24px; text-align: center;">
            <a href="mailto:${data.email}?subject=Regarding your inquiry at Revelation IT Training" style="display: inline-block; background: #ff5722; color: #ffffff; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 14px;">Reply to Student</a>
          </div>
        </div>
        <div style="background: #f9fafb; padding: 16px; text-align: center; font-size: 12px; color: #9ca3af; border-top: 1px solid #e5e7eb;">
          This is an automated notification from Revelation IT Training Portal.
        </div>
      </div>
    `;

    // Asynchronously send notification email
    EmailService.sendNotification(adminEmail, subject, html).catch((err) => {
      console.error("[InquiryService] Error sending lead notification email:", err);
    });

    return inquiry;
  }

  /**
   * Retrieves all inquiry entries.
   */
  public static async getInquiries(): Promise<Inquiry[]> {
    return await InquiryRepository.getAllInquiries();
  }

  /**
   * Updates status of an inquiry entry.
   */
  public static async updateStatus(id: number, status: string): Promise<Inquiry | null> {
    return await InquiryRepository.updateStatus(id, status);
  }

  /**
   * Deletes an inquiry.
   */
  public static async deleteInquiry(id: number): Promise<boolean> {
    return await InquiryRepository.deleteInquiry(id);
  }
}
