import { Hono } from "hono";
import { cors } from "hono/cors";

import { fileRoutes } from "./routes/file";
import { healthRoutes } from "./routes/health";

import type { Context } from "./types";
import { cleanup } from "./db";

const app = new Hono<Context>()
  .use("/*", cors())
  .route("/", fileRoutes)
  .route("/", healthRoutes);

export default {
  fetch: app.fetch,
  async scheduled(
    event: ScheduledEvent,
    env: {
      DB: D1Database;
    },
    ctx: ExecutionContext
  ) {
    const delayedProcessing = async () => {
      await cleanup(env.DB);
    };
    ctx.waitUntil(delayedProcessing());
  },
};
