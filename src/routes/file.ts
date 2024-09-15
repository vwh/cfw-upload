import { Hono } from "hono";
import { createMiddleware } from "hono/factory";
import { shortBase64Hash } from "../lib/hash";
import { bucket } from "../lib/bucket";

interface FileRecord {
  name: string;
  size: number;
  type: string;
}

type Env = {
  Variables: {
    fileRecord: FileRecord;
  };
};

const fakeDatabase: Record<string, FileRecord> = {};

const fileExistsMiddleware = createMiddleware<Env>(async (c, next) => {
  const fileId = c.req.param("file-id");
  if (!fileId) {
    return c.json({ error: "Missing file ID" }, 400);
  }
  const fileRecord = fakeDatabase[fileId];
  if (!fileRecord) {
    return c.json({ error: "File not found" }, 404);
  }
  c.set("fileRecord", fileRecord);
  await next();
});

const fileRoutes = new Hono()
  .get("/info/:file-id{[A-z0-9]+}", fileExistsMiddleware, (c) => {
    const fileRecord = c.get("fileRecord");
    return c.json(fileRecord);
  })
  .get("/:file-id{[A-z0-9]+}", fileExistsMiddleware, (c) => {
    const fileId = c.req.param("file-id");
    return c.redirect(`https://cdn.catway.org/${fileId}`);
  })
  .post("/upload", async (c) => {
    try {
      const body = await c.req.parseBody();
      const file = body.file;
      if (!(file instanceof File)) {
        return c.json({ error: "Invalid file" }, 400);
      }

      const fileId = shortBase64Hash(`${file.name}-${file.size}-${file.type}`);
      const fileBuffer = new Uint8Array(await file.arrayBuffer());
      await bucket.upload(fileBuffer, fileId, {}, file.type);

      fakeDatabase[fileId] = {
        name: file.name,
        size: file.size,
        type: file.type,
      };

      return c.json({ fileId, message: "File uploaded successfully" });
    } catch {
      return c.json({ error: "Failed to upload file" }, 500);
    }
  })
  .delete("/:file-id{[A-z0-9]+}", fileExistsMiddleware, async (c) => {
    try {
      const fileId = c.req.param("file-id");
      await bucket.deleteObject(fileId);
      delete fakeDatabase[fileId];
      return c.json({ message: "File deleted successfully" });
    } catch (error) {
      console.error("Delete error:", error);
      return c.json({ error: "Failed to delete file" }, 500);
    }
  });

export { fileRoutes };
