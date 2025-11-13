import { BadRequestException, Injectable } from "@nestjs/common";

import { PrismaService } from "@/database";

import { UpdateProfileDto } from "./profiles.dto";

@Injectable()
export class ProfilesService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    const profiles = await this.prisma.profile.findMany();
    return profiles;
  }

  async findOne(id: string) {
    const profile = await this.prisma.profile.findUnique({
      where: { id },
    });

    if (!profile) {
      throw new BadRequestException("Profile not found");
    }

    return profile;
  }

  async update(id: string, data: UpdateProfileDto) {
    await this.findOne(id);

    const profile = await this.prisma.profile.update({
      data,
      where: { id },
    });

    return profile;
  }
}
