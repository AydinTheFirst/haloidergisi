import { Module } from "@nestjs/common";

import { TokensService } from "../tokens/tokens.service";
import { UsersService } from "../users/users.service";
import { AuthGoogleController } from "./auth-google.controller";
import { AuthGoogleService } from "./auth-google.service";

@Module({
  controllers: [AuthGoogleController],
  providers: [AuthGoogleService, UsersService, TokensService],
})
export class AuthGoogleModule {}
