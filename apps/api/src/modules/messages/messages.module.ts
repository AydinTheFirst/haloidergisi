import { Module } from "@nestjs/common";

import { TurnstileService } from "@/services";

import { MessagesController } from "./messages.controller";
import { MessagesService } from "./messages.service";

@Module({
  controllers: [MessagesController],
  providers: [MessagesService, TurnstileService],
})
export class MessagesModule {}
