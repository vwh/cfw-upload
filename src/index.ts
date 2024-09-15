import { Hono } from "hono";
import { fileRoutes } from "./routes/file";
import { healthRoutes } from "./routes/health";

const app = new Hono()
  .route("/", fileRoutes)
  .basePath("/health")
  .route("/", healthRoutes);

export default app;
