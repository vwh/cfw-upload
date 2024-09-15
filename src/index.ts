import { Hono } from "hono";
import { fileRoutes } from "./routes/file";
import { healthRoutes } from "./routes/health";
import type { Context } from "./types";

const app = new Hono<Context>()
  .route("/", fileRoutes)
  .basePath("/health")
  .route("/", healthRoutes);

export default app;
