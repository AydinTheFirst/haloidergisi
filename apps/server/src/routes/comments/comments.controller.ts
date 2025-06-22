import {
  Body,
  Controller,
  Delete,
  Param,
  Patch,
  Post,
  UseGuards,
} from "@nestjs/common";

import { GetUser } from "@/common/decorators";
import { AuthGuard } from "@/common/guards";

import { CreateCommentDto, UpdateCommentDto } from "./comments.dto";
import { CommentsService } from "./comments.service";

@Controller("comments")
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @Post()
  @UseGuards(AuthGuard)
  create(
    @Body() createCommentDto: CreateCommentDto,
    @GetUser("id") userId: string
  ) {
    return this.commentsService.create(createCommentDto, userId);
  }

  @Delete(":id")
  @UseGuards(AuthGuard)
  remove(@Param("id") id: string, @GetUser("id") userId: string) {
    return this.commentsService.remove(id, userId);
  }

  @Patch(":id")
  @UseGuards(AuthGuard)
  update(
    @Param("id") id: string,
    @Body() updateCommentDto: UpdateCommentDto,
    @GetUser("id") userId: string
  ) {
    return this.commentsService.update(id, updateCommentDto, userId);
  }
}
