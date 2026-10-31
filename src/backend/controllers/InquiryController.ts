import { InquiryService } from "../services/InquiryService";
import { CreateInquiryDTO } from "../repositories/InquiryRepository";

export class InquiryController {
  /**
   * Submits a new inquiry (Public Form Endpoint).
   */
  public static async submitInquiry(body: any) {
    const fullName = (body.full_name || body.name || "").trim();
    const email = (body.email || "").trim();
    const phone = (body.phone || "").trim();
    const courseInterest = (body.course_interest || body.interest || "General Inquiry").trim();
    const message = (body.message || "").trim();

    if (!fullName) {
      return {
        status: 400,
        data: { success: false, error: "Full name is required." },
      };
    }

    if (!email || !email.includes("@")) {
      return {
        status: 400,
        data: { success: false, error: "A valid email address is required." },
      };
    }

    try {
      const payload: CreateInquiryDTO = {
        full_name: fullName,
        email,
        phone,
        course_interest: courseInterest,
        message,
        status: "New",
      };

      const inquiry = await InquiryService.handleNewInquiry(payload);

      return {
        status: 201,
        data: {
          success: true,
          message: "Inquiry submitted successfully.",
          inquiry,
        },
      };
    } catch (error: any) {
      console.error("[InquiryController] submitInquiry error:", error);
      return {
        status: 500,
        data: {
          success: false,
          error: error?.message || "Failed to submit inquiry.",
        },
      };
    }
  }

  /**
   * Fetches all inquiries (Admin Protected Endpoint).
   */
  public static async fetchInquiries() {
    try {
      const inquiries = await InquiryService.getInquiries();
      return {
        status: 200,
        data: {
          success: true,
          inquiries,
        },
      };
    } catch (error: any) {
      console.error("[InquiryController] fetchInquiries error:", error);
      return {
        status: 500,
        data: {
          success: false,
          error: error?.message || "Failed to retrieve inquiries.",
          inquiries: [],
        },
      };
    }
  }

  /**
   * Updates the status of an inquiry.
   */
  public static async updateStatus(id: number, status: string) {
    if (!id || !status) {
      return {
        status: 400,
        data: { success: false, error: "Inquiry ID and status are required." },
      };
    }

    try {
      const inquiry = await InquiryService.updateStatus(id, status);
      if (!inquiry) {
        return {
          status: 404,
          data: { success: false, error: "Inquiry not found." },
        };
      }
      return {
        status: 200,
        data: {
          success: true,
          message: "Status updated successfully.",
          inquiry,
        },
      };
    } catch (error: any) {
      console.error("[InquiryController] updateStatus error:", error);
      return {
        status: 500,
        data: {
          success: false,
          error: error?.message || "Failed to update inquiry status.",
        },
      };
    }
  }

  /**
   * Deletes an inquiry.
   */
  public static async deleteInquiry(id: number) {
    if (!id) {
      return {
        status: 400,
        data: { success: false, error: "Inquiry ID is required." },
      };
    }

    try {
      const success = await InquiryService.deleteInquiry(id);
      return {
        status: 200,
        data: {
          success,
          message: success ? "Inquiry deleted successfully." : "Inquiry not found.",
        },
      };
    } catch (error: any) {
      console.error("[InquiryController] deleteInquiry error:", error);
      return {
        status: 500,
        data: {
          success: false,
          error: error?.message || "Failed to delete inquiry.",
        },
      };
    }
  }
}
