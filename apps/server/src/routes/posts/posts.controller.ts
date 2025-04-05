import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UploadedFile,
  UseInterceptors,
} from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { Request } from "express";

import { CreatePostDto, UpdatePostDto } from "./posts.dto";
import { PostsService } from "./posts.service";

@Controller("posts")
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Post()
  create(@Body() createPostDto: CreatePostDto) {
    return this.postsService.create(createPostDto);
  }

  @Get()
  findAll(@Req() req: Request) {
    return this.postsService.findAll(req);
  }

  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.postsService.findOne(id);
  }

  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.postsService.remove(id);
  }

  @Patch(":id")
  update(@Param("id") id: string, @Body() updatePostDto: UpdatePostDto) {
    return this.postsService.update(id, updatePostDto);
  }

  @Patch(":id/cover")
  @UseInterceptors(FileInterceptor("cover"))
  updateCover(
    @Param("id") id: string,
    @UploadedFile() cover: Express.Multer.File
  ) {
    return this.postsService.updateCover(id, cover);
  }

  @Patch(":id/file")
  @UseInterceptors(FileInterceptor("file"))
  updateFile(
    @Param("id") id: string,
    @UploadedFile() file: Express.Multer.File
  ) {
    return this.postsService.updateFile(id, file);
  }
}
