import { Injectable, NotFoundException } from "@nestjs/common";
import { Request } from "express";
import slugify from "slugify";

import { BaseQueryDto } from "@/common/dto/query.dto";
import { BaseService } from "@/common/services/base.service";
import { S3Service } from "@/modules";
import { Post, Prisma, PrismaService, User } from "@/prisma";

import { CreatePostDto, UpdatePostDto } from "./posts.dto";

@Injectable()
export class PostsService extends BaseService<Post> {
  constructor(
    private prisma: PrismaService,
    private s3: S3Service
  ) {
    super(prisma.post);
  }

  async create(createPostDto: CreatePostDto) {
    const post = await this.prisma.post.create({
      data: {
        slug: this.makeSlug(createPostDto.title),
        ...createPostDto,
      },
    });

    return post;
  }

  async findAllPosts(query: BaseQueryDto, req: Request) {
    const posts = await this.findAll(
      query,
      ["title", "description"],
      this.getPostWhereClause(req.user)
    );

    return posts;
  }

  async findOne(id: string) {
    const post = await this.prisma.post.findFirst({
      where: { OR: [{ id }, { slug: id }] },
    });

    if (!post) {
      throw new NotFoundException("Post not found");
    }

    return post;
  }

  getPostWhereClause(user?: User): Prisma.PostWhereInput {
    if (user && user.roles.includes("ADMIN")) {
      return {};
    }

    return {
      status: "PUBLISHED",
    };
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

    await this.prisma.post.delete({
      where: { id },
    });

    return true;
  }

  async update(id: string, updatePostDto: UpdatePostDto) {
    const existing = await this.findOne(id);

    const slug =
      updatePostDto.title !== existing.title
        ? this.makeSlug(updatePostDto.title)
        : existing.slug;

    const post = await this.prisma.post.update({
      data: {
        slug,
        ...updatePostDto,
      },
      where: { id },
    });

    return post;
  }

  async updateCover(id: string, cover: Express.Multer.File) {
    const post = await this.findOne(id);

    if (post.cover) {
      await this.s3.deleteFile(post.cover);
    }

    const uploadedCover = await this.s3.uploadFile(cover);

    const updatedPost = await this.prisma.post.update({
      data: {
        cover: uploadedCover,
      },
      where: { id },
    });

    return updatedPost;
  }

  async updateFile(id: string, file: Express.Multer.File) {
    const post = await this.findOne(id);

    if (post.file) {
      await this.s3.deleteFile(post.file);
    }

    const uploadedFile = await this.s3.uploadFile(file);

    const updatedPost = await this.prisma.post.update({
      data: {
        file: uploadedFile,
      },
      where: { id },
    });

    return updatedPost;
  }
}
