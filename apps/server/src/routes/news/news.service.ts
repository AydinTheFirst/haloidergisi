import { Injectable, NotFoundException } from "@nestjs/common";
import slugify from "slugify";

import { BaseQueryDto } from "@/common/dto/query.dto";
import { BaseService } from "@/common/services/base.service";
import { News, PrismaService } from "@/database";

import { CreateNewsDto, UpdateNewsDto } from "./news.dto";

@Injectable()
export class NewsService extends BaseService<News> {
  constructor(private prisma: PrismaService) {
    super(prisma.news);
  }

  async create(createNewsDto: CreateNewsDto) {
    const news = await this.prisma.news.create({
      data: {
        slug: this.makeSlug(createNewsDto.title),
        ...createNewsDto,
      },
    });

    return news;
  }

  async findAllNews(query: BaseQueryDto) {
    const news = await this.queryAll(query, ["title", "description"]);

    return news;
  }

  async findOne(id: string) {
    const news = await this.prisma.news.findFirst({
      where: { OR: [{ id }, { slug: id }] },
    });

    if (!news) throw new NotFoundException("News not found");

    return news;
  }

  makeSlug(title: string) {
    const slug = slugify(title, {
      lower: true,
      strict: true,
    });
    return slug + "-" + Date.now();
  }

  async remove(id: string) {
    await this.findOne(id);

    await this.prisma.news.delete({
      where: { id },
    });

    return { success: true };
  }

  async update(id: string, updateNewsDto: UpdateNewsDto) {
    const news = await this.findOne(id);

    const slug = updateNewsDto.title ? this.makeSlug(updateNewsDto.title) : news.slug;

    const updated = await this.prisma.news.update({
      data: { ...updateNewsDto, slug },
      where: { id },
    });

    return updated;
  }
}
