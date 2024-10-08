import { Hono } from "hono";
import { createMiddleware } from "hono/factory";

import { shortBase64Hash } from "../lib/hash";
import type { Context } from "../types";
import { insertFile, getFile } from "../db";

const MAX_FILE_SIZE = 100 * 1024 * 1024; // 100 MB

const fileExistsMiddleware = createMiddleware<Context>(async (c, next) => {
  const fileId = c.req.param("file-id");
  if (!fileId) return c.json({ error: "Missing file ID" }, 400);

  const fileRecord = await getFile(c.env.DB, fileId);
  if (!fileRecord) return c.json({ error: "File not found" }, 404);

  c.set("fileRecord", fileRecord);
  await next();
});

export const fileRoutes = new Hono<Context>()
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
    if (file.size > MAX_FILE_SIZE)
      return c.json({ error: "File too large" }, 400);
    const fileId = shortBase64Hash(`${file.name}-${file.size}-${file.type}`);

    try {
      const fileBuffer = await file.arrayBuffer();
      await c.env.BUCKET.put(fileId, fileBuffer, {
        httpMetadata: {
          contentType: file.type,
        },
      });
      await insertFile(c.env.DB, file, fileId);
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
  });
