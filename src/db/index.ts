import type { Context as HonoContext } from "hono";
import type { Context } from "../types";
import { type DrizzleD1Database, drizzle } from "drizzle-orm/d1";
import * as schema from "./schema";

export type DrizzleDB = DrizzleD1Database<typeof schema>;

export const getDB = (context: HonoContext<Context>) => {
  return drizzle<typeof schema>(context.env.DB, { schema });
};
