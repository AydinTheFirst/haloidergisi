import { Body, Controller, Param, Patch, UseGuards } from "@nestjs/common";

import { AdminGuard, AuthGuard } from "@/common/guards";

import { UpdateProfileDto } from "./profiles.dto";
import { ProfilesService } from "./profiles.service";

@Controller("profiles")
@UseGuards(AuthGuard, AdminGuard)
export class ProfilesController {
  constructor(private readonly profilesService: ProfilesService) {}

  @Patch(":id")
  update(@Param("id") id: string, @Body() updateProfileDto: UpdateProfileDto) {
    return this.profilesService.update(id, updateProfileDto);
  }
}
