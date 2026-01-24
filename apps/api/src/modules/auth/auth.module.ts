import { Module } from "@nestjs/common";

import { TurnstileService } from "@/services";

import { TokensService } from "../tokens/tokens.service";
import { UsersModule } from "../users/users.module";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";

@Module({
  imports: [UsersModule],
  controllers: [AuthController],
  providers: [AuthService, TokensService, TurnstileService],
})
export class AuthModule {}
