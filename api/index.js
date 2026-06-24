console.log("[INIT] Starting module load");

try {
  console.log("[INIT] Loading serverless-http");
  const serverless = require("serverless-http");
  console.log("[INIT] serverless-http loaded");

  console.log("[INIT] Loading app from backend/dist/app");
  const app = require("../backend/dist/app").default;
  console.log("[INIT] App loaded successfully");

  console.log("[INIT] Creating serverless handler");
  const handler = serverless(app);
  console.log("[INIT] Handler created successfully");

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
