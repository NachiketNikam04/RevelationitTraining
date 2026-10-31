import { Request, Response } from "express";
import { AllowedEmailService } from "../services/AllowedEmailService";
import { ApiResponse } from "../types/scheduling";

export class AllowedEmailController {
  /**
   * GET /api/admin/schedule-emails
   * Retrieves all allowed student scheduling emails.
   */
  public static async getAll(req: Request, res: Response): Promise<void> {
    try {
      const emails = await AllowedEmailService.getAllEmails();
      res.status(200).json({
        success: true,
        data: emails,
      } as ApiResponse);
    } catch (error: any) {
      res.status(error.statusCode || 500).json({
        success: false,
        error: error.message || "Failed to fetch allowed emails.",
      } as ApiResponse);
    }
  }

  /**
   * POST /api/admin/schedule-emails
   * Authorizes a new student email address.
   */
  public static async create(req: Request, res: Response): Promise<void> {
    try {
      const { email } = req.body;
      const created = await AllowedEmailService.addEmail(email);
      res.status(201).json({
        success: true,
        message: "Email added to allowed scheduling list.",
        data: created,
      } as ApiResponse);
    } catch (error: any) {
      res.status(error.statusCode || 500).json({
        success: false,
        error: error.message || "Failed to add email.",
      } as ApiResponse);
    }
  }

  /**
   * DELETE /api/admin/schedule-emails/:id
   * Removes an email from the allowed list by ID or ?email query.
   */
  public static async delete(req: Request, res: Response): Promise<void> {
    try {
      const identifier =
        (typeof req.params.id === "string" ? req.params.id : undefined) ||
        (typeof req.query.email === "string" ? req.query.email : undefined);

      if (!identifier) {
        res.status(400).json({
          success: false,
          error: "Email ID param or email query string is required.",
        } as ApiResponse);
        return;
      }

      await AllowedEmailService.deleteEmail(identifier);
      res.status(200).json({
        success: true,
        message: "Allowed email removed successfully.",
      } as ApiResponse);
    } catch (error: any) {
      res.status(error.statusCode || 500).json({
        success: false,
        error: error.message || "Failed to delete allowed email.",
      } as ApiResponse);
    }
  }
}
