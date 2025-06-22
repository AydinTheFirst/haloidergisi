import { Injectable, NotFoundException } from "@nestjs/common";

import { BaseService } from "@/common/services/base.service";
import { Comment, Prisma, PrismaService } from "@/database";

import {
  CreateCommentDto,
  QueryCommentDto,
  UpdateCommentDto,
} from "./comments.dto";

@Injectable()
export class CommentsService extends BaseService<Comment> {
  userArgs: Prisma.UserDefaultArgs = {
    select: { id: true, profile: true, username: true },
  };

  commentInclude: Prisma.CommentInclude = {
    replies: {
      include: {
        user: this.userArgs,
      },
    },
    replyTo: {
      include: {
        user: this.userArgs,
      },
    },
    user: this.userArgs,
  };

  constructor(private prisma: PrismaService) {
    super(prisma.comment);
  }

  async create(createCommentDto: CreateCommentDto, userId: string) {
    const { postId, replyToId, ...rest } = createCommentDto;

    const comment = await this.prisma.comment.create({
      data: {
        ...rest,
        post: { connect: { id: postId } },
        replyTo: replyToId ? { connect: { id: replyToId } } : undefined,
        user: { connect: { id: userId } },
      },
    });

    return comment;
  }

  async findAll(query: QueryCommentDto) {
    const comments = await this.queryAll(query, ["content"]);
    return comments;
  }

  async findByPostId(postId: string) {
    const comments = await this.prisma.comment.findMany({
      include: this.commentInclude,
      where: { postId },
    });

    return comments;
  }

  async findOne(id: string, userId: string) {
    const comment = await this.prisma.comment.findFirst({
      include: this.commentInclude,
      where: {
        id,
        userId,
      },
    });

    if (!comment) {
      throw new NotFoundException("Comment not found");
    }

    return comment;
  }

  async remove(id: string, userId: string) {
    await this.findOne(id, userId);

    await this.prisma.comment.delete({
      where: { id },
    });

    return { success: true };
  }

  async update(id: string, updateCommentDto: UpdateCommentDto, userId: string) {
    await this.findOne(id, userId);

    const updatedComment = await this.prisma.comment.update({
      data: updateCommentDto,
      include: this.commentInclude,
      where: { id },
    });

    return updatedComment;
  }
}
