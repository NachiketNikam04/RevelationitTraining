import { transporter } from "../config/mailer";

export interface SendMailOptions {
  to: string;
  subject: string;
  html: string;
  from?: string;
}

export class EmailService {
  /**
   * Sends email notification using the configured Nodemailer SMTP transporter.
   */
  public static async sendNotification(
    to: string,
    subject: string,
    html: string,
    from?: string
  ): Promise<{ success: boolean; messageId?: string; error?: string }> {
    const defaultFrom = `"Revelation IT Training" <${process.env.SMTP_USER || "no-reply@revelationit.com"}>`;

    try {
      const info = await transporter.sendMail({
        from: from || defaultFrom,
        to,
        subject,
        html,
      });

      return { success: true, messageId: info.messageId };
    } catch (error: any) {
      console.error("[EmailService] Failed to send email:", error);
      return { success: false, error: error?.message || "Failed to send email notification" };
    }
  }
}
