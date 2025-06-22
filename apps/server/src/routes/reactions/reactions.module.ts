import { Module } from "@nestjs/common";

import { AdminReactionsController } from "./admin.reactions.controller";
import { ReactionsController } from "./reactions.controller";
import { ReactionsService } from "./reactions.service";

@Module({
  controllers: [ReactionsController, AdminReactionsController],
  providers: [ReactionsService],
})
export class ReactionsModule {}
