import type { Profile, User } from "@repo/db";

declare module "express" {
  interface Request {
    user?: User & { profile?: Profile };
  }
}
