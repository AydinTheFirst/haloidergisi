import { Module } from "@nestjs/common";

import { SquadController } from "./squads.controller";
import { SquadService } from "./squads.service";

@Module({
  controllers: [SquadController],
  providers: [SquadService],
})
export class SquadModule {}
