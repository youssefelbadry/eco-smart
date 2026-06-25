import app from "./app";
import { config } from "./config";
import { ensureDatabaseInitialized } from "./database/init";

async function startServer() {
  try {
    console.log("[SERVER] Initializing database schema and seed catalog");
    await ensureDatabaseInitialized();
    const server = app.listen(config.port, () => {
      console.log(`Server running on port ${config.port}`);
    });

    process.on("unhandledRejection", (reason) => {
      console.error("Unhandled promise rejection:", reason);
    });

    process.on("uncaughtException", (error) => {
      console.error("Uncaught exception:", error);
      server.close(() => process.exit(1));
    });
  } catch (error) {
    console.error("[SERVER] Failed to initialize database", error);
    process.exit(1);
  }
}

startServer();
