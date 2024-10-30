import { Injectable, NotFoundException } from "@nestjs/common";
import argon2 from "argon2";

import { PrismaService, User } from "@/prisma";

import { CreateUserDto, UpdateUserDto } from "./users.dto";

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async create(createUserDto: CreateUserDto) {
    const hashedPassword = await argon2.hash(
      createUserDto.password || crypto.randomUUID()
    );

    const user = await this.prisma.user.create({
      data: {
        ...createUserDto,
        password: hashedPassword,
      },
    });

    return user;
  }

  async findAll(user: User) {
    const users = await this.prisma.user.findMany();
    return this.isAdmin(user) ? users : users.map((user) => this.mutate(user));
  }

  async findOne(id: string, req?: User) {
    const user = await this.prisma.user.findUnique({
      where: {
        id: id,
      },
    });

    if (!user) throw new NotFoundException("User not found");

    return req ? (this.isAdmin(req) ? user : this.mutate(user)) : user;
  }

  isAdmin(user: User) {
    return user.roles.includes("ADMIN");
  }

  async mutate(user: User) {
    return {
      bio: user.bio,
      displayName: user.displayName,
      email: user.email,
      id: user.id,
      title: user.title,
      website: user.website,
    };
  }

  async remove(id: string) {
    const user = await this.prisma.user.findUnique({
      where: {
        id: id,
      },
    });

    if (!user) throw new NotFoundException("User not found");

    await this.prisma.user.delete({
      where: {
        id: id,
      },
    });

    return user;
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    const user = await this.prisma.user.findUnique({
      where: {
        id: id,
      },
    });

    if (!user) throw new NotFoundException("User not found");

    if (!updateUserDto.password) {
      delete updateUserDto.password;
    } else {
      updateUserDto.password = await argon2.hash(updateUserDto.password);
    }

    await this.prisma.user.update({
      data: updateUserDto,
      where: {
        id: id,
      },
    });

    return user;
  }
}
