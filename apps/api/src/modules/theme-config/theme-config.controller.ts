import { Body, Controller, Get, Put, UseGuards } from "@nestjs/common";

import { AllowAnonymous, Roles } from "@/decorators";
import { AuthGuard } from "@/guards";

import { UpdateThemeConfigDto } from "./dto/update-theme-config.dto";
import { ThemeConfigService } from "./theme-config.service";

@Controller("theme-config")
@UseGuards(AuthGuard)
export class ThemeConfigController {
  constructor(private readonly themeConfigService: ThemeConfigService) {}

  @Get()
  @AllowAnonymous()
  getThemeConfig() {
    return this.themeConfigService.getThemeConfig();
  }

  @Put()
  @Roles("ADMIN")
  updateThemeConfig(@Body() updateDto: UpdateThemeConfigDto) {
    return this.themeConfigService.updateThemeConfig(updateDto);
  }
}
