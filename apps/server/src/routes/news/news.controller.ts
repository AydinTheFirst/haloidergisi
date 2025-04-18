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
import { Role } from "@prisma/client";

import { Roles } from "@/common/decorators";
import { BaseQueryDto } from "@/common/dto/query.dto";
import { AuthGuard } from "@/common/guards";

import { CreateNewsDto, UpdateNewsDto } from "./news.dto";
import { NewsService } from "./news.service";

@Controller("news")
export class NewsController {
  constructor(private readonly newsService: NewsService) {}

  @Post()
  @Roles([Role.ADMIN])
  @UseGuards(AuthGuard)
  create(@Body() createNewsDto: CreateNewsDto) {
    return this.newsService.create(createNewsDto);
  }

  @Get()
  findAll(@Query() query: BaseQueryDto) {
    return this.newsService.findAllNews(query);
  }

  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.newsService.findOne(id);
  }

  @Delete(":id")
  @Roles([Role.ADMIN])
  @UseGuards(AuthGuard)
  remove(@Param("id") id: string) {
    return this.newsService.remove(id);
  }

  @Patch(":id")
  @Roles([Role.ADMIN])
  @UseGuards(AuthGuard)
  update(@Param("id") id: string, @Body() updateNewsDto: UpdateNewsDto) {
    return this.newsService.update(id, updateNewsDto);
  }
}
