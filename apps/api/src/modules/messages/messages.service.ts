import { Injectable, NotFoundException } from "@nestjs/common";

import { PrismaService } from "@/database";
import { PrismaQueryParams } from "@/decorators";

import { CreateMessageDto } from "./dto/create-message.dto";
import { UpdateMessageDto } from "./dto/update-message.dto";

@Injectable()
export class MessagesService {
  constructor(private prisma: PrismaService) {}

  async create(createMessageDto: CreateMessageDto) {
    const message = await this.prisma.message.create({ data: createMessageDto });
    return message;
  }

  async findAll({ include: _include, ...query }: PrismaQueryParams) {
    const [items, total] = await this.prisma.$transaction([
      this.prisma.message.findMany(query),
      this.prisma.message.count({ where: query.where }),
    ]);

    return { items, meta: { total, skip: query.skip, take: query.take } };
  }

  async findOne(id: string) {
    const message = await this.prisma.message.findUnique({ where: { id } });

    if (!message) {
      throw new NotFoundException(`Message with ID ${id} not found`);
    }

    return message;
  }

  async update(id: string, updateMessageDto: UpdateMessageDto) {
    await this.findOne(id);

    const message = await this.prisma.message.update({
      where: { id },
      data: updateMessageDto,
    });
    return message;
  }

  async remove(id: string) {
    await this.findOne(id);

    await this.prisma.message.delete({ where: { id } });

    return { success: true };
  }
}
