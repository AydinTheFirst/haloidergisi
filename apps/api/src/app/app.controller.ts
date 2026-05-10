import { Controller, Get } from "@nestjs/common";

import { AllowAnonymous } from "@/decorators";

import { AppService } from "./app.service";

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @AllowAnonymous()
  getHello(): string {
    return this.appService.getHello();
  }
}
