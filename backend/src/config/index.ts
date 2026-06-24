import fs from "fs";
import path from "path";
import dotenv from "dotenv";

const rootEnvPath = path.resolve(__dirname, "../../.env");
if (fs.existsSync(rootEnvPath)) {
  dotenv.config({ path: rootEnvPath });
}

dotenv.config();

const databaseUrl =
  process.env.MYSQL_PUBLIC_URL || process.env.DATABASE_URL || "";
let dbHost = process.env.DB_HOST || "127.0.0.1";
let dbPort = process.env.DB_PORT ? parseInt(process.env.DB_PORT, 10) : 3306;
let dbName = process.env.DB_NAME || "ecosmart";
let dbUser = process.env.DB_USER || "root";
let dbPassword = process.env.DB_PASSWORD || process.env.DB_PASS || "";

if (databaseUrl) {
  try {
    const parsed = new URL(databaseUrl);
    dbHost = parsed.hostname || dbHost;
    dbPort = parsed.port ? parseInt(parsed.port, 10) : dbPort;
    dbName = parsed.pathname?.replace(/^\//, "") || dbName;
    dbUser = parsed.username || dbUser;
    dbPassword = parsed.password || dbPassword;
  } catch {
    // Ignore invalid URL and fallback to individual DB env vars
  }
}

export const config = {
  port: process.env.PORT ? parseInt(process.env.PORT, 10) : 4000,
  dbHost,
  dbPort,
  dbName,
  dbUser,
  dbPassword,
  jwtSecret: process.env.JWT_SECRET || "change_me",
  jwtExpiration: process.env.JWT_EXPIRATION
    ? parseInt(process.env.JWT_EXPIRATION, 10)
    : 86400,
};
