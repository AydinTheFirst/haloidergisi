import { MailerService } from "@nestjs-modules/mailer";
import { BadRequestException, Injectable, Logger } from "@nestjs/common";
import { render } from "@react-email/render";
import { ResetPasswordEmail } from "@repo/emails";
import argon2 from "argon2";
import crypto from "crypto";

import { PrismaService } from "@/database";

import { TokensService } from "../tokens/tokens.service";
import { UsersService } from "../users/users.service";
import { LoginDto, RegisterDto, ResetPasswordDto } from "./auth.dto";

@Injectable()
export class AuthService {
  private logger = new Logger(AuthService.name);
  private passwordResetTokens = new Map<string, number>();

  constructor(
    private readonly prismaService: PrismaService,
    private readonly tokensService: TokensService,
    private readonly usersService: UsersService,
    private readonly mailerService: MailerService,
  ) {}

  async register(registerDto: RegisterDto) {
    return this.usersService.create(registerDto);
  }

  async login(loginDto: LoginDto) {
    const { email, password } = loginDto;

    const user = await this.prismaService.user.findUnique({
      where: { email },
    });

    if (!user) {
      throw new BadRequestException("Invalid credentials");
    }

    if (!user.password) {
      // First login
      user.password = await argon2.hash(password);

      await this.prismaService.user.update({
        where: { id: user.id },
        data: { password: user.password },
      });
    } else {
      const isPasswordValid = await argon2.verify(user.password, password);
      if (!isPasswordValid) {
        throw new BadRequestException("Invalid credentials");
      }
    }

    const { token } = await this.tokensService.generateToken(user.id);

    return { token };
  }

  async logout(token: string) {
    return this.tokensService.remove(token);
  }

  async initiatePasswordReset(email: string) {
    const user = await this.prismaService.user.findUnique({
      where: { email },
      include: { profile: true },
    });

    if (!user) {
      throw new BadRequestException("User not found");
    }

    const resetToken = crypto.randomBytes(32).toString("hex");
    this.passwordResetTokens.set(resetToken, user.id);

    // In a real application, you would send this token via email
    this.logger.log(`Password reset token for ${email}: ${resetToken}`);
    await this.mailerService.sendMail({
      to: email,
      subject: "Şifre Sıfırlama Talebi",
      html: await render(
        ResetPasswordEmail({
          name: user.profile?.name || "Kullanıcı",
          token: resetToken,
        }),
      ),
    });

    return { resetToken };
  }

  async resetPassword(body: ResetPasswordDto) {
    const { token, newPassword } = body;
    const userId = this.passwordResetTokens.get(token);

    if (!userId) {
      throw new BadRequestException("Invalid or expired reset token");
    }

    await this.usersService.update(userId, { password: newPassword });

    this.passwordResetTokens.delete(token);

    return { success: true };
  }
}
