import { Request, Response } from "express";
import { query } from "../database";
import { success } from "../utils/response";
import { AuthRequest } from "../middleware/auth";

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
