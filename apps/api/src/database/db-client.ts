import "dotenv/config";
import { drizzle } from "drizzle-orm/node-postgres";
import pg from "pg";

import * as schema from "./schema/index";

const client = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
});

export const db = drizzle(client, { schema });

export * from "./schema";
export type Schema = typeof schema;
