import { Request, Response } from "express";
import { InterviewBookingService } from "../services/InterviewBookingService";
import { ApiResponse } from "../types/scheduling";

export class InterviewBookingController {
  /**
   * GET /api/admin/bookings
   * Retrieves all interview bookings with optional ?date= and ?email= filters.
   */
  public static async getAll(req: Request, res: Response): Promise<void> {
    try {
      const { date, email } = req.query;
      const bookings = await InterviewBookingService.getAllBookings({
        date: date as string,
        email: email as string,
      });

      res.status(200).json({
        success: true,
        data: bookings,
      } as ApiResponse);
    } catch (error: any) {
      res.status(error.statusCode || 500).json({
        success: false,
        error: error.message || "Failed to fetch interview bookings.",
      } as ApiResponse);
    }
  }

  /**
   * GET /api/admin/bookings/:id
   * Retrieves a specific booking by ID.
   */
  public static async getById(req: Request, res: Response): Promise<void> {
    try {
      const rawId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
      const id = parseInt(rawId, 10);
      if (isNaN(id)) {
        res.status(400).json({
          success: false,
          error: "Invalid booking ID parameter.",
        } as ApiResponse);
        return;
      }

      const booking = await InterviewBookingService.getBookingById(id);
      res.status(200).json({
        success: true,
        data: booking,
      } as ApiResponse);
    } catch (error: any) {
      res.status(error.statusCode || 500).json({
        success: false,
        error: error.message || "Failed to fetch booking.",
      } as ApiResponse);
    }
  }

  /**
   * POST /api/admin/bookings
   * Creates a manual interview booking.
   */
  public static async create(req: Request, res: Response): Promise<void> {
    try {
      const booking = await InterviewBookingService.createBooking(req.body);
      res.status(201).json({
        success: true,
        message: "Interview booking created successfully.",
        data: booking,
      } as ApiResponse);
    } catch (error: any) {
      res.status(error.statusCode || 500).json({
        success: false,
        error: error.message || "Failed to create interview booking.",
      } as ApiResponse);
    }
  }

  /**
   * PUT /api/admin/bookings/:id
   * Updates an existing interview booking.
   */
  public static async update(req: Request, res: Response): Promise<void> {
    try {
      const rawId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
      const id = parseInt(rawId, 10);
      if (isNaN(id)) {
        res.status(400).json({
          success: false,
          error: "Invalid booking ID parameter.",
        } as ApiResponse);
        return;
      }

      const updated = await InterviewBookingService.updateBooking(id, req.body);
      res.status(200).json({
        success: true,
        message: "Interview booking updated successfully.",
        data: updated,
      } as ApiResponse);
    } catch (error: any) {
      res.status(error.statusCode || 500).json({
        success: false,
        error: error.message || "Failed to update interview booking.",
      } as ApiResponse);
    }
  }

  /**
   * DELETE /api/admin/bookings/:id
   * Cancels and removes an interview booking.
   */
  public static async delete(req: Request, res: Response): Promise<void> {
    try {
      const rawId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
      const id = parseInt(rawId, 10);
      if (isNaN(id)) {
        res.status(400).json({
          success: false,
          error: "Invalid booking ID parameter.",
        } as ApiResponse);
        return;
      }

      await InterviewBookingService.deleteBooking(id);
      res.status(200).json({
        success: true,
        message: "Interview booking deleted successfully.",
      } as ApiResponse);
    } catch (error: any) {
      res.status(error.statusCode || 500).json({
        success: false,
        error: error.message || "Failed to delete interview booking.",
      } as ApiResponse);
    }
  }
}
