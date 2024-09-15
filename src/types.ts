import type * as schema from "./db/schema";
import type { DrizzleD1Database } from "drizzle-orm/d1";

export interface FileRecord {
  name: string;
  size: number;
  type: string;
}

export type DrizzleDB = DrizzleD1Database<typeof schema>;

export type Context = {
  Bindings: {
    DB: D1Database;
  };
  Variables: {
    fileRecord: FileRecord;
    db: DrizzleDB;
  };
};
