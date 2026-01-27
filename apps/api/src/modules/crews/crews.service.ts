import { Injectable, NotFoundException } from "@nestjs/common";

import { PrismaService } from "@/database";
import { PrismaQueryParams } from "@/decorators";

import { CreateCrewDto } from "./dto/create-crew.dto";
import { UpdateCrewDto } from "./dto/update-crew.dto";

@Injectable()
export class CrewsService {
  constructor(private prisma: PrismaService) {}

  async create(createCrewDto: CreateCrewDto) {
    const crew = await this.prisma.crew.create({ data: createCrewDto });
    return crew;
  }

  async findAll(query: PrismaQueryParams) {
    const [items, total] = await this.prisma.$transaction([
      this.prisma.crew.findMany({
        ...query,
        include: { users: { select: { id: true, profile: true } } },
      }),
      this.prisma.crew.count({ where: query.where }),
    ]);

    return { items, meta: { total, skip: query.skip, take: query.take } };
  }

  async findOne(id: string) {
    const crew = await this.prisma.crew.findUnique({ where: { id } });

    if (!crew) {
      throw new NotFoundException(`Crew with ID ${id} not found`);
    }

    return crew;
  }

  async update(id: string, updateCrewDto: UpdateCrewDto) {
    await this.findOne(id);

    const crew = await this.prisma.crew.update({
      where: { id },
      data: updateCrewDto,
    });

    return crew;
  }

  async remove(id: string) {
    await this.findOne(id);

    await this.prisma.crew.delete({ where: { id } });

    return { success: true };
  }
}
