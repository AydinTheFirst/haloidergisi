import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from "@nestjs/common";

import { AllowAnonymous, PrismaQuery, type PrismaQueryParams, Roles } from "@/decorators";
import { AuthGuard } from "@/guards";

import { CreatePostDto } from "./dto/create-post.dto";
import { UpdatePostDto } from "./dto/update-post.dto";
import { PostsService } from "./posts.service";

@Controller("posts")
@UseGuards(AuthGuard)
@AllowAnonymous()
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Post()
  @Roles("ADMIN")
  create(@Body() createPostDto: CreatePostDto) {
    return this.postsService.create(createPostDto);
  }

  @Get()
  findAll(@PrismaQuery() query: PrismaQueryParams) {
    return this.postsService.findAll(query);
  }

  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.postsService.findOne(+id);
  }

  @Roles("ADMIN")
  @Patch(":id")
  update(@Param("id") id: string, @Body() updatePostDto: UpdatePostDto) {
    return this.postsService.update(+id, updatePostDto);
  }

  @Roles("ADMIN")
  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.postsService.remove(+id);
  }
}
