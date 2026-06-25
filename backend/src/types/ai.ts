export interface PredictRequest {
  user_id: number;
  temperature?: number;
  hour?: number;
  is_weekend?: number;
  lag_1h?: number;
  lag_24h?: number;
}

export interface AIResponse {
  [key: string]: any;
}
