import { Injectable, NotFoundException } from "@nestjs/common";
import { Request } from "express";

import { PrismaService } from "@/prisma";

import { CreateCategoryDto, UpdateCategoryDto } from "./categories.dto";

@Injectable()
export class CategoriesService {
  constructor(private prisma: PrismaService) {}
  async create(createCategoryDto: CreateCategoryDto) {
    const cateogry = await this.prisma.category.create({
      data: createCategoryDto,
    });

    return cateogry;
  }

  async findAll(req: Request) {
    const includePosts = req.query.posts === "true";
    const categories = await this.prisma.category.findMany({
      include: {
        posts: includePosts ? { where: { status: "PUBLISHED" } } : false,
      },
    });

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
