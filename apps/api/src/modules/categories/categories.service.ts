import { Injectable, NotFoundException } from "@nestjs/common";

import { PrismaService } from "@/database";
import { PrismaQueryParams } from "@/decorators";

import { CreateCategoryDto } from "./dto/create-category.dto";
import { UpdateCategoryDto } from "./dto/update-category.dto";

@Injectable()
export class CategoriesService {
  constructor(private prisma: PrismaService) {}

  async create(createCategoryDto: CreateCategoryDto) {
    const category = await this.prisma.category.create({ data: createCategoryDto });
    return category;
  }

  async findAll(query: PrismaQueryParams) {
    const [items, total] = await this.prisma.$transaction([
      this.prisma.category.findMany(query),
      this.prisma.category.count({ where: query.where }),
    ]);

    return { items, meta: { total, skip: query.skip, take: query.take } };
  }

  async findOne(id: string) {
    const category = await this.prisma.category.findUnique({ where: { id } });

    if (!category) {
      throw new NotFoundException(`Category with ID ${id} not found`);
    }

    return category;
  }

  async update(id: string, updateCategoryDto: UpdateCategoryDto) {
    await this.findOne(id);

    const category = await this.prisma.category.update({
      where: { id },
      data: updateCategoryDto,
    });

    return category;
  }

  async remove(id: string) {
    await this.findOne(id);

    await this.prisma.category.delete({ where: { id } });

    return { success: true };
  }
}
