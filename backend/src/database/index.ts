import mysql from "mysql2/promise";
import { config } from "../config";

export const pool = mysql.createPool({
  host: config.dbHost,
  port: config.dbPort,
  user: config.dbUser,
  password: config.dbPassword,
  database: config.dbName,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  decimalNumbers: true,
});

export async function query<T = any>(
  sql: string,
  params: any[] = [],
): Promise<T[]> {
  const [rows] = (await pool.execute(sql, params)) as [T[], any];
  return rows;
}
