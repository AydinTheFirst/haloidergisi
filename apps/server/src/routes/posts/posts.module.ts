import { Module } from "@nestjs/common";

import { CommentsService } from "../comments/comments.service";
import { PostsController } from "./posts.controller";
import { PostsService } from "./posts.service";

@Module({
  controllers: [PostsController],
  exports: [PostsService],
  providers: [PostsService, CommentsService],
})
export class PostsModule {}
