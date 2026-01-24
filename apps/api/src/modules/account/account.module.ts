import { Module } from "@nestjs/common";

import { UsersService } from "../users/users.service";
import { AccountController } from "./account.controller";
import { AccountService } from "./account.service";

@Module({
  controllers: [AccountController],
  providers: [AccountService, UsersService],
})
export class AccountModule {}
