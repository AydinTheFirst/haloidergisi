import { Body, Controller, Get, Patch, UseGuards } from "@nestjs/common";

import { GetUser } from "@/common/decorators";
import { AuthGuard } from "@/common/guards";

import {
  UpdateAccountDto,
  UpdatePasswordDto,
  UpdateProfileDto,
} from "./account.dto";
import { AccountService } from "./account.service";

@Controller("account")
@UseGuards(AuthGuard)
export class AccountController {
  constructor(private readonly accountService: AccountService) {}

  @Get("me")
  async findOne(@GetUser("id") id: string) {
    return this.accountService.findOne(id);
  }

  @Patch()
  async update(
    @GetUser("id") id: string,
    @Body() updateAccountDto: UpdateAccountDto
  ) {
    return this.accountService.update(id, updateAccountDto);
  }

  @Patch("password")
  async updatePassword(
    @GetUser("id") id: string,
    @Body() updatePasswordDto: UpdatePasswordDto
  ) {
    return this.accountService.updatePassword(id, updatePasswordDto);
  }

  @Patch("profile")
  async updateProfile(
    @GetUser("id") id: string,
    @Body() updateProfileDto: UpdateProfileDto
  ) {
    return this.accountService.updateProfile(id, updateProfileDto);
  }
}
