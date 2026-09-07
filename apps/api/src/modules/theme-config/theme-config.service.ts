import { Injectable } from "@nestjs/common";
import { themeConfigs } from "@repo/db";
import { eq } from "drizzle-orm";

import { DrizzleService } from "@/database";

import { UpdateThemeConfigDto } from "./dto/update-theme-config.dto";

const DEFAULT_THEME_CONFIG = {
  id: "default",
  primaryColor: "oklch(0.205 0 0)",
  primaryDarkColor: "oklch(0.922 0 0)",
  accentColor: null,
  radius: "0.625rem",
  fontFamily: "Inter Variable, sans-serif",
  preset: "default",
  updatedAt: new Date(),
};

@Injectable()
export class ThemeConfigService {
  constructor(private drizzle: DrizzleService) {}

  async getThemeConfig() {
    const [config] = await this.drizzle.db.select().from(themeConfigs).limit(1);
    if (!config) {
      return DEFAULT_THEME_CONFIG;
    }
    return config;
  }

  async updateThemeConfig(dto: UpdateThemeConfigDto) {
    const [existing] = await this.drizzle.db.select().from(themeConfigs).limit(1);

    if (existing) {
      const [updated] = await this.drizzle.db
        .update(themeConfigs)
        .set({
          ...dto,
          updatedAt: new Date(),
        })
        .where(eq(themeConfigs.id, existing.id))
        .returning();
      return updated;
    }

    const [created] = await this.drizzle.db
      .insert(themeConfigs)
      .values({
        primaryColor: dto.primaryColor ?? DEFAULT_THEME_CONFIG.primaryColor,
        primaryDarkColor: dto.primaryDarkColor ?? DEFAULT_THEME_CONFIG.primaryDarkColor,
        accentColor: dto.accentColor ?? DEFAULT_THEME_CONFIG.accentColor,
        radius: dto.radius ?? DEFAULT_THEME_CONFIG.radius,
        fontFamily: dto.fontFamily ?? DEFAULT_THEME_CONFIG.fontFamily,
        preset: dto.preset ?? DEFAULT_THEME_CONFIG.preset,
      })
      .returning();

    return created;
  }
}
