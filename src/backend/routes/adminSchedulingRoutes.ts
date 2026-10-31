import { Router } from "express";
import { verifyAdmin } from "../middleware/adminAuth";
import { AllowedEmailController } from "../controllers/AllowedEmailController";
import { InterviewBookingController } from "../controllers/InterviewBookingController";

const router = Router();

// Protect all admin scheduling routes with JWT admin authentication
router.use(verifyAdmin as any);

/* =============================================================================
   1. ALLOWED SCHEDULE EMAILS CRUD ROUTES
   ============================================================================= */
// GET    /api/admin/schedule-emails      -> Retrieve all allowed student emails
router.get("/schedule-emails", AllowedEmailController.getAll);

// POST   /api/admin/schedule-emails      -> Authorize new student email
router.post("/schedule-emails", AllowedEmailController.create);

// DELETE /api/admin/schedule-emails/:id  -> Delete allowed student email by ID (or ?email=)
router.delete("/schedule-emails/:id", AllowedEmailController.delete);
router.delete("/schedule-emails", AllowedEmailController.delete);


/* =============================================================================
   2. INTERVIEW BOOKINGS CRUD ROUTES
   ============================================================================= */
// GET    /api/admin/bookings             -> Retrieve all bookings (supports ?date=&email=)
router.get("/bookings", InterviewBookingController.getAll);

// GET    /api/admin/bookings/:id         -> Retrieve a single booking by ID
router.get("/bookings/:id", InterviewBookingController.getById);

// POST   /api/admin/bookings             -> Create manual booking
router.post("/bookings", InterviewBookingController.create);

// PUT    /api/admin/bookings/:id         -> Update an existing booking
router.put("/bookings/:id", InterviewBookingController.update);

// DELETE /api/admin/bookings/:id         -> Delete a booking
router.delete("/bookings/:id", InterviewBookingController.delete);

export default router;
