import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Query,
  UseGuards,
} from "@nestjs/common";

import { AdminGuard, AuthGuard } from "@/common/guards";

import { QueryCommentDto, UpdateCommentDto } from "./comments.dto";
import { CommentsService } from "./comments.service";

@Controller("admin/comments")
@UseGuards(AuthGuard, AdminGuard)
export class AdminCommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @Get()
  @UseGuards(AuthGuard, AdminGuard)
  findAll(@Query() query: QueryCommentDto) {
    return this.commentsService.findAll(query);
  }

  @Get(":id")
  findOne(@Param("id") id: string, @Query("userId") userId: string) {
    return this.commentsService.findOne(id, userId);
  }

  @Delete(":id")
  @UseGuards(AuthGuard)
  remove(@Param("id") id: string, @Query("userId") userId: string) {
    return this.commentsService.remove(id, userId);
  }

  @Patch(":id")
  @UseGuards(AuthGuard)
  update(
    @Param("id") id: string,
    @Body() updateCommentDto: UpdateCommentDto,
    @Query("userId") userId: string
  ) {
    return this.commentsService.update(id, updateCommentDto, userId);
  }
}
