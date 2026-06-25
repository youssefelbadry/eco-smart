console.log("[APP-1] Starting app.ts module load");

console.log("[APP-2] Before import express");
import express from "express";
console.log("[APP-3] After import express");

console.log("[APP-4] Before import cors");
import cors from "cors";
console.log("[APP-5] After import cors");

console.log("[APP-6] Before import routes");
import routes from "./routes";
console.log("[APP-7] After import routes");

console.log("[APP-6b] Before import database init");
import { ensureDatabaseInitialized } from "./database/init";
console.log("[APP-6c] After import database init");

console.log("[APP-8] Before express()");
const app = express();
console.log("[APP-9] After express()");

console.log("[APP-10] Before app.use(cors())");
app.use(cors());
console.log("[APP-11] After app.use(cors())");

console.log("[APP-12] Before app.use(express.json())");
app.use(express.json());
console.log("[APP-13] After app.use(express.json())");

console.log("[APP-14] Before app.use(express.urlencoded())");
app.use(express.urlencoded({ extended: true }));
console.log("[APP-15] After app.use(express.urlencoded())");

let dbInitPromise: Promise<void> | null = null;
app.use(async (_req, _res, next) => {
  try {
    if (!dbInitPromise) {
      dbInitPromise = ensureDatabaseInitialized();
    }
    await dbInitPromise;
    next();
  } catch (err) {
    next(err);
  }
});

console.log("[APP-16] Before app.use(routes)");
app.use(routes);
console.log("[APP-17] After app.use(routes)");

console.log("[APP-18] Before error handler");
app.use(
  (
    err: any,
    req: express.Request,
    res: express.Response,
    next: express.NextFunction,
  ) => {
    if (err && err.type === "entity.parse.failed") {
      return res
        .status(400)
        .json({ success: false, message: "Invalid JSON body", data: {} });
    }
    if (err instanceof Error) {
      return res.status(500).json({
        success: false,
        message: err.message || "Internal server error",
        data: {},
      });
    }
    next(err);
  },
);
console.log("[APP-19] After error handler");

console.log("[APP-20] Before export default app");
export default app;
console.log("[APP-21] After export default app");
