import axios, { AxiosError } from "axios";
import { config } from "../config";
import type { PredictRequest, AIResponse } from "../types/ai";

const AI_SERVICE_URL = config.aiServiceUrl;

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
      throw error;
    }
  }

  async predict(data: PredictRequest): Promise<AIResponse> {
    try {
      const response = await axiosInstance.post("/predict", data);
      return response.data;
    } catch (error) {
      this.handleError(error, "AI prediction failed");
      throw error;
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
      throw error;
    }
  }

  async getFullOutput(userId: number): Promise<AIResponse> {
    try {
      const response = await axiosInstance.get(`/full-output/${userId}`);
      return response.data;
    } catch (error) {
      this.handleError(error, "AI full output retrieval failed");
      throw error;
    }
  }

  async getSummary(userId: number): Promise<AIResponse> {
    try {
      const response = await axiosInstance.get(`/summary/${userId}`);
      return response.data;
    } catch (error) {
      this.handleError(error, "AI summary retrieval failed");
      throw error;
    }
  }

  async getDevices(userId: number): Promise<AIResponse> {
    try {
      const response = await axiosInstance.get(`/devices/${userId}`);
      return response.data;
    } catch (error) {
      this.handleError(error, "AI devices retrieval failed");
      throw error;
    }
  }

  async getAppliances(userId: number): Promise<AIResponse> {
    try {
      const response = await axiosInstance.get(`/appliances/${userId}`);
      return response.data;
    } catch (error) {
      this.handleError(error, "AI appliances retrieval failed");
      throw error;
    }
  }

  async getAlerts(userId: number): Promise<AIResponse> {
    try {
      const response = await axiosInstance.get(`/alerts/${userId}`);
      return response.data;
    } catch (error) {
      this.handleError(error, "AI alerts retrieval failed");
      throw error;
    }
  }

  async getNotifications(userId: number): Promise<AIResponse> {
    try {
      const response = await axiosInstance.get(`/notifications/${userId}`);
      return response.data;
    } catch (error) {
      this.handleError(error, "AI notifications retrieval failed");
      throw error;
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
      throw error;
    }
  }

  private handleError(error: unknown, message: string): void {
    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError;
      if (axiosError.code === "ECONNABORTED") {
        console.error(`${message}: Request timeout`);
      } else if (axiosError.response) {
        console.error(
          `${message}: ${axiosError.response.status} - ${axiosError.response.statusText}`,
        );
      } else if (axiosError.request) {
        console.error(`${message}: No response received from AI service`);
      } else {
        console.error(`${message}: ${axiosError.message}`);
      }
    } else {
      console.error(`${message}:`, error);
    }
  }
}

export const aiService = new AIService();
