import { sql } from "drizzle-orm";
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const files = sqliteTable("files", {
  id: text("id").primaryKey(),

  name: text("name").notNull(),
  type: text("type").notNull(),
  size: integer("size").notNull(),

  created_at: integer("created_at")
    .notNull()
    .default(sql`(strftime('%s', 'now'))`),
  expires_at: integer("expires_at").notNull(),
});
