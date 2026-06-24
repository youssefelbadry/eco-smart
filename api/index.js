const serverless = require("serverless-http");
const app = require("../backend/dist/app").default;
const handler = serverless(app);

module.exports = async (event, context) => {
  context.callbackWaitsForEmptyEventLoop = false;
  return await handler(event, context);
};
