import { Injectable, NotFoundException } from "@nestjs/common";

import { PrismaService } from "@/prisma";

import { CreateSquadDto, UpdateSquadDto } from "./squads.dto";

@Injectable()
export class SquadService {
  constructor(private readonly prisma: PrismaService) {}
  async create(createSquadDto: CreateSquadDto) {
    const squad = await this.prisma.squad.create({
      data: createSquadDto,
    });

    return squad;
  }

  async findAll() {
    const squads = await this.prisma.squad.findMany({
      include: {
        users: true,
      },
    });
    return squads;
  }

  async findOne(id: string) {
    const squad = await this.prisma.squad.findUnique({
      include: {
        users: true,
      },
      where: { id },
    });

    if (!squad) {
      throw new NotFoundException("Squad not found");
    }

    return squad;
  }

  async remove(id: string) {
    await this.findOne(id);

    await this.prisma.squad.delete({
      where: { id },
    });

    return true;
  }

  async update(id: string, updateSquadDto: UpdateSquadDto) {
    await this.findOne(id);

    const squad = await this.prisma.squad.update({
      data: updateSquadDto,
      where: { id },
    });

    return squad;
  }

  async updateUsers(id: string, userIds: string[]) {
    const squad = await this.findOne(id);

    const users = await this.prisma.user.findMany({
      where: {
        id: {
          in: userIds,
        },
      },
    });

    await this.prisma.squad.update({
      data: {
        users: {
          set: users.map((user) => ({ id: user.id })),
        },
      },
      where: { id },
    });

    return squad;
  }
}