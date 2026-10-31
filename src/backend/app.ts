import express, { Request, Response, NextFunction } from "express";
import cookieParser from "cookie-parser";
import adminSchedulingRoutes from "./routes/adminSchedulingRoutes";
import studentSchedulingRoutes from "./routes/studentSchedulingRoutes";

const app = express();

// Parse incoming JSON and urlencoded payloads
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Parse HTTP cookies (e.g., schedule_token, admin_token)
app.use(cookieParser());

// Mount Admin Scheduling APIs
app.use("/api/admin", adminSchedulingRoutes);

// Mount Student Scheduling APIs
app.use("/api/schedules", studentSchedulingRoutes);

// Global Error Handler
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error("[Express Server Error]:", err);
  const status = err.statusCode || 500;
  res.status(status).json({
    success: false,
    error: err.message || "Internal server error.",
  });
});

export default app;
