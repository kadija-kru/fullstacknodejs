import express from "express";
import rateLimit from "express-rate-limit";
import pinoHttp from "pino-http";
import { randomUUID } from "node:crypto";
import { ordersRouter } from "./routes/orders.js";

export function createApp() {
  const app = express();

  app.use(express.json());
  app.use(
    pinoHttp({
      genReqId(req, res) {
        const existing = req.headers["x-request-id"];
        const id = typeof existing === "string" ? existing : randomUUID();
        res.setHeader("x-request-id", id);
        return id;
      }
    })
  );

  app.use(
    rateLimit({
      windowMs: 60_000,
      limit: 120,
      standardHeaders: true,
      legacyHeaders: false
    })
  );

  app.get("/health", (_req, res) => {
    res.json({ status: "ok" });
  });

  app.use("/api/orders", ordersRouter);

  app.use((_req, res) => {
    res.status(404).json({ error: "not_found" });
  });

  return app;
}
