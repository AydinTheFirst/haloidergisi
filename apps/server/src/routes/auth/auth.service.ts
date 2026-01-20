import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import argon from "argon2";

import { PrismaService } from "@/database";

import { LoginDto, RegisterDto } from "./auth.dto";

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService) {}

  async login(body: LoginDto) {
    const user = await this.prisma.user.findFirst({
      where: {
        OR: [{ username: body.username }, { email: body.username }],
      },
    });

    if (!user) throw new NotFoundException("User not found");

    if(!user.password) {
      user.password = await argon.hash(body.password);
    }  else {
      const isValid = await argon.verify(user.password, body.password);
      if (!isValid) throw new BadRequestException("Invalid password or username");
    }

    const token = await this.prisma.token.create({
      data: {
        expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7), // 1 week
        userId: user.id,
      },
    });

    return {
      ...user,
      token: token.token,
    };
  }

  async register(body: RegisterDto) {
    const isExist = await this.prisma.user.findFirst({
      where: {
        OR: [{ email: body.email }],
      },
    });

    if (isExist) {
      throw new BadRequestException("User already exists");
    }

    const hashedPassword = await argon.hash(body.password);

    const user = this.prisma.user.create({
      data: {
        email: body.email,
        password: hashedPassword,
        profile: {
          create: {
            displayName: body.displayName,
          },
        },
      },
    });

    return user;
  }
}
