import { Module } from "@nestjs/common";

import { AdminCommentsController } from "./admin.comments.controller";
import { CommentsController } from "./comments.controller";
import { CommentsService } from "./comments.service";

@Module({
  controllers: [CommentsController, AdminCommentsController],
  exports: [CommentsService],
  providers: [CommentsService],
})
export class CommentsModule {}
