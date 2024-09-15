import { Hono } from "hono";
import { bucket } from "../lib/bucket";

export const healthRoutes = new Hono()
  .get("/bucket", async (c) => {
    return c.status((await bucket.exists()) ? 200 : 500);
  })
  .get("/server", async (c) => {
    return c.status(200);
  });
