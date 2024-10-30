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

import { Roles } from "@/common/decorators";
import { AuthGuard } from "@/common/guards";

import { CreateCategoryDto, UpdateCategoryDto } from "./categories.dto";
import { CategoriesService } from "./categories.service";

@Controller("categories")
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Post()
  @UseGuards(AuthGuard)
  @Roles(["ADMIN"])
  create(@Body() createCategoryDto: CreateCategoryDto) {
    return this.categoriesService.create(createCategoryDto);
  }

  @Get()
  findAll() {
    return this.categoriesService.findAll();
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
  @UseGuards(AuthGuard)
  @Roles(["ADMIN"])
  remove(@Param("id") id: string) {
    return this.categoriesService.remove(id);
  }

  @Patch(":id")
  @UseGuards(AuthGuard)
  @Roles(["ADMIN"])
  update(
    @Param("id") id: string,
    @Body() updateCategoryDto: UpdateCategoryDto
  ) {
    return this.categoriesService.update(id, updateCategoryDto);
  }
}
