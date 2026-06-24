console.log("[RESPONSE-UTIL-1] Starting response utils module load");

console.log("[RESPONSE-UTIL-2] Before import express");
import { Response } from "express";
console.log("[RESPONSE-UTIL-3] After import express");

export function success({
  res,
  data,
  message,
  statusCode = 200,
}: {
  res: Response;
  data?: any;
  message?: string;
  statusCode?: number;
}) {
  console.log("[RESPONSE] Sending success", { statusCode, message });
  return res.status(statusCode).json({ success: true, message, data });
}

export function error({
  res,
  message = "Error",
  statusCode = 400,
  data = {},
}: {
  res: Response;
  message?: string;
  statusCode?: number;
  data?: any;
}) {
  console.log("[RESPONSE] Sending error", { statusCode, message });
  return res.status(statusCode).json({ success: false, message, data });
}
