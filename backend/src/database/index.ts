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

const originalExecute = pool.execute.bind(pool);
pool.execute = function (sql: string, params?: any[]) {
  console.log("[DB] pool.execute called", {
    sql: typeof sql === "string" ? sql.substring(0, 100) : "prepared statement",
    paramsCount: params?.length || 0,
  });
  const startTime = Date.now();
  return originalExecute(sql, params)
    .then((result) => {
      console.log("[DB] pool.execute completed", {
        duration: Date.now() - startTime + "ms",
      });
      return result;
    })
    .catch((error) => {
      console.log("[DB] pool.execute failed", {
        duration: Date.now() - startTime + "ms",
        error: error.message,
      });
      throw error;
    });
} as any;

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
