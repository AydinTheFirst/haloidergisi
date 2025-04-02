import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from "@nestjs/common";
import { Role } from "@prisma/client";

import { Roles } from "@/common/decorators";
import { AuthGuard } from "@/common/guards";

import { CreateNewsDto, UpdateNewsDto } from "./news.dto";
import { NewsService } from "./news.service";

@Controller("news")
export class NewsController {
  constructor(private readonly newsService: NewsService) {}

  @Post()
  @UseGuards(AuthGuard)
  @Roles([Role.ADMIN])
  create(@Body() createNewsDto: CreateNewsDto) {
    return this.newsService.create(createNewsDto);
  }

  @Get()
  findAll() {
    return this.newsService.findAll();
  }

  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.newsService.findOne(id);
  }

  @Delete(":id")
  @UseGuards(AuthGuard)
  @Roles([Role.ADMIN])
  remove(@Param("id") id: string) {
    return this.newsService.remove(id);
  }

  @Patch(":id")
  @UseGuards(AuthGuard)
  @Roles([Role.ADMIN])
  update(@Param("id") id: string, @Body() updateNewsDto: UpdateNewsDto) {
    return this.newsService.update(id, updateNewsDto);
  }
}
