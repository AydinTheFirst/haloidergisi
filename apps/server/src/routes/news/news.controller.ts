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

import { BaseQueryDto } from "@/common/dto/query.dto";
import { AdminGuard, AuthGuard } from "@/common/guards";

import { CreateNewsDto, UpdateNewsDto } from "./news.dto";
import { NewsService } from "./news.service";

@Controller("news")
export class NewsController {
  constructor(private readonly newsService: NewsService) {}

  @Post()
  @UseGuards(AuthGuard, AdminGuard)
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
  @UseGuards(AuthGuard, AdminGuard)
  remove(@Param("id") id: string) {
    return this.newsService.remove(id);
  }

  @Patch(":id")
  @UseGuards(AuthGuard, AdminGuard)
  update(@Param("id") id: string, @Body() updateNewsDto: UpdateNewsDto) {
    return this.newsService.update(id, updateNewsDto);
  }
}
