import mysql from "mysql2/promise";
import { config } from "../config";

let pool: mysql.Pool | null = null;

export function getPool(): mysql.Pool {
  if (!pool) {
    console.log("[DB] Creating pool on first use", {
      host: config.dbHost,
      port: config.dbPort,
      user: config.dbUser,
      database: config.dbName,
    });
    pool = mysql.createPool({
      host: config.dbHost,
      port: config.dbPort,
      user: config.dbUser,
      password: config.dbPassword,
      database: config.dbName,
      waitForConnections: true,
      connectionLimit: 1,
      queueLimit: 0,
      decimalNumbers: true,
      connectTimeout: 10000,
      enableKeepAlive: true,
      keepAliveInitialDelay: 0,
    });
  }
  return pool;
}

export async function query<T = any>(
  sql: string,
  params: any[] = [],
): Promise<T[]> {
  const pool = getPool();
  console.log("[DB] Query executing", {
    sql: sql.substring(0, 100),
    paramsCount: params.length,
  });
  const [rows] = (await pool.execute(sql, params)) as [T[], any];
  console.log("[DB] Query completed", { rowsCount: rows.length });
  return rows;
}
