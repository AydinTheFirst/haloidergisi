import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from "@nestjs/common";

import { AdminGuard, AuthGuard } from "@/common/guards";

import { CommentsService } from "../comments/comments.service";
import { CreatePostDto, PostQueryDto, UpdatePostDto } from "./posts.dto";
import { PostsService } from "./posts.service";

@Controller("posts")
export class PostsController {
  constructor(
    private readonly postsService: PostsService,
    private readonly commentsService: CommentsService,
  ) {}

  @Post()
  @UseGuards(AuthGuard, AdminGuard)
  create(@Body() createPostDto: CreatePostDto) {
    return this.postsService.create(createPostDto);
  }

  @Get()
  findAll(@Query() query: PostQueryDto) {
    return this.postsService.findAllPosts(query);
  }

  @Get("admin")
  @UseGuards(AuthGuard, AdminGuard)
  findAllByAdmin(@Query() query: PostQueryDto) {
    return this.postsService.findAllAdminPosts(query);
  }

  @Get(":postId/comments")
  findAllCommentsByPostId(@Param("postId") postId: string) {
    return this.commentsService.findByPostId(postId);
  }

  @Get(":id/reactions")
  findAllReactionsByPostId(@Param("id") id: string) {
    return this.postsService.findAllReactionsByPostId(id);
  }

  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.postsService.findOne(id);
  }

  @Get(":id/related")
  findRelated(@Param("id") id: string, @Query("limit") limit: number) {
    return this.postsService.findRelated(id, limit);
  }

  @Delete(":id")
  @UseGuards(AuthGuard, AdminGuard)
  remove(@Param("id") id: string) {
    return this.postsService.remove(id);
  }

  @Patch(":id")
  @UseGuards(AuthGuard, AdminGuard)
  update(@Param("id") id: string, @Body() updatePostDto: UpdatePostDto) {
    return this.postsService.update(id, updatePostDto);
  }
}
