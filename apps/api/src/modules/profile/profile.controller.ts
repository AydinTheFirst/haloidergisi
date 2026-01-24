import { Body, Controller, Get, Param, Patch, UseGuards } from "@nestjs/common";

import { Roles } from "@/decorators";
import { AuthGuard } from "@/guards";

import { UpdateProfileDto } from "./profile.dto";
import { ProfileGuard } from "./profile.guard";
import { ProfileService } from "./profile.service";

@Controller("profile")
@UseGuards(AuthGuard)
@Roles("USER")
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @Patch(":id")
  @UseGuards(ProfileGuard)
  update(@Param("id") id: number, @Body() updateProfileDto: UpdateProfileDto) {
    return this.profileService.update(id, updateProfileDto);
  }

  @Get(":id")
  findOne(@Param("id") id: number) {
    return this.profileService.findOne(id);
  }

  @Get("user/:userId")
  findByUserId(@Param("userId") userId: number) {
    return this.profileService.findByUserId(userId);
  }
}
