import mysql from "mysql2/promise";
import { config } from "../config";

console.log("[DB] Initializing pool with config", {
  host: config.dbHost,
  port: config.dbPort,
  user: config.dbUser,
  database: config.dbName,
});

export const pool = mysql.createPool({
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
});

pool.on("acquire", (connection) => {
  console.log("[DB] Connection acquired");
});

pool.on("release", (connection) => {
  console.log("[DB] Connection released");
});

pool.on("enqueue", () => {
  console.log("[DB] Waiting for available connection slot");
});

export async function query<T = any>(
  sql: string,
  params: any[] = [],
): Promise<T[]> {
  console.log("[DB] Query executing", {
    sql: sql.substring(0, 100),
    paramsCount: params.length,
  });
  const [rows] = (await pool.execute(sql, params)) as [T[], any];
  console.log("[DB] Query completed", { rowsCount: rows.length });
  return rows;
}
