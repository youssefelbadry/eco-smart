console.log("[INIT-1] Starting module load");

try {
  console.log("[INIT-2] Before require serverless-http");
  const serverless = require("serverless-http");
  console.log("[INIT-3] After require serverless-http");

  console.log("[INIT-4] Before require backend/dist/app");
  const app = require("../backend/dist/app").default;
  console.log("[INIT-5] After require backend/dist/app");

  console.log("[INIT-6] Before serverless(app)");
  const handler = serverless(app);
  console.log("[INIT-7] After serverless(app)");

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
