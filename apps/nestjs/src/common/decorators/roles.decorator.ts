import { Reflector } from "@nestjs/core";
import { User } from "@prisma/client";

export const Roles = Reflector.createDecorator<User["roles"]>();
