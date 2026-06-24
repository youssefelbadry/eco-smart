console.log("[CONFIG-1] Starting config module load");

console.log("[CONFIG-2] Before import path");
import path from "path";
console.log("[CONFIG-3] After import path");

console.log("[CONFIG-4] Before import dotenv");
import dotenv from "dotenv";
console.log("[CONFIG-5] After import dotenv");

// In serverless/Vercel, only use environment variables, not .env files
// This prevents blocking file system operations during module load
if (process.env.NODE_ENV !== "production") {
  const backendEnvPath = path.resolve(__dirname, "../../.env");
  const rootEnvPath = path.resolve(__dirname, "../../../.env");

  try {
    dotenv.config({ path: backendEnvPath });
  } catch (e) {
    // Ignore if file doesn't exist
  }

  try {
    dotenv.config({ path: rootEnvPath });
  } catch (e) {
    // Ignore if file doesn't exist
  }
}

console.log("[CONFIG-6] Before dotenv.config()");
dotenv.config();
console.log("[CONFIG-7] After dotenv.config()");

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
