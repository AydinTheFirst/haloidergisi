import { Controller, Get, Header } from "@nestjs/common";

import { AllowAnonymous } from "@/decorators";

import { SitemapService } from "./sitemap.service";

@Controller("sitemap")
@AllowAnonymous()
export class SitemapController {
  constructor(private readonly sitemapService: SitemapService) {}

  @Get("xml")
  @Header("Content-Type", "application/xml")
  async getSitemap() {
    return this.sitemapService.generateSitemap();
  }
}
