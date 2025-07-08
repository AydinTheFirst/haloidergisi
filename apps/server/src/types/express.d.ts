import { User } from "@prisma/client";

module "express" {
  interface Request {
    user?: User;
  }
}
