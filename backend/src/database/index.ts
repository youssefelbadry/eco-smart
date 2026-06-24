import mysql from "mysql2/promise";
import { config } from "../config";

const databaseUrl = process.env.MYSQL_PUBLIC_URL || process.env.DATABASE_URL;

console.log("[DB] Initializing pool", {
  hasUrl: !!databaseUrl,
  host: config.dbHost,
  port: config.dbPort,
  database: config.dbName,
});

let poolConfig;

if (databaseUrl) {
  try {
    const url = new URL(databaseUrl);
    poolConfig = {
      host: url.hostname,
      port: url.port ? parseInt(url.port, 10) : 3306,
      user: url.username,
      password: url.password,
      database: url.pathname?.replace(/^\//, "") || config.dbName,
      waitForConnections: true,
      connectionLimit: 1,
      queueLimit: 0,
      decimalNumbers: true,
      connectTimeout: 10000,
    };
  } catch (e) {
    console.log("[DB] Failed to parse DATABASE_URL, using config fallback");
    poolConfig = {
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
    };
  }
} else {
  poolConfig = {
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
  };
}

export const pool = mysql.createPool(poolConfig);

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
