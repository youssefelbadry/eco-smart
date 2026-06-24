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

export async function devicesList(req: AuthRequest, res: Response) {
  const userId = Number(req.user?.sub || 0);
  const search = getQuery(req, "search", "");
  const status = getQuery(req, "status", "");
  const category = getQuery(req, "category", "");
  const sortBy = getQuery(req, "sort_by", "name");
  const sortDir = getQuery(req, "sort_dir", "DESC");

  const allowedSort: Record<string, string> = {
    name: "d.name",
    status: "d.status",
    category: "d.category",
    last_seen: "d.last_seen",
  };
  const sortColumn = allowedSort[sortBy] || "d.name";
  const sortDirection = sortDir.toUpperCase() === "ASC" ? "ASC" : "DESC";

  let sql = `SELECT
    d.id,
    d.name AS device_name,
    d.location AS location_text,
    d.status,
    d.category AS category_name,
    d.meta_key AS metric_label,
    d.meta_value AS metric_value,
    d.last_seen AS last_seen_at,
    CASE WHEN d.status = 'online' THEN 100 ELSE 0 END AS health_score,
    d.is_on AS is_online
  FROM devices d
  WHERE d.user_id = ?`;

  const params: any[] = [userId];

  if (search) {
    sql += " AND (d.name LIKE ? OR d.location LIKE ? OR d.category LIKE ?)";
    params.push(`%${search}%`, `%${search}%`, `%${search}%`);
  }
  if (status) {
    sql += " AND d.status = ?";
    params.push(status);
  }
  if (category) {
    sql += " AND d.category = ?";
    params.push(category);
  }

  sql += ` ORDER BY ${sortColumn} ${sortDirection}`;
  const [rows] = await pool.execute<any[]>(sql, params);
  return success(res, { data: rows || [] });
}

export async function devicesDashboard(req: AuthRequest, res: Response) {
  const userId = Number(req.user?.sub || 0);
  const search = getQuery(req, "search", "");
  const status = getQuery(req, "status", "");
  const category = getQuery(req, "category", "");
  const sortBy = getQuery(req, "sort_by", "name");
  const sortDir = getQuery(req, "sort_dir", "DESC");

  const allowedSort: Record<string, string> = {
    name: "d.name",
    status: "d.status",
    category: "d.category",
    last_seen: "d.last_seen",
  };
  const sortColumn = allowedSort[sortBy] || "d.name";
  const sortDirection = sortDir.toUpperCase() === "ASC" ? "ASC" : "DESC";

  let baseSql = `SELECT
    d.id,
    d.name AS device_name,
    d.location AS location_text,
    d.status,
    d.category AS category_name,
    d.meta_key AS metric_label,
    d.meta_value AS metric_value,
    d.last_seen AS last_seen_at,
    CASE WHEN d.status = 'online' THEN 100 ELSE 0 END AS health_score,
    d.is_on AS is_online
  FROM devices d
  WHERE d.user_id = ?`;

  const params: any[] = [userId];
  if (search) {
    baseSql += " AND (d.name LIKE ? OR d.location LIKE ? OR d.category LIKE ?)";
    params.push(`%${search}%`, `%${search}%`, `%${search}%`);
  }
  if (status) {
    baseSql += " AND d.status = ?";
    params.push(status);
  }
  if (category) {
    baseSql += " AND d.category = ?";
    params.push(category);
  }
  baseSql += ` ORDER BY ${sortColumn} ${sortDirection}`;

  const [devices] = await pool.execute<any[]>(baseSql, params);
  const [categories] = await pool.execute<any[]>(
    "SELECT d.category AS category_name, COUNT(*) AS devices_count FROM devices d WHERE d.user_id = ? GROUP BY d.category ORDER BY d.category ASC",
    [userId],
  );
  const [totalRows] = await pool.execute<any[]>(
    "SELECT COUNT(*) AS total FROM devices WHERE user_id = ?",
    [userId],
  );
  const [healthRows] = await pool.execute<any[]>(
    'SELECT COALESCE(ROUND(AVG(CASE WHEN status = "online" THEN 100 ELSE 0 END)), 0) AS health_percent, SUM(CASE WHEN status = "online" THEN 1 ELSE 0 END) AS online_devices, SUM(CASE WHEN status = "warning" THEN 1 ELSE 0 END) AS warnings_count FROM devices WHERE user_id = ?',
    [userId],
  );

  return success(res, {
    filters: { search, status, category, sort_by: sortBy, sort_dir: sortDir },
    system_health: {
      percent: Number(healthRows[0]?.health_percent ?? 0),
      online_devices: Number(healthRows[0]?.online_devices ?? 0),
      warnings_count: Number(healthRows[0]?.warnings_count ?? 0),
    },
    all_devices_count: Number(totalRows[0]?.total ?? 0),
    categories: categories || [],
    devices: devices || [],
  });
}

export async function categoriesCounts(req: AuthRequest, res: Response) {
  const userId = Number(req.user?.sub || 0);
  const [categories] = await pool.execute<any[]>(
    "SELECT d.category AS category_name, COUNT(*) AS devices_count FROM devices d WHERE d.user_id = ? GROUP BY d.category ORDER BY d.category ASC",
    [userId],
  );
  const [totalRows] = await pool.execute<any[]>(
    "SELECT COUNT(*) AS total FROM devices WHERE user_id = ?",
    [userId],
  );
  return success(res, {
    all_devices_count: Number(totalRows[0]?.total ?? 0),
    categories: categories || [],
  });
}
