import { Body, Controller, Post, UseGuards } from "@nestjs/common";

import { AllowAnonymous } from "@/decorators";
import { TurnstileGuard } from "@/guards";

import { LoginDto, RegisterDto, ResetPasswordDto } from "./auth.dto";
import { AuthService } from "./auth.service";

@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post("login")
  @AllowAnonymous()
  @UseGuards(TurnstileGuard)
  login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @Post("register")
  @AllowAnonymous()
  @UseGuards(TurnstileGuard)
  register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  @Post("logout")
  @AllowAnonymous()
  async logout(@Body("token") token: string) {
    return this.authService.logout(token);
  }

  @Post("forgot-password")
  @AllowAnonymous()
  @UseGuards(TurnstileGuard)
  async forgotPassword(@Body("email") email: string) {
    return this.authService.initiatePasswordReset(email);
  }

  @Post("reset-password")
  @AllowAnonymous()
  @UseGuards(TurnstileGuard)
  async resetPassword(@Body() body: ResetPasswordDto) {
    return this.authService.resetPassword(body);
  }
}
