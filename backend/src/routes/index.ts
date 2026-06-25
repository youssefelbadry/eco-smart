console.log("[ROUTES-1] Starting routes/index.ts module load");

console.log("[ROUTES-2] Before import Router");
import { Router } from "express";
console.log("[ROUTES-3] After import Router");

console.log("[ROUTES-4] Before import authController");
import {
  login,
  signup,
  forgotPassword,
  resetPassword,
} from "../controllers/authController";
console.log("[ROUTES-5] After import authController");

console.log("[ROUTES-6] Before import deviceController");
import {
  devicesList,
  devicesDashboard,
  categoriesCounts,
} from "../controllers/deviceController";
console.log("[ROUTES-7] After import deviceController");

console.log("[ROUTES-8] Before import alertController");
import {
  alertsList,
  alertsCounts,
  alertsTrend,
  acknowledgeAll,
} from "../controllers/alertController";
console.log("[ROUTES-9] After import alertController");

console.log("[ROUTES-10] Before import usageController");
import { usageOverview, usageTrend } from "../controllers/usageController";
console.log("[ROUTES-11] After import usageController");

console.log("[ROUTES-12] Before import systemController");
import { systemHealth } from "../controllers/systemController";
console.log("[ROUTES-13] After import systemController");

console.log("[ROUTES-14] Before import aiRoutes");
import aiRoutes from "./aiRoutes";
console.log("[ROUTES-15] After import aiRoutes");

console.log("[ROUTES-16] Before import authenticateToken");
import { authenticateToken } from "../middleware/auth";
console.log("[ROUTES-17] After import authenticateToken");

console.log("[ROUTES-18] Before import asyncHandler");
import { asyncHandler } from "../utils/asyncHandler";
console.log("[ROUTES-19] After import asyncHandler");

console.log("[ROUTES-20] Before Router()");
const router = Router();
console.log("[ROUTES-21] After Router()");

router.get("/health", (req, res) => {
  console.log("[HEALTH] Health check requested");
  console.time("[HEALTH] Response time");
  res.json({ status: "ok", message: "Serverless function is working" });
  console.timeEnd("[HEALTH] Response time");
});

// Log all routes for debugging
console.log("[ROUTES] Registering POST /api_login.php");
router.post("/api_login.php", asyncHandler(login));
router.post("/api_signup.php", asyncHandler(signup));
router.post("/api_forgot_password.php", asyncHandler(forgotPassword));
router.post("/api_reset_password.php", asyncHandler(resetPassword));
router.get(
  "/api_devices_list.php",
  authenticateToken,
  asyncHandler(devicesList),
);
router.get(
  "/api_devices_dashboard.php",
  authenticateToken,
  asyncHandler(devicesDashboard),
);
router.get(
  "/api_categories_counts.php",
  authenticateToken,
  asyncHandler(categoriesCounts),
);
router.get(
  "/api_usage_overview.php",
  authenticateToken,
  asyncHandler(usageOverview),
);
router.get("/api_usage_trend.php", authenticateToken, asyncHandler(usageTrend));
router.get("/api_alerts_list.php", authenticateToken, asyncHandler(alertsList));
router.get(
  "/api_alerts_counts.php",
  authenticateToken,
  asyncHandler(alertsCounts),
);
router.get(
  "/api_alerts_trend.php",
  authenticateToken,
  asyncHandler(alertsTrend),
);
router.post(
  "/api_alert_acknowledge_all.php",
  authenticateToken,
  asyncHandler(acknowledgeAll),
);
router.get(
  "/api_system_health.php",
  authenticateToken,
  asyncHandler(systemHealth),
);

// Mount AI routes
console.log("[ROUTES] Mounting /api/ai routes");
router.use("/api/ai", aiRoutes);

// Catch-all route for debugging
router.all("*", (req, res) => {
  console.log("[ROUTES] Unmatched route:", {
    method: req.method,
    path: req.path,
    url: req.url,
  });
  res
    .status(404)
    .json({ success: false, message: `Cannot ${req.method} ${req.path}` });
});

console.log("[ROUTES-22] Before export default router");
export default router;
console.log("[ROUTES-23] After export default router");
