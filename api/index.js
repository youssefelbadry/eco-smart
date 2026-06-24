const serverless = require("serverless-http");
const app = require("../backend/dist/app").default;

module.exports = serverless(app);
