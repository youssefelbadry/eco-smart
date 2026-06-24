console.log("[AUTH-MW-1] Starting auth middleware module load");

console.log("[AUTH-MW-2] Before import express");
import { Request, Response, NextFunction } from "express";
console.log("[AUTH-MW-3] After import express");

console.log("[AUTH-MW-4] Before import jsonwebtoken");
import jwt from "jsonwebtoken";
console.log("[AUTH-MW-5] After import jsonwebtoken");

console.log("[AUTH-MW-6] Before import config");
import { config } from "../config";
console.log("[AUTH-MW-7] After import config");

export interface AuthRequest extends Request {
  user?: any;
}

export function authenticateToken(
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) {
  console.log("[AUTH] Middleware started");
  const authHeader = req.headers.authorization || req.headers.Authorization;
  if (
    !authHeader ||
    typeof authHeader !== "string" ||
    !authHeader.startsWith("Bearer ")
  ) {
    console.log("[AUTH] Missing Bearer token");
    return res
      .status(401)
      .json({ success: false, message: "Missing Bearer token", data: {} });
  }

  const token = authHeader.slice(7).trim();
  console.log("[AUTH] Verifying token");
  try {
    const payload = jwt.verify(token, config.jwtSecret);
    console.log("[AUTH] Token verified successfully", { userId: payload.sub });
    req.user = payload;
    return next();
  } catch (error) {
    console.log("[AUTH] Token verification failed", error);
    return res
      .status(401)
      .json({ success: false, message: "Invalid or expired token", data: {} });
  }
}
