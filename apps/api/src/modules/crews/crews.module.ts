import { Module } from "@nestjs/common";

import { CrewsController } from "./crews.controller";
import { CrewsService } from "./crews.service";

@Module({
  controllers: [CrewsController],
  providers: [CrewsService],
})
export class CrewsModule {}
