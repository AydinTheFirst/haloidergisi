import { BadRequestException, Injectable } from "@nestjs/common";
import slugify from "slugify";

import { PrismaService } from "@/database";
import { PrismaQueryParams } from "@/decorators";

import { CreatePostDto } from "./dto/create-post.dto";
import { UpdatePostDto } from "./dto/update-post.dto";

@Injectable()
export class PostsService {
  constructor(private readonly prismaService: PrismaService) {}

  makeSlug(title: string) {
    return slugify(title, { lower: true, strict: true }) + "-" + Date.now();
  }

  async create(createPostDto: CreatePostDto) {
    const post = await this.prismaService.post.create({
      data: {
        ...createPostDto,
        slug: this.makeSlug(createPostDto.title),
      },
    });

    return post;
  }

  async findAll(query: PrismaQueryParams) {
    const [items, total] = await this.prismaService.$transaction([
      this.prismaService.post.findMany(query),
      this.prismaService.post.count({ where: query.where }),
    ]);

    return { items, meta: { total, take: query.take, skip: query.skip } };
  }

  async findOne(id: number) {
    const post = await this.prismaService.post.findUnique({
      where: { id },
    });

    if (!post) {
      throw new BadRequestException(`Post with id ${id} not found`);
    }

    return post;
  }

  async update(id: number, updatePostDto: UpdatePostDto) {
    await this.findOne(id);

    const updatedPost = await this.prismaService.post.update({
      where: { id },
      data: updatePostDto,
    });

    return updatedPost;
  }

  async remove(id: number) {
    await this.findOne(id);

    await this.prismaService.post.delete({
      where: { id },
    });

    return { success: true };
  }
}
