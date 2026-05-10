import { eq, sql } from "drizzle-orm";

import { db, users } from "../src";

async function main() {
  // make admin
  await db
    .update(users)
    .set({ roles: sql`array_append(roles, 'ADMIN')` })
    .where(eq(users.email, "aydinhalil980@gmail.com"));
}

try {
  await main();
  console.log("Seed script completed successfully.");
} catch (error) {
  console.error(error);
}
