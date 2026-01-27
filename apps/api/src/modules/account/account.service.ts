import { MailerService } from "@nestjs-modules/mailer";
import { BadRequestException, Injectable } from "@nestjs/common";
import { Cron } from "@nestjs/schedule";
import { render } from "@react-email/render";
import { VerifyEmail } from "@repo/emails";
import argon from "argon2";
import crypto from "crypto";

import { PrismaService } from "@/database";

import { UsersService } from "../users/users.service";
import { ChangePasswordDto, UpdateAccountDto, UpdateNotificationsDto } from "./account.dto";
@Injectable()
export class AccountService {
  private readonly emailVerifications = new Map<string, string>();
  constructor(
    private readonly prisma: PrismaService,
    private readonly usersService: UsersService,
    private readonly mailerService: MailerService,
  ) {}

  findOne(userId: string) {
    return this.usersService.findOne(userId);
  }

  async getNotifications(userId: string) {
    const settings = await this.prisma.notificationSettings.findUnique({
      where: { userId },
    });

    return settings;
  }

  async updateNotifications(userId: string, data: UpdateNotificationsDto) {
    const settings = await this.prisma.notificationSettings.upsert({
      where: { userId },
      update: { ...data },
      create: { userId, ...data },
    });

    return settings;
  }

  async getProviders(userId: string) {
    const providers = await this.prisma.provider.findMany({
      where: { userId },
    });

    return providers;
  }

  update(userId: string, data: UpdateAccountDto) {
    return this.usersService.update(userId, data);
  }

  remove(userId: string) {
    return this.usersService.remove(userId);
  }

  async changePassword(userId: string, data: ChangePasswordDto) {
    const user = await this.usersService.findOne(userId);

    const isCurrentPasswordValid = await argon.verify(user.password!, data.currentPassword);

    if (!isCurrentPasswordValid) {
      throw new BadRequestException("Current password is incorrect");
    }

    await this.usersService.update(userId, {
      password: data.newPassword, // will be hashed in UsersService
    });

    return { success: true };
  }

  async requestEmailVerification(userId: string) {
    const alreadyRequested = Array.from(this.emailVerifications.values()).includes(userId);
    if (alreadyRequested) {
      throw new BadRequestException(
        "Email verification already requested. Please check your email.",
      );
    }

    const token = crypto.randomBytes(32).toString("hex");
    this.emailVerifications.set(token, userId);

    const user = await this.usersService.findOne(userId);

    await this.mailerService.sendMail({
      to: user.email,
      subject: "Email Doğrulama Talebi",
      html: await render(VerifyEmail({ token, name: user.profile?.name || "Kullanıcı" })),
    });

    this.emailVerifications.set(token, userId);

    return { success: true };
  }

  async verifyEmail(userId: string, token: string) {
    const storedUserId = this.emailVerifications.get(token);

    if (storedUserId !== userId) {
      throw new BadRequestException("Invalid or expired email verification token");
    }

    await this.usersService.update(userId, { emailVerifiedAt: new Date() });

    this.emailVerifications.delete(token);

    return { success: true };
  }

  @Cron("0 */1 * * *")
  clearEmailVerificationTokens() {
    this.emailVerifications.clear();
  }

  async removeProvider(userId: string, providerId: string) {
    const provider = await this.prisma.provider.findFirst({
      where: { id: providerId, userId },
    });

    if (!provider) {
      throw new BadRequestException("No linked provider found.");
    }

    await this.prisma.provider.delete({
      where: { id: provider.id },
    });

    return { success: true };
  }
}
