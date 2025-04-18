import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from "@nestjs/common";
import argon2 from "argon2";
import { Request } from "express";

import { PrismaService } from "@/prisma";
import { getPublicUserSelection } from "@/utils";

import { CreateUserDto, UpdateUserDto, UpdateUserSelfDto } from "./users.dto";

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async create(createUserDto: CreateUserDto) {
    const hashedPassword = await argon2.hash(
      createUserDto.password || crypto.randomUUID(),
    );

    const user = await this.prisma.user.create({
      data: {
        ...createUserDto,
        password: hashedPassword,
      },
    });

    return user;
  }

  async findAll(req: Request) {
    const users = await this.prisma.user.findMany({
      select: this.isAdmin(req) ? null : getPublicUserSelection(),
    });

    return users;
  }

  async findOne(id: string, req: Request) {
    const user = await this.prisma.user.findUnique({
      select: this.isAdmin(req) ? null : getPublicUserSelection(),
      where: { id },
    });

    if (!user) throw new NotFoundException("User not found");

    return user;
  }

  isAdmin(req: Request) {
    if (!req.user) return false;
    if (!req.user.roles.includes("ADMIN")) return false;
    return true;
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

  async updateSelf(req: Request, updateUserDto: UpdateUserSelfDto) {
    if (!req.user) throw new UnauthorizedException();

    await this.findOne(req.user.id, req);

    const updated = await this.prisma.user.update({
      data: updateUserDto,
      where: { id: req.user.id },
    });

    return updated;
  }
}
