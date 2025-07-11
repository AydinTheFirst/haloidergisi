import { Injectable, NotFoundException } from "@nestjs/common";
import slugify from "slugify";

import { BaseService } from "@/common/services/base.service";
import { Post, Prisma, PrismaService } from "@/database";
import { S3Service } from "@/modules";

import { CreatePostDto, PostQueryDto, UpdatePostDto } from "./posts.dto";

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

  findAllAdminPosts(query: PostQueryDto) {
    const where: Prisma.PostWhereInput = {};

    if (query.categoryId) {
      where.categoryId = query.categoryId;
    }

    return this.queryAll(query, ["title", "description"], where);
  }

  async findAllPosts(query: PostQueryDto) {
    const where: Prisma.PostWhereInput = {
      status: "PUBLISHED",
    };

    if (query.categoryId) {
      where.categoryId = query.categoryId;
    }

    const posts = await this.queryAll(query, ["title", "description"], where);

    return posts;
  }

  async findAllReactionsByPostId(postId: string) {
    const reactions = await this.prisma.reaction.findMany({
      include: {
        user: {
          select: { id: true, profile: true, username: true },
        },
      },
      where: { postId },
    });

    return {
      items: reactions,
      meta: {
        dislikes: reactions.filter((r) => r.type === "DISLIKE").length,
        likes: reactions.filter((r) => r.type === "LIKE").length,
        total: reactions.length,
      },
    };
  }

  async findOne(id: string) {
    const post = await this.prisma.post.findFirst({
      include: { category: true },
      where: { OR: [{ id }, { slug: id }] },
    });

    if (!post) {
      throw new NotFoundException("Post not found");
    }

    return post;
  }

  async findRelated(id: string, limit = 3) {
    const post = await this.findOne(id);

    const where: Prisma.PostWhereInput = {
      categoryId: post.categoryId,
      id: {
        not: id,
      },
      status: "PUBLISHED",
    };

    const relatedPosts = await this.prisma.post.findMany({
      include: { category: true },
      orderBy: { createdAt: "desc" },
      take: limit,
      where,
    });

    return relatedPosts;
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
