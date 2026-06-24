import serverless from "serverless-http";
import app from "../backend/src/app";

export default serverless(app);
