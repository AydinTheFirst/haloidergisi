import { Injectable, NotFoundException } from "@nestjs/common";

import { S3Service } from "@/modules";
import { PrismaService } from "@/prisma";

import { CreatePostDto, UpdatePostDto } from "./posts.dto";

@Injectable()
export class PostsService {
  constructor(
    private prisma: PrismaService,
    private s3: S3Service
  ) {}
  async create(createPostDto: CreatePostDto) {
    const { categoryId, ...data } = createPostDto;

    const post = await this.prisma.post.create({
      data: {
        ...data,
        category: {
          connect: {
            id: categoryId,
          },
        },
        cover: "",
        file: "",
      },
    });

    return post;
  }

  async findAll() {
    const posts = await this.prisma.post.findMany();
    return posts;
  }

  async findOne(id: string) {
    const post = await this.prisma.post.findUnique({
      where: { id },
    });

    if (!post) {
      throw new NotFoundException("Post not found");
    }

    return post;
  }

  async remove(id: string) {
    await this.findOne(id);

    await this.prisma.post.delete({
      where: { id },
    });

    return true;
  }

  async update(id: string, updatePostDto: UpdatePostDto) {
    await this.findOne(id);

    const post = await this.prisma.post.update({
      data: updatePostDto,
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
