import { Injectable, NotFoundException } from "@nestjs/common";
import { Prisma, Reaction, ReactionType } from "@prisma/client";

import { BaseService } from "@/common/services/base.service";
import { PrismaService } from "@/database";

import {
  CreateReactionDto,
  QueryReactionDto,
  ReactionDto,
  UpdateReactionDto,
} from "./reaction.dto";

@Injectable()
export class ReactionsService extends BaseService<Reaction> {
  constructor(private prisma: PrismaService) {
    super(prisma.reaction);
  }

  async create(createReactionDto: CreateReactionDto) {
    const reaction = await this.prisma.reaction.create({
      data: {
        post: { connect: { id: createReactionDto.postId } },
        type: createReactionDto.type,
        user: { connect: { id: createReactionDto.userId } },
      },
    });
    return reaction;
  }

  async findAll(query: QueryReactionDto) {
    const where: Prisma.ReactionWhereInput = {};

    if (query.postId) {
      where.postId = query.postId;
    }

    if (query.userId) {
      where.userId = query.userId;
    }

    if (query.type) {
      where.type = query.type;
    }

    const reactions = await this.queryAll(query, [], where);

    return reactions;
  }

  async findOne(id: string) {
    const reaction = await this.prisma.reaction.findUnique({
      include: {
        post: true,
        user: { select: { id: true, profile: true, username: true } },
      },
      where: { id },
    });

    if (!reaction) {
      throw new NotFoundException(`Reaction with id ${id} not found`);
    }

    return reaction;
  }

  async getReactions(postId: string) {
    const reactions = await this.prisma.reaction.findMany({
      where: { postId },
    });

    const likes = reactions.filter((reaction) => reaction.type === ReactionType.LIKE).length;

    const dislikes = reactions.filter((reaction) => reaction.type === ReactionType.DISLIKE).length;

    return {
      dislikes,
      likes,
      total: reactions.length,
    };
  }

  async remove(id: string) {
    await this.findOne(id);

    await this.prisma.reaction.delete({
      where: { id },
    });

    return { success: true };
  }

  async removeReaction(userId: string, id: string) {
    await this.prisma.reaction.delete({
      where: { id, userId },
    });

    return { success: true };
  }

  async update(id: string, updateReactionDto: UpdateReactionDto) {
    await this.findOne(id);

    const reaction = await this.prisma.reaction.update({
      data: {
        type: updateReactionDto.type,
      },
      where: { id },
    });

    return reaction;
  }

  async upsertReaction(userId: string, { postId, type }: ReactionDto) {
    return this.prisma.reaction.upsert({
      create: {
        postId,
        type,
        userId,
      },
      update: {
        type,
      },
      where: {
        postId_userId: { postId, userId },
      },
    });
  }
}
