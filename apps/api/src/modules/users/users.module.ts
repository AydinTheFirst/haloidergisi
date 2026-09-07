import { Module } from "@nestjs/common";

import { UserRoleGuard } from "./guards/user-role.guard";
import { UsersController } from "./users.controller";
import { UsersService } from "./users.service";

@Module({
  controllers: [UsersController],
  providers: [UsersService, UserRoleGuard],
  exports: [UsersService],
})
export class UsersModule {}
