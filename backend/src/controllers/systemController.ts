console.log("[SYSTEM-CTRL-1] Starting systemController module load");

console.log("[SYSTEM-CTRL-2] Before import express");
import { Request, Response } from "express";
console.log("[SYSTEM-CTRL-3] After import express");

console.log("[SYSTEM-CTRL-4] Before import query");
import { query } from "../database";
console.log("[SYSTEM-CTRL-5] After import query");

console.log("[SYSTEM-CTRL-6] Before import success");
import { success } from "../utils/response";
console.log("[SYSTEM-CTRL-7] After import success");

console.log("[SYSTEM-CTRL-8] Before import AuthRequest");
import { AuthRequest } from "../middleware/auth";
console.log("[SYSTEM-CTRL-9] After import AuthRequest");

export async function systemHealth(req: AuthRequest, res: Response) {
  const userId = Number(req.user?.sub || 0);
  const [healths] = await query<any[]>(
    `SELECT
      COALESCE(ROUND(AVG(CASE WHEN status = 'online' THEN 100 ELSE 0 END)), 0) AS health_percent,
      SUM(CASE WHEN status = 'online' THEN 1 ELSE 0 END) AS online_devices,
      SUM(CASE WHEN status = 'warning' THEN 1 ELSE 0 END) AS warnings_count
     FROM devices WHERE user_id = ?`,
    [userId],
  );
  const health = (healths as any) || {};
  return success({
    res,
    data: {
      health_percent: Number(health.health_percent ?? 0),
      online_devices: Number(health.online_devices ?? 0),
      active_warnings: Number(health.warnings_count ?? 0),
    },
  });
}
