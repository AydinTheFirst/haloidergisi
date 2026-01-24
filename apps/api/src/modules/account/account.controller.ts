import { Body, Controller, Delete, Get, Patch, Post, UseGuards } from "@nestjs/common";

import { Auth, Roles } from "@/decorators";
import { AuthGuard } from "@/guards";

import { UpdateAccountDto, UpdateNotificationsDto } from "./account.dto";
import { AccountService } from "./account.service";

@Controller("account")
@UseGuards(AuthGuard)
@Roles("USER")
export class AccountController {
  constructor(private readonly accountService: AccountService) {}

  @Get("notification-settings")
  getNotifications(@Auth("id") userId: number) {
    return this.accountService.getNotifications(userId);
  }

  @Patch("notification-settings")
  updateNotifications(
    @Auth("id") userId: number,
    @Body() updateNotificationsDto: UpdateNotificationsDto,
  ) {
    return this.accountService.updateNotifications(userId, updateNotificationsDto);
  }

  @Get()
  findOne(@Auth("id") userId: number) {
    return this.accountService.findOne(userId);
  }

  @Get("providers")
  getProviders(@Auth("id") userId: number) {
    return this.accountService.getProviders(userId);
  }

  @Delete("providers/:providerId")
  removeProvider(@Auth("id") userId: number, @Body("providerId") providerId: number) {
    return this.accountService.removeProvider(userId, providerId);
  }

  @Patch()
  update(@Auth("id") userId: number, @Body() updateAccountDto: UpdateAccountDto) {
    return this.accountService.update(userId, updateAccountDto);
  }

  @Delete()
  remove(@Auth("id") userId: number) {
    return this.accountService.remove(userId);
  }

  @Post("request-email-verification")
  requestEmailVerification(@Auth("id") userId: number) {
    return this.accountService.requestEmailVerification(userId);
  }

  @Post("verify-email")
  verifyEmail(@Auth("id") userId: number, @Body("token") token: string) {
    return this.accountService.verifyEmail(userId, token);
  }
}
