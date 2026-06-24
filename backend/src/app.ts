import express from "express";
import cors from "cors";
import routes from "./routes";

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(routes);

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

export default app;
