import { BadRequestException, Injectable } from "@nestjs/common";

import { PrismaService } from "@/database";
import { PrismaQueryParams } from "@/decorators";

import { UpdateProfileDto } from "./profile.dto";

@Injectable()
export class ProfileService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(query: PrismaQueryParams) {
    const [items, count] = await this.prisma.$transaction([
      this.prisma.profile.findMany(query),
      this.prisma.profile.count({ where: query.where }),
    ]);

    return { items, meta: { total: count, skip: query.skip, take: query.take } };
  }

  async findOne(id: number) {
    const profile = await this.prisma.profile.findUnique({
      where: { id },
    });

    if (!profile) {
      throw new BadRequestException("Profile not found");
    }

    return profile;
  }

  async findByUserId(userId: number) {
    const profile = await this.prisma.profile.findUnique({
      where: { userId },
    });

    if (!profile) {
      throw new BadRequestException("Profile not found");
    }

    return profile;
  }

  async update(id: number, data: UpdateProfileDto) {
    await this.findOne(id);

    const updatedProfile = await this.prisma.profile.update({
      where: { id },
      data,
    });

    return updatedProfile;
  }
}
