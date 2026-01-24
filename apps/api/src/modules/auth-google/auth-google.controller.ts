import { Body, Controller, Get, Post, UseGuards } from "@nestjs/common";

import { Auth, Roles } from "@/decorators";
import { AuthGuard } from "@/guards";

import { AuthGoogleService } from "./auth-google.service";

@Controller("auth/google")
export class AuthGoogleController {
  constructor(private readonly authGoogleService: AuthGoogleService) {}

  @Get()
  getAuthUrl() {
    return this.authGoogleService.getAuthUrl();
  }

  @Post("callback")
  async callback(@Body("code") code: string) {
    return this.authGoogleService.callback(code);
  }

  @Post("link")
  @UseGuards(AuthGuard)
  @Roles("USER")
  async linkAccount(@Auth("id") userId: number, @Body("code") code: string) {
    return this.authGoogleService.linkAccount(userId, code);
  }
}
