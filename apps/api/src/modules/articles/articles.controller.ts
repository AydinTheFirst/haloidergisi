import type { User } from "@repo/db";

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
import { Role } from "@repo/db";

import { Auth, Roles } from "../../decorators/auth.decorators";
import { ArticlesService } from "./articles.service";
import { CreateArticleDto, UpdateArticleDto, UpdateArticleStatusDto } from "./dto/article.dto";
import { ArticleGuard } from "./guards/article.guard";

@Controller("articles")
export class ArticlesController {
  constructor(private readonly articlesService: ArticlesService) {
    console.log("ArticlesController instantiated");
  }

  @Get()
  @Roles(Role.ADMIN)
  findAll(
    @Query("callId") callId?: string,
    @Query("status") status?: string,
    @Query("authorId") authorId?: string,
  ) {
    return this.articlesService.findAll({ callId, status, authorId });
  }

  @Get("my")
  findMyArticles(@Auth("id") userId: string) {
    return this.articlesService.findMyArticles(userId);
  }

  @Get(":id")
  @UseGuards(ArticleGuard)
  findOne(@Param("id") id: string) {
    return this.articlesService.findOne(id);
  }

  @Post()
  create(@Auth("id") userId: string, @Body() dto: CreateArticleDto) {
    return this.articlesService.create(userId, dto);
  }

  @Patch(":id/status")
  @Roles(Role.ADMIN)
  updateStatus(@Param("id") id: string, @Body() dto: UpdateArticleStatusDto) {
    return this.articlesService.updateStatus(id, dto);
  }

  @Patch(":id")
  @UseGuards(ArticleGuard)
  update(@Param("id") id: string, @Body() dto: UpdateArticleDto) {
    return this.articlesService.update(id, dto);
  }

  @Delete(":id")
  @UseGuards(ArticleGuard)
  remove(@Param("id") id: string) {
    return this.articlesService.remove(id);
  }
}
