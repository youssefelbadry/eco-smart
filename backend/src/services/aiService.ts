import axios, { AxiosError } from "axios";
import { config } from "../config";
import type { PredictRequest, AIResponse } from "../types/ai";

const AI_SERVICE_URL = config.aiServiceUrl;

export class AIServiceError extends Error {
  statusCode: number;

  constructor(message: string, statusCode = 503) {
    super(message);
    this.name = "AIServiceError";
    this.statusCode = statusCode;
  }
}

const axiosInstance = axios.create({
  baseURL: AI_SERVICE_URL,
  timeout: 30000,
  headers: {
    "Content-Type": "application/json",
  },
});

class AIService {
  async health(): Promise<AIResponse> {
    try {
      const response = await axiosInstance.get("/health");
      return response.data;
    } catch (error) {
      this.handleError(error, "AI health check failed");
    }
  }

  async predict(data: PredictRequest): Promise<AIResponse> {
    try {
      const response = await axiosInstance.post("/predict", data);
      return response.data;
    } catch (error) {
      this.handleError(error, "AI prediction failed");
    }
  }

  async getForecast(userId: number): Promise<AIResponse> {
    try {
      console.log("[AI-SERVICE] Calling forecast endpoint", {
        userId,
        url: `${AI_SERVICE_URL}/forecast/${userId}`,
      });
      const response = await axiosInstance.get(`/forecast/${userId}`);
      console.log("[AI-SERVICE] Forecast endpoint returned successfully");
      return response.data;
    } catch (error) {
      this.handleError(error, "AI forecast retrieval failed");
    }
  }

  async getFullOutput(userId: number): Promise<AIResponse> {
    try {
      const response = await axiosInstance.get(`/full-output/${userId}`);
      return response.data;
    } catch (error) {
      this.handleError(error, "AI full output retrieval failed");
    }
  }

  async getSummary(userId: number): Promise<AIResponse> {
    try {
      const response = await axiosInstance.get(`/summary/${userId}`);
      return response.data;
    } catch (error) {
      this.handleError(error, "AI summary retrieval failed");
    }
  }

  async getDevices(userId: number): Promise<AIResponse> {
    try {
      const response = await axiosInstance.get(`/devices/${userId}`);
      return response.data;
    } catch (error) {
      this.handleError(error, "AI devices retrieval failed");
    }
  }

  async getAppliances(userId: number): Promise<AIResponse> {
    try {
      const response = await axiosInstance.get(`/appliances/${userId}`);
      return response.data;
    } catch (error) {
      this.handleError(error, "AI appliances retrieval failed");
    }
  }

  async getAlerts(userId: number): Promise<AIResponse> {
    try {
      const response = await axiosInstance.get(`/alerts/${userId}`);
      return response.data;
    } catch (error) {
      this.handleError(error, "AI alerts retrieval failed");
    }
  }

  async getNotifications(userId: number): Promise<AIResponse> {
    try {
      const response = await axiosInstance.get(`/notifications/${userId}`);
      return response.data;
    } catch (error) {
      this.handleError(error, "AI notifications retrieval failed");
    }
  }

  async getChartData(userId: number): Promise<AIResponse> {
    try {
      console.log("[AI-SERVICE] Calling chart-data endpoint", {
        userId,
        url: `${AI_SERVICE_URL}/chart-data/${userId}`,
      });
      const response = await axiosInstance.get(`/chart-data/${userId}`);
      console.log("[AI-SERVICE] Chart-data endpoint returned successfully");
      return response.data;
    } catch (error) {
      this.handleError(error, "AI chart data retrieval failed");
    }
  }

  private handleError(error: unknown, message: string): never {
    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError;
      if (axiosError.code === "ECONNABORTED") {
        console.error(`${message}: Request timeout`);
        throw new AIServiceError(`${message}: request timeout`, 504);
      }
      if (axiosError.response) {
        console.error(
          `${message}: ${axiosError.response.status} - ${axiosError.response.statusText}`,
        );
        throw new AIServiceError(message, axiosError.response.status);
      }
      if (axiosError.request) {
        console.error(`${message}: No response received from AI service`);
        throw new AIServiceError(message, 503);
      }
      console.error(`${message}: ${axiosError.message}`);
      throw new AIServiceError(message, 503);
    }
    if (error instanceof AIServiceError) {
      throw error;
    }
    console.error(`${message}:`, error);
    throw new AIServiceError(message, 500);
  }
}

export const aiService = new AIService();
