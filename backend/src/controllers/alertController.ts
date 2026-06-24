import { Request, Response } from "express";
import { pool } from "../database";
import { success, error } from "../utils/response";
import { AuthRequest } from "../middleware/auth";

const getQuery = (req: Request, key: string, defaultValue = "") => {
  const value = Array.isArray(req.query[key])
    ? req.query[key][0]
    : req.query[key];
  return typeof value === "string" ? value.trim() : defaultValue;
};

export async function alertsList(req: AuthRequest, res: Response) {
  const userId = Number(req.user?.sub || 0);
  const tab = getQuery(req, "tab", "all");
  const search = getQuery(req, "search", "");
  const status = getQuery(req, "status", "");

  let sql =
    "SELECT id, type, message, severity, is_read, is_resolved, resolved_at, created_at FROM alerts WHERE user_id = ?";
  const params: any[] = [userId];

  if (["critical", "high", "medium"].includes(tab)) {
    sql += " AND severity = ? AND is_resolved = 0";
    params.push(tab);
  } else if (tab === "resolved") {
    sql += " AND is_resolved = 1";
  }

  if (status === "active") {
    sql += " AND is_resolved = 0";
  } else if (status === "resolved") {
    sql += " AND is_resolved = 1";
  }

  if (search) {
    sql += " AND (type LIKE ? OR message LIKE ?)";
    params.push(`%${search}%`, `%${search}%`);
  }

  sql += " ORDER BY created_at DESC LIMIT 100";
  const [rows] = await pool.execute<any[]>(sql, params);
  return success({
    res,
    data: rows,
  });
}

export async function alertsCounts(req: AuthRequest, res: Response) {
  const userId = Number(req.user?.sub || 0);
  const [rows] = await pool.execute<any[]>(
    `SELECT
      SUM(CASE WHEN severity = 'critical' AND is_resolved = 0 THEN 1 ELSE 0 END) AS critical_count,
      SUM(CASE WHEN severity = 'high' AND is_resolved = 0 THEN 1 ELSE 0 END) AS high_count,
      SUM(CASE WHEN severity = 'medium' AND is_resolved = 0 THEN 1 ELSE 0 END) AS medium_count,
      SUM(CASE WHEN severity = 'low' AND is_resolved = 0 THEN 1 ELSE 0 END) AS low_count,
      SUM(CASE WHEN severity = 'info' AND is_resolved = 0 THEN 1 ELSE 0 END) AS info_count
    FROM alerts WHERE user_id = ?`,
    [userId],
  );
  return success({
    res,
    data: rows[0] || {},
  });
}

export async function alertsTrend(req: AuthRequest, res: Response) {
  const userId = Number(req.user?.sub || 0);
  const [rows] = await pool.execute<any[]>(
    `SELECT DATE(created_at) AS day_date, COUNT(*) AS total_alerts
     FROM alerts WHERE user_id = ? AND created_at >= DATE_SUB(CURDATE(), INTERVAL 6 DAY)
     GROUP BY DATE(created_at) ORDER BY day_date ASC`,
    [userId],
  );
  return success({
    res,
    data: rows,
  });
}

export async function acknowledgeAll(req: AuthRequest, res: Response) {
  const userId = Number(req.user?.sub || 0);
  const [result] = (await pool.execute(
    "UPDATE alerts SET is_read = 1, is_resolved = 1, resolved_at = NOW() WHERE user_id = ? AND is_resolved = 0",
    [userId],
  )) as [{ affectedRows?: number }, any];

  return success({
    res,
    data: { affected_rows: result.affectedRows || 0 },
    message: "All active alerts acknowledged",
  });
}
