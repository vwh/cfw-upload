import { Hono } from "hono";
import { createMiddleware } from "hono/factory";

import { shortBase64Hash } from "../lib/hash";
import type { Context } from "../types";

import { getDB } from "../db/";
import { files } from "../db/schema";
import { eq, lt } from "drizzle-orm";

const fileExistsMiddleware = createMiddleware<Context>(async (c, next) => {
  const fileId = c.req.param("file-id");
  if (!fileId) {
    return c.json({ error: "Missing file ID" }, 400);
  }

  const db = getDB(c);
  const fileRecord = await db
    .select()
    .from(files)
    .where(eq(files.id, fileId))
    .get();

  if (!fileRecord) {
    return c.json({ error: "File not found" }, 404);
  }

  c.set("fileRecord", fileRecord);
  await next();
});

const fileRoutes = new Hono<Context>()
  .get("/info/:file-id{[A-z0-9]+}", fileExistsMiddleware, async (c) => {
    const fileRecord = c.get("fileRecord");
    return c.json(fileRecord);
  })
  .get("/:file-id{[A-z0-9]+}", fileExistsMiddleware, async (c) => {
    const fileId = c.req.param("file-id");
    const bucketObject = await c.env.BUCKET.get(fileId);
    if (!bucketObject) return c.json({ error: "File not found" }, 404);
    return new Response(bucketObject.body, {
      headers: {
        "Content-Type":
          bucketObject?.httpMetadata?.contentType || "application/octet-stream",
      },
    });
  })
  .post("/upload", async (c) => {
    const body = await c.req.parseBody();
    const file = body.file;
    if (!(file instanceof File)) return c.json({ error: "Invalid file" }, 400);
    const fileId = shortBase64Hash(`${file.name}-${file.size}-${file.type}`);
    try {
      const fileBuffer = await file.arrayBuffer();
      await c.env.BUCKET.put(fileId, fileBuffer, {
        httpMetadata: {
          contentType: file.type,
        },
      });
      const db = getDB(c);
      await db
        .insert(files)
        .values({
          id: fileId,
          name: file.name,
          type: file.type,
          size: file.size,
          created_at: Date.now(),
          expires_at: Date.now() + 1000 * 60 * 60 * 24 * 3,
        })
        .run();
      return c.json({ fileId, message: "File uploaded successfully" });
    } catch (e) {
      if (typeof e === "object" && e !== null && "message" in e) {
        const errorMessage = (e as { message: string }).message;
        if (errorMessage.includes("UNIQUE constraint failed: files.id")) {
          return c.json({ fileId, message: "File already exists" });
        }
      }
      return c.json({ error: "Failed to upload file" }, 500);
    }
  })
  .post("/cleanup", async (c) => {
    const db = getDB(c);
    const headerKey = c.req.header("x-api-key");
    if (!headerKey || headerKey !== c.get("API_KEY")) {
      return c.json({ error: "Missing API key or invalid" }, 401);
    }
    await db.delete(files).where(lt(files.expires_at, Date.now())).run();
    return c.json({ message: "Cleanup complete" });
  });

export { fileRoutes };
