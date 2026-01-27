import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from "@nestjs/common";

import { AllowAnonymous, PrismaQuery, type PrismaQueryParams, Roles } from "@/decorators";
import { AuthGuard } from "@/guards";

import { CategoriesService } from "./categories.service";
import { CreateCategoryDto } from "./dto/create-category.dto";
import { UpdateCategoryDto } from "./dto/update-category.dto";

@Controller("categories")
@UseGuards(AuthGuard)
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Post()
  @Roles("ADMIN")
  create(@Body() createCategoryDto: CreateCategoryDto) {
    return this.categoriesService.create(createCategoryDto);
  }

  @Get()
  @AllowAnonymous()
  findAll(@PrismaQuery(["name"]) query: PrismaQueryParams) {
    return this.categoriesService.findAll(query);
  }

  @Get(":id")
  @AllowAnonymous()
  findOne(@Param("id") id: string) {
    return this.categoriesService.findOne(id);
  }

  @Patch(":id")
  @Roles("ADMIN")
  update(@Param("id") id: string, @Body() updateCategoryDto: UpdateCategoryDto) {
    return this.categoriesService.update(id, updateCategoryDto);
  }

  @Delete(":id")
  @Roles("ADMIN")
  remove(@Param("id") id: string) {
    return this.categoriesService.remove(id);
  }
}
