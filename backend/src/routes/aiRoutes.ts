console.log("[AI-ROUTES-1] Starting aiRoutes module load");

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

console.log("[AI-ROUTES-2] After imports");

const router = Router();

console.log("[AI-ROUTES-3] Router created");

// Health check - no authentication required
console.log("[AI-ROUTES] Registering GET /health");
router.get("/health", asyncHandler(health));

// All other routes require authentication
console.log("[AI-ROUTES] Registering POST /predict");
router.post("/predict", authenticateToken, asyncHandler(predict));
console.log("[AI-ROUTES] Registering GET /summary");
router.get("/summary", authenticateToken, asyncHandler(getSummary));
console.log("[AI-ROUTES] Registering GET /full-output");
router.get("/full-output", authenticateToken, asyncHandler(getFullOutput));
console.log("[AI-ROUTES] Registering GET /forecast");
router.get("/forecast", authenticateToken, asyncHandler(getForecast));
console.log("[AI-ROUTES] Registering GET /devices");
router.get("/devices", authenticateToken, asyncHandler(getDevices));
console.log("[AI-ROUTES] Registering GET /appliances");
router.get("/appliances", authenticateToken, asyncHandler(getAppliances));
console.log("[AI-ROUTES] Registering GET /alerts");
router.get("/alerts", authenticateToken, asyncHandler(getAlerts));
console.log("[AI-ROUTES] Registering GET /notifications");
router.get("/notifications", authenticateToken, asyncHandler(getNotifications));
console.log("[AI-ROUTES] Registering GET /chart-data");
router.get("/chart-data", authenticateToken, asyncHandler(getChartData));

console.log("[AI-ROUTES-4] All routes registered");
export default router;
console.log("[AI-ROUTES-5] After export");
