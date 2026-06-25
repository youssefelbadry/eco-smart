import { Request, Response } from "express";
import { aiService, AIServiceError } from "../services/aiService";
import { success, error } from "../utils/response";
import type { AuthRequest } from "../middleware/auth";
import type { PredictRequest } from "../types/ai";
import { query } from "../database";

function aiErrorStatus(err: unknown, fallback = 500): number {
  if (err instanceof AIServiceError) {
    return err.statusCode;
  }
  return fallback;
}

// Helper function to check if user has devices
async function checkUserHasDevices(userId: number): Promise<boolean> {
  const rows = await query<{ count: number }>(
    "SELECT COUNT(*) as count FROM devices WHERE user_id = ?",
    [userId],
  );
  return (rows[0]?.count || 0) > 0;
}

export async function health(req: Request, res: Response) {
  try {
    const data = await aiService.health();
    return success({ res, data, message: "AI service is healthy" });
  } catch (err) {
    return error({
      res,
      message: "Failed to check AI service health",
      statusCode: aiErrorStatus(err, 503),
    });
  }
}

export async function predict(req: AuthRequest, res: Response) {
  try {
    const userId = Number(req.user?.sub || 0);
    if (!userId) {
      return error({ res, message: "Unauthorized", statusCode: 401 });
    }

    const body = req.body || {};
    const predictRequest: PredictRequest = {
      user_id: userId,
      temperature: body.temperature,
      hour: body.hour,
      is_weekend: body.is_weekend,
      lag_1h: body.lag_1h,
      lag_24h: body.lag_24h,
    };

    const data = await aiService.predict(predictRequest);
    return success({ res, data, message: "Prediction generated successfully" });
  } catch (err) {
    return error({
      res,
      message: "Failed to generate prediction",
      statusCode: aiErrorStatus(err),
    });
  }
}

export async function getForecast(req: AuthRequest, res: Response) {
  try {
    const userId = Number(req.user?.sub || 0);
    console.log("[AI-FORECAST] Request received", { userId });
    if (!userId) {
      console.log("[AI-FORECAST] Unauthorized - no user ID");
      return error({ res, message: "Unauthorized", statusCode: 401 });
    }

    console.log("[AI-FORECAST] Calling AI service for user", userId);
    const data = await aiService.getForecast(userId);
    console.log("[AI-FORECAST] AI service returned data successfully");
    return success({ res, data, message: "Forecast retrieved successfully" });
  } catch (err) {
    console.error("[AI-FORECAST] Error:", err);
    return error({
      res,
      message: "Failed to retrieve forecast",
      statusCode: aiErrorStatus(err),
    });
  }
}

export async function getFullOutput(req: AuthRequest, res: Response) {
  try {
    const userId = Number(req.user?.sub || 0);
    console.log("[AI-FULL-OUTPUT] Request received", { userId });
    if (!userId) {
      console.log("[AI-FULL-OUTPUT] Unauthorized - no user ID");
      return error({ res, message: "Unauthorized", statusCode: 401 });
    }

    console.log("[AI-FULL-OUTPUT] Calling AI service for user", userId);
    const data = await aiService.getFullOutput(userId);
    console.log("[AI-FULL-OUTPUT] AI service returned data successfully");
    return success({
      res,
      data,
      message: "Full output retrieved successfully",
    });
  } catch (err) {
    console.error("[AI-FULL-OUTPUT] Error:", err);
    return error({
      res,
      message: "Failed to retrieve full output",
      statusCode: aiErrorStatus(err),
    });
  }
}

export async function getSummary(req: AuthRequest, res: Response) {
  try {
    const userId = Number(req.user?.sub || 0);
    console.log("[AI-SUMMARY] Request received", { userId });
    if (!userId) {
      console.log("[AI-SUMMARY] Unauthorized - no user ID");
      return error({ res, message: "Unauthorized", statusCode: 401 });
    }

    console.log("[AI-SUMMARY] Calling AI service for user", userId);
    const data = await aiService.getSummary(userId);
    console.log("[AI-SUMMARY] AI service returned data successfully");
    return success({ res, data, message: "Summary retrieved successfully" });
  } catch (err) {
    console.error("[AI-SUMMARY] Error:", err);
    return error({
      res,
      message: "Failed to retrieve summary",
      statusCode: aiErrorStatus(err),
    });
  }
}

export async function getDevices(req: AuthRequest, res: Response) {
  try {
    const userId = Number(req.user?.sub || 0);
    console.log("[AI-DEVICES] Request received", { userId });
    if (!userId) {
      console.log("[AI-DEVICES] Unauthorized - no user ID");
      return error({ res, message: "Unauthorized", statusCode: 401 });
    }

    console.log("[AI-DEVICES] Calling AI service for user", userId);
    const data = await aiService.getDevices(userId);
    console.log("[AI-DEVICES] AI service returned data successfully");
    return success({ res, data, message: "Devices retrieved successfully" });
  } catch (err) {
    console.error("[AI-DEVICES] Error:", err);
    return error({
      res,
      message: "Failed to retrieve devices",
      statusCode: aiErrorStatus(err),
    });
  }
}

export async function getAppliances(req: AuthRequest, res: Response) {
  try {
    const userId = Number(req.user?.sub || 0);
    console.log("[AI-APPLIANCES] Request received", { userId });
    if (!userId) {
      console.log("[AI-APPLIANCES] Unauthorized - no user ID");
      return error({ res, message: "Unauthorized", statusCode: 401 });
    }

    console.log("[AI-APPLIANCES] Calling AI service for user", userId);
    const data = await aiService.getAppliances(userId);
    console.log("[AI-APPLIANCES] AI service returned data successfully");
    return success({ res, data, message: "Appliances retrieved successfully" });
  } catch (err) {
    console.error("[AI-APPLIANCES] Error:", err);
    return error({
      res,
      message: "Failed to retrieve appliances",
      statusCode: aiErrorStatus(err),
    });
  }
}

export async function getAlerts(req: AuthRequest, res: Response) {
  try {
    const userId = Number(req.user?.sub || 0);
    console.log("[AI-ALERTS] Request received", { userId });
    if (!userId) {
      console.log("[AI-ALERTS] Unauthorized - no user ID");
      return error({ res, message: "Unauthorized", statusCode: 401 });
    }

    console.log("[AI-ALERTS] Calling AI service for user", userId);
    const data = await aiService.getAlerts(userId);
    console.log("[AI-ALERTS] AI service returned data successfully");
    return success({ res, data, message: "Alerts retrieved successfully" });
  } catch (err) {
    console.error("[AI-ALERTS] Error:", err);
    return error({
      res,
      message: "Failed to retrieve alerts",
      statusCode: aiErrorStatus(err),
    });
  }
}

export async function getNotifications(req: AuthRequest, res: Response) {
  try {
    const userId = Number(req.user?.sub || 0);
    console.log("[AI-NOTIFICATIONS] Request received", { userId });
    if (!userId) {
      console.log("[AI-NOTIFICATIONS] Unauthorized - no user ID");
      return error({ res, message: "Unauthorized", statusCode: 401 });
    }

    console.log("[AI-NOTIFICATIONS] Calling AI service for user", userId);
    const data = await aiService.getNotifications(userId);
    console.log("[AI-NOTIFICATIONS] AI service returned data successfully");
    return success({
      res,
      data,
      message: "Notifications retrieved successfully",
    });
  } catch (err) {
    console.error("[AI-NOTIFICATIONS] Error:", err);
    return error({
      res,
      message: "Failed to retrieve notifications",
      statusCode: aiErrorStatus(err),
    });
  }
}

export async function getChartData(req: AuthRequest, res: Response) {
  try {
    const userId = Number(req.user?.sub || 0);
    console.log("[AI-CHART-DATA] Request received", { userId });
    if (!userId) {
      console.log("[AI-CHART-DATA] Unauthorized - no user ID");
      return error({ res, message: "Unauthorized", statusCode: 401 });
    }

    console.log("[AI-CHART-DATA] Calling AI service for user", userId);
    const data = await aiService.getChartData(userId);
    console.log("[AI-CHART-DATA] AI service returned data successfully");
    return success({ res, data, message: "Chart data retrieved successfully" });
  } catch (err) {
    console.error("[AI-CHART-DATA] Error:", err);
    return error({
      res,
      message: "Failed to retrieve chart data",
      statusCode: aiErrorStatus(err),
    });
  }
}
