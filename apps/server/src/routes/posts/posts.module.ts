import { Module } from "@nestjs/common";

import { PostsController } from "./posts.controller";
import { PostsService } from "./posts.service";

@Module({
  controllers: [PostsController],
  exports: [PostsService],
  providers: [PostsService],
})
export class PostsModule {}
