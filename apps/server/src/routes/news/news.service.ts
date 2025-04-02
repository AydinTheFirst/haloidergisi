import { Injectable, NotFoundException } from "@nestjs/common";

import { PrismaService } from "@/prisma";

import { CreateNewsDto, UpdateNewsDto } from "./news.dto";

@Injectable()
export class NewsService {
  constructor(private prisma: PrismaService) {}

  async create(createNewsDto: CreateNewsDto) {
    const news = await this.prisma.news.create({
      data: createNewsDto,
    });

    return news;
  }

  async findAll() {
    const news = await this.prisma.news.findMany();

    return news;
  }

  async findOne(id: string) {
    const news = await this.prisma.news.findUnique({
      where: { id },
    });

    if (!news) throw new NotFoundException("News not found");

    return news;
  }

  async remove(id: string) {
    await this.findOne(id);

    await this.prisma.news.delete({
      where: { id },
    });

    return { success: true };
  }

  async update(id: string, updateNewsDto: UpdateNewsDto) {
    await this.findOne(id);

    const news = await this.prisma.news.update({
      data: updateNewsDto,
      where: { id },
    });

    return news;
  }
}
