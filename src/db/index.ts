import { type DrizzleD1Database, drizzle } from "drizzle-orm/d1";
import * as schema from "./schema";
import { eq, lt } from "drizzle-orm";

export type DrizzleDB = DrizzleD1Database<typeof schema>;

export const getDB = (D1: D1Database) => {
  return drizzle<typeof schema>(D1, { schema });
};

export async function insertFile(db: D1Database, file: File, fileId: string) {
  const drizzleDB = getDB(db);
  await drizzleDB
    .insert(schema.files)
    .values({
      id: fileId,
      name: file.name,
      type: file.type,
      size: file.size,
      created_at: Date.now(),
      expires_at: Date.now() + 1000 * 60 * 60 * 24 * 3,
    })
    .run();
  return fileId;
}

export async function getFile(db: D1Database, fileId: string) {
  const drizzleDB = getDB(db);
  const fileRecord = await drizzleDB
    .select()
    .from(schema.files)
    .where(eq(schema.files.id, fileId))
    .get();
  return fileRecord;
}

export async function cleanup(db: D1Database) {
  const drizzleDB = getDB(db);
  await drizzleDB
    .delete(schema.files)
    .where(lt(schema.files.expires_at, Date.now()))
    .run();
}
