import { Injectable } from "@nestjs/common";
import argon from "argon2";

import { PrismaService } from "@/database";

import { UpdateAccountDto, UpdatePasswordDto, UpdateProfileDto } from "./account.dto";

@Injectable()
export class AccountService {
  constructor(private prisma: PrismaService) {}

  async findOne(id: string) {
    const user = await this.prisma.user.findUnique({
      include: {
        comments: true,
        profile: true,
        reactions: true,
        squad: true,
      },
      where: { id },
    });

    return user;
  }

  async update(id: string, updateAccountDto: UpdateAccountDto) {
    const user = await this.findOne(id);

    const { email, username } = updateAccountDto;

    const existingUser = await this.prisma.user.findFirst({
      where: {
        id: { not: id },
        OR: [{ email }, { username }],
      },
    });

    if (existingUser) {
      throw new Error("Email or username already exists");
    }

    const isNewEmail = user.email !== email;

    const updatedUser = await this.prisma.user.update({
      data: {
        ...updateAccountDto,
        emailVerifiedAt: isNewEmail ? null : user.emailVerifiedAt,
      },
      where: { id },
    });

    return updatedUser;
  }

  async updatePassword(id: string, updatePasswordDto: UpdatePasswordDto) {
    const user = await this.prisma.user.findUnique({
      where: { id },
    });

    const { currentPassword, newPassword } = updatePasswordDto;
    const isPasswordValid = await argon.verify(user.password, currentPassword);
    if (!isPasswordValid) {
      throw new Error("Current password is incorrect");
    }

    const hashedNewPassword = await argon.hash(newPassword);

    const updatedUser = await this.prisma.user.update({
      data: { password: hashedNewPassword },
      where: { id },
    });

    return updatedUser;
  }

  async updateProfile(id: string, updateProfileDto: UpdateProfileDto) {
    const profile = await this.prisma.profile.update({
      data: updateProfileDto,
      where: { userId: id },
    });

    return profile;
  }
}
