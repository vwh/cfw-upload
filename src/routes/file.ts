import { Hono } from "hono";
import { bucket } from "../lib/bucket";
import { shortBase64Hash } from "../lib/hash";

type FileRecord = {
  name: string;
  size: number;
  type: string;
};

const fakeDataBase: Record<string, FileRecord> = {};

export const fileRoutes = new Hono()
  .get("/info/:file-id{[A-z0-9]+}", (c) => {
    const fileId = c.req.param("file-id");
    const fileRecord = fakeDataBase[fileId];
    if (!fileRecord) return c.json({ error: "File not found" }, 404);
    return c.json(fileRecord);
  })
  .get("/:file-id{[A-z0-9]+}", (c) => {
    const fileId = c.req.param("file-id");
    const fileRecord = fakeDataBase[fileId];
    if (!fileRecord) return c.json({ error: "File not found" }, 404);
    return c.redirect(`https://cdn.catway.org/${fileId}`);
  })
  .post("/upload", async (c) => {
    const body = await c.req.parseBody();
    const file = body.file;
    try {
      if (file instanceof File) {
        const fileId = shortBase64Hash(
          `${file.name}-${file.size}-${file.type}`
        );
        const fileBuffer = new Uint8Array(await file.arrayBuffer());
        await bucket.upload(fileBuffer, fileId, {}, file.type);
        fakeDataBase[fileId] = {
          name: file.name,
          size: file.size,
          type: file.type,
        };
        return c.json({ fileId });
      }
      return c.json({ error: "Invalid file" }, 400);
    } catch (e) {
      console.error(e);
      return c.json({ error: "Failed to upload file" }, 500);
    }
  })
  .delete("/:file-id{[A-z0-9]+}", async (c) => {
    const fileId = c.req.param("file-id");
    try {
      const file = await bucket.deleteObject(fileId);
      if (file) {
        delete fakeDataBase[fileId];
        return c.json({ success: true });
      }
      return c.json({ error: "File not found" }, 404);
    } catch {
      return c.json({ error: "Failed to delete file" }, 500);
    }
  });
