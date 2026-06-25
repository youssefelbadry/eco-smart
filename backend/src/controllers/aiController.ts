import { Request, Response } from "express";
import { aiService } from "../services/aiService";
import { success, error } from "../utils/response";
import type { AuthRequest } from "../middleware/auth";
import type { PredictRequest } from "../types/ai";

export async function health(req: Request, res: Response) {
  try {
    const data = await aiService.health();
    return success({ res, data, message: "AI service is healthy" });
  } catch (err) {
    return error({ res, message: "Failed to check AI service health", statusCode: 503 });
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
    return error({ res, message: "Failed to generate prediction", statusCode: 500 });
  }
}

export async function getForecast(req: AuthRequest, res: Response) {
  try {
    const userId = Number(req.user?.sub || 0);
    if (!userId) {
      return error({ res, message: "Unauthorized", statusCode: 401 });
    }

    const data = await aiService.getForecast(userId);
    return success({ res, data, message: "Forecast retrieved successfully" });
  } catch (err) {
    return error({ res, message: "Failed to retrieve forecast", statusCode: 500 });
  }
}

export async function getFullOutput(req: AuthRequest, res: Response) {
  try {
    const userId = Number(req.user?.sub || 0);
    if (!userId) {
      return error({ res, message: "Unauthorized", statusCode: 401 });
    }

    const data = await aiService.getFullOutput(userId);
    return success({ res, data, message: "Full output retrieved successfully" });
  } catch (err) {
    return error({ res, message: "Failed to retrieve full output", statusCode: 500 });
  }
}

export async function getSummary(req: AuthRequest, res: Response) {
  try {
    const userId = Number(req.user?.sub || 0);
    if (!userId) {
      return error({ res, message: "Unauthorized", statusCode: 401 });
    }

    const data = await aiService.getSummary(userId);
    return success({ res, data, message: "Summary retrieved successfully" });
  } catch (err) {
    return error({ res, message: "Failed to retrieve summary", statusCode: 500 });
  }
}

export async function getDevices(req: AuthRequest, res: Response) {
  try {
    const userId = Number(req.user?.sub || 0);
    if (!userId) {
      return error({ res, message: "Unauthorized", statusCode: 401 });
    }

    const data = await aiService.getDevices(userId);
    return success({ res, data, message: "Devices retrieved successfully" });
  } catch (err) {
    return error({ res, message: "Failed to retrieve devices", statusCode: 500 });
  }
}

export async function getAppliances(req: AuthRequest, res: Response) {
  try {
    const userId = Number(req.user?.sub || 0);
    if (!userId) {
      return error({ res, message: "Unauthorized", statusCode: 401 });
    }

    const data = await aiService.getAppliances(userId);
    return success({ res, data, message: "Appliances retrieved successfully" });
  } catch (err) {
    return error({ res, message: "Failed to retrieve appliances", statusCode: 500 });
  }
}

export async function getAlerts(req: AuthRequest, res: Response) {
  try {
    const userId = Number(req.user?.sub || 0);
    if (!userId) {
      return error({ res, message: "Unauthorized", statusCode: 401 });
    }

    const data = await aiService.getAlerts(userId);
    return success({ res, data, message: "Alerts retrieved successfully" });
  } catch (err) {
    return error({ res, message: "Failed to retrieve alerts", statusCode: 500 });
  }
}

export async function getNotifications(req: AuthRequest, res: Response) {
  try {
    const userId = Number(req.user?.sub || 0);
    if (!userId) {
      return error({ res, message: "Unauthorized", statusCode: 401 });
    }

    const data = await aiService.getNotifications(userId);
    return success({ res, data, message: "Notifications retrieved successfully" });
  } catch (err) {
    return error({ res, message: "Failed to retrieve notifications", statusCode: 500 });
  }
}

export async function getChartData(req: AuthRequest, res: Response) {
  try {
    const userId = Number(req.user?.sub || 0);
    if (!userId) {
      return error({ res, message: "Unauthorized", statusCode: 401 });
    }

    const data = await aiService.getChartData(userId);
    return success({ res, data, message: "Chart data retrieved successfully" });
  } catch (err) {
    return error({ res, message: "Failed to retrieve chart data", statusCode: 500 });
  }
}
