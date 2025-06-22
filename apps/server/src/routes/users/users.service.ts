import { Injectable, NotFoundException } from "@nestjs/common";
import argon2 from "argon2";

import { BaseService } from "@/common/services/base.service";
import { PrismaService, User } from "@/database";

import { CreateUserDto, QueryUsersDto, UpdateUserDto } from "./users.dto";

@Injectable()
export class UsersService extends BaseService<User> {
  constructor(private prisma: PrismaService) {
    super(prisma.user);
  }

  async create(createUserDto: CreateUserDto) {
    const hashedPassword = await argon2.hash(createUserDto.password);

    const user = await this.prisma.user.create({
      data: {
        ...createUserDto,
        password: hashedPassword,
      },
    });

    return user;
  }

  async findAll(query: QueryUsersDto) {
    const users = await this.queryAll(query, ["username", "email"]);
    return users;
  }

  async findOne(id: string) {
    const user = await this.prisma.user.findUnique({
      include: { profile: true },
      where: { id },
    });

    if (!user) throw new NotFoundException("User not found");

    return user;
  }

  async remove(id: string) {
    await this.findOne(id);

    await this.prisma.user.delete({
      where: { id },
    });

    return { success: true };
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    await this.findOne(id);

    if (updateUserDto.password) {
      const hashedPassword = await argon2.hash(updateUserDto.password);
      updateUserDto.password = hashedPassword;
    }

    const updatedUser = await this.prisma.user.update({
      data: updateUserDto,
      where: { id },
    });

    return updatedUser;
  }
}
