console.log("[INIT-1] Starting module load");

try {
  console.log("[INIT-2] Before require serverless-http");
  const serverless = require("serverless-http");
  console.log("[INIT-3] After require serverless-http");

  console.log("[INIT-4] Checking if backend/dist/app.js exists");
  const fs = require("fs");
  const path = require("path");
  const appPath = path.resolve(__dirname, "../backend/dist/app.js");
  console.log("[INIT-4a] Resolved app path:", appPath);
  console.log("[INIT-4b] File exists:", fs.existsSync(appPath));

  console.log("[INIT-5] Before require backend/dist/app");
  const app = require("../backend/dist/app").default;
  console.log("[INIT-6] After require backend/dist/app");
  console.log("[INIT-6a] App type:", typeof app);
  console.log("[INIT-6b] App is function:", typeof app === "function");

  console.log("[INIT-7] Before serverless(app)");
  const handler = serverless(app);
  console.log("[INIT-8] After serverless(app)");

  module.exports = async (event, context) => {
    console.log("[START] Function invoked", {
      path: event.path,
      method: event.httpMethod,
    });
    context.callbackWaitsForEmptyEventLoop = false;

    try {
      const response = await handler(event, context);
      console.log("[END] Function completed successfully");
      return response;
    } catch (error) {
      console.log("[ERROR] Function failed", error);
      throw error;
    }
  };
} catch (error) {
  console.log("[INIT ERROR] Module initialization failed", error);
  throw error;
}
