import { Router } from "express";
import {
  health,
  predict,
  getForecast,
  getFullOutput,
  getSummary,
  getDevices,
  getAppliances,
  getAlerts,
  getNotifications,
  getChartData,
} from "../controllers/aiController";
import { authenticateToken } from "../middleware/auth";
import { asyncHandler } from "../utils/asyncHandler";

const router = Router();

// Health check - no authentication required
router.get("/health", asyncHandler(health));

// All other routes require authentication
router.post("/predict", authenticateToken, asyncHandler(predict));
router.get("/summary", authenticateToken, asyncHandler(getSummary));
router.get("/full-output", authenticateToken, asyncHandler(getFullOutput));
router.get("/forecast", authenticateToken, asyncHandler(getForecast));
router.get("/devices", authenticateToken, asyncHandler(getDevices));
router.get("/appliances", authenticateToken, asyncHandler(getAppliances));
router.get("/alerts", authenticateToken, asyncHandler(getAlerts));
router.get("/notifications", authenticateToken, asyncHandler(getNotifications));
router.get("/chart-data", authenticateToken, asyncHandler(getChartData));

export default router;
