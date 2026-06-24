import { Router } from "express";
import {
  login,
  signup,
  forgotPassword,
  resetPassword,
} from "../controllers/authController";
import {
  devicesList,
  devicesDashboard,
  categoriesCounts,
} from "../controllers/deviceController";
import {
  alertsList,
  alertsCounts,
  alertsTrend,
  acknowledgeAll,
} from "../controllers/alertController";
import { usageOverview, usageTrend } from "../controllers/usageController";
import { systemHealth } from "../controllers/systemController";
import { authenticateToken } from "../middleware/auth";
import { asyncHandler } from "../utils/asyncHandler";

const router = Router();

router.get("/health", (req, res) => {
  res.json({ status: "ok", message: "Serverless function is working" });
});

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

export default router;
