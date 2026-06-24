import app from "./app";
import { config } from "./config";

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
