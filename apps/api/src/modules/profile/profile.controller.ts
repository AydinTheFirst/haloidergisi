import { Body, Controller, Get, Param, Patch, UseGuards } from "@nestjs/common";

import { DrizzleQuery, type DrizzleQueryParams } from "@/decorators";
import { AuthGuard } from "@/guards";

import { UpdateProfileDto } from "./profile.dto";
import { ProfileGuard } from "./profile.guard";
import { ProfileService } from "./profile.service";

@Controller("profile")
@UseGuards(AuthGuard)
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @Patch(":id")
  @UseGuards(ProfileGuard)
  update(@Param("id") id: string, @Body() updateProfileDto: UpdateProfileDto) {
    return this.profileService.update(id, updateProfileDto);
  }

  @Get()
  findAll(@DrizzleQuery(["name", "title", "user.email"]) query: DrizzleQueryParams) {
    return this.profileService.findAll(query);
  }

  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.profileService.findOne(id);
  }

  @Get("user/:userId")
  findByUserId(@Param("userId") userId: string) {
    return this.profileService.findByUserId(userId);
  }
}
