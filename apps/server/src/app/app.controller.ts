import { Controller, Get } from "@nestjs/common";

import { AppService } from "./app.service";

@Controller()
export class AppController {
  constructor(private appService: AppService) {}

  @Get()
  index() {
    return this.appService.index();
  }

  @Get("/stats")
  stats() {
    return this.appService.stats();
  }
}
