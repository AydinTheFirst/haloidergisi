import { Module } from "@nestjs/common";

import { DrizzleModule } from "@/database";

import { ThemeConfigController } from "./theme-config.controller";
import { ThemeConfigService } from "./theme-config.service";

@Module({
  imports: [DrizzleModule],
  controllers: [ThemeConfigController],
  providers: [ThemeConfigService],
  exports: [ThemeConfigService],
})
export class ThemeConfigModule {}
