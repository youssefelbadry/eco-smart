const serverless = require("serverless-http");
const app = require("../backend/dist/app").default;
const handler = serverless(app);

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
