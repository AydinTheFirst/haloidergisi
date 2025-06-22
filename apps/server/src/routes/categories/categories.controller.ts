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

import { Roles } from "@/common/decorators";
import { AuthGuard } from "@/common/guards";

import {
  CreateCategoryDto,
  QueryCategoryDto,
  UpdateCategoryDto,
} from "./categories.dto";
import { CategoriesService } from "./categories.service";

@Controller("categories")
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Post()
  @Roles(["ADMIN"])
  @UseGuards(AuthGuard)
  create(@Body() createCategoryDto: CreateCategoryDto) {
    return this.categoriesService.create(createCategoryDto);
  }

  @Get()
  findAll(@Query() query: QueryCategoryDto) {
    return this.categoriesService.findAll(query);
  }

  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.categoriesService.findOne(id);
  }

  @Get(":id/posts")
  findPosts(@Param("id") id: string) {
    return this.categoriesService.findPosts(id);
  }

  @Delete(":id")
  @Roles(["ADMIN"])
  @UseGuards(AuthGuard)
  remove(@Param("id") id: string) {
    return this.categoriesService.remove(id);
  }

  @Patch(":id")
  @Roles(["ADMIN"])
  @UseGuards(AuthGuard)
  update(
    @Param("id") id: string,
    @Body() updateCategoryDto: UpdateCategoryDto
  ) {
    return this.categoriesService.update(id, updateCategoryDto);
  }
}
