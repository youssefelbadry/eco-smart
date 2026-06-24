console.log("[ASYNC-HANDLER-1] Starting asyncHandler module load");

console.log("[ASYNC-HANDLER-2] Before import express");
import { Request, Response, NextFunction, RequestHandler } from "express";
console.log("[ASYNC-HANDLER-3] After import express");

export function asyncHandler(fn: RequestHandler): RequestHandler {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}
