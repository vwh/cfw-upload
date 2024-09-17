import { Hono } from "hono";
import { cors } from "hono/cors";

import { fileRoutes } from "./routes/file";
import { healthRoutes } from "./routes/health";

import type { Context } from "./types";

const app = new Hono<Context>()
  .use("/*", cors())
  .route("/", fileRoutes)
  .route("/", healthRoutes);

export default app;
