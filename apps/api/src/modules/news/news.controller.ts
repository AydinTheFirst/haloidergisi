import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from "@nestjs/common";
import { Role } from "@repo/db";

import { Auth, Roles, AllowAnonymous, OptionalAuth } from "../../decorators/auth.decorators";
import { CreateNewsDto, UpdateNewsDto } from "./dto/news.dto";
import { NewsService } from "./news.service";

@Controller("news")
export class NewsController {
  constructor(private readonly newsService: NewsService) {}

  @Get()
  @OptionalAuth()
  findAll(@Auth() user?: any) {
    const isAdmin = user?.roles?.includes(Role.ADMIN);
    return this.newsService.findAll(isAdmin);
  }

  @Get(":idOrSlug")
  @OptionalAuth()
  findOne(@Param("idOrSlug") idOrSlug: string, @Auth() user?: any) {
    const isAdmin = user?.roles?.includes(Role.ADMIN);
    return this.newsService.findOne(idOrSlug, isAdmin);
  }

  @Post()
  @Roles(Role.ADMIN)
  create(@Auth("id") userId: string, @Body() dto: CreateNewsDto) {
    return this.newsService.create(userId, dto);
  }

  @Patch(":id")
  @Roles(Role.ADMIN)
  update(@Param("id") id: string, @Body() dto: UpdateNewsDto) {
    return this.newsService.update(id, dto);
  }

  @Delete(":id")
  @Roles(Role.ADMIN)
  remove(@Param("id") id: string) {
    return this.newsService.remove(id);
  }
}
