import { Injectable, NotFoundException } from "@nestjs/common";

import { BaseService } from "@/common/services/base.service";
import { Category, PrismaService } from "@/database";

import {
  CreateCategoryDto,
  QueryCategoryDto,
  UpdateCategoryDto,
} from "./categories.dto";

@Injectable()
export class CategoriesService extends BaseService<Category> {
  constructor(private prisma: PrismaService) {
    super(prisma.category);
  }

  async create(createCategoryDto: CreateCategoryDto) {
    const cateogry = await this.prisma.category.create({
      data: createCategoryDto,
    });

    return cateogry;
  }

  async findAll(query: QueryCategoryDto) {
    const categories = await this.queryAll(query, ["title", "description"]);

    return categories;
  }

  async findOne(id: string) {
    const category = await this.prisma.category.findUnique({
      include: {
        posts: true,
      },
      where: { id },
    });

    if (!category) {
      throw new NotFoundException("Category not found");
    }

    return category;
  }

  findPosts(id: string) {
    const posts = this.prisma.post.findMany({
      where: { categoryId: id },
    });

    return posts;
  }

  async remove(id: string) {
    await this.findOne(id);

    await this.prisma.category.delete({
      where: { id },
    });

    return true;
  }

  async update(id: string, updateCategoryDto: UpdateCategoryDto) {
    await this.findOne(id);

    const category = await this.prisma.category.update({
      data: updateCategoryDto,
      where: { id },
    });

    return category;
  }
}
