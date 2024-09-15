import { Hono } from "hono";
import type { Context } from "../types";

export const healthRoutes = new Hono<Context>()
  .basePath("/health")
  .get("/bucket", async (c) => {
    try {
      await c.env.BUCKET.get("random-key");
      return c.status(200);
    } catch {
      return c.status(500);
    }
  })
  .get("/server", async (c) => {
    return c.status(200);
  });
