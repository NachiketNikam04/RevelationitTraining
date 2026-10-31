import { AllowedEmailRepository } from "../repositories/AllowedEmailRepository";
import { AllowedScheduleEmail } from "../types/scheduling";

export class AllowedEmailService {
  private static emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  /**
   * Returns all authorized scheduling emails.
   */
  public static async getAllEmails(): Promise<AllowedScheduleEmail[]> {
    return await AllowedEmailRepository.findAll();
  }

  /**
   * Adds an email to the allowed schedule list after format and collision validation.
   */
  public static async addEmail(rawEmail: string): Promise<AllowedScheduleEmail> {
    const email = rawEmail?.trim().toLowerCase();

    if (!email || !this.emailRegex.test(email)) {
      const error: any = new Error("A valid email address is required.");
      error.statusCode = 400;
      throw error;
    }

    const existing = await AllowedEmailRepository.findByEmail(email);
    if (existing) {
      const error: any = new Error(`Email '${email}' is already in the allowed schedule list.`);
      error.statusCode = 409;
      throw error;
    }

    return await AllowedEmailRepository.create(email);
  }

  /**
   * Removes an allowed email by ID or email address.
   */
  public static async deleteEmail(identifier: string): Promise<void> {
    let deleted = false;
    const numericId = parseInt(identifier, 10);

    if (!isNaN(numericId)) {
      deleted = await AllowedEmailRepository.deleteById(numericId);
    } else {
      deleted = await AllowedEmailRepository.deleteByEmail(identifier.trim());
    }

    if (!deleted) {
      const error: any = new Error(`Allowed schedule email '${identifier}' was not found.`);
      error.statusCode = 404;
      throw error;
    }
  }
}
