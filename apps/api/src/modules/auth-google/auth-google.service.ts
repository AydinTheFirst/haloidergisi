import { BadRequestException, Injectable, InternalServerErrorException } from "@nestjs/common";
import { ProviderType, User } from "@repo/db";
import crypto from "crypto";
import { OAuth2Client } from "google-auth-library";

import { PrismaService } from "@/database";

import { TokensService } from "../tokens/tokens.service";
import { UsersService } from "../users/users.service";

@Injectable()
export class AuthGoogleService {
  private client: OAuth2Client;

  constructor(
    private readonly prismaService: PrismaService,
    private readonly usersService: UsersService,
    private readonly tokensService: TokensService,
  ) {
    this.client = new OAuth2Client(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
      process.env.GOOGLE_REDIRECT_URI,
    );
  }

  getAuthUrl() {
    return this.client.generateAuthUrl({
      access_type: "offline",
      scope: ["email", "profile"],
      prompt: "consent",
    });
  }

  async verifyGoogleUser(code: string) {
    try {
      const { tokens } = await this.client.getToken(code);

      this.client.setCredentials(tokens);

      const ticket = await this.client.verifyIdToken({
        idToken: tokens.id_token!,
        audience: process.env.GOOGLE_CLIENT_ID,
      });

      const payload = ticket.getPayload();

      if (!payload || !payload.email) {
        throw new InternalServerErrorException("Google authentication failed");
      }

      return payload;
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException("Google authentication failed");
    }
  }

  async callback(code: string) {
    const payload = await this.verifyGoogleUser(code);

    const provider = await this.prismaService.provider.findFirst({
      where: { providerId: payload.sub, provider: ProviderType.GOOGLE },
      include: { user: true },
    });

    let user: User;

    if (provider) {
      user = provider.user;
    } else {
      const existingUser = await this.prismaService.user.findUnique({
        where: { email: payload.email },
      });

      if (existingUser) {
        throw new BadRequestException("Email is already linked with another account", {
          description: "Please login using your existing account credentials.",
        });
      }

      user = await this.usersService.create({
        email: payload.email!,
        name: payload.name!,
        password: crypto.randomBytes(16).toString("hex"),
      });

      await this.prismaService.provider.create({
        data: {
          provider: ProviderType.GOOGLE,
          providerId: payload.sub,
          userId: user.id,
        },
      });
    }

    const { token } = await this.tokensService.generateToken(user.id);

    return { token };
  }

  async linkAccount(userId: string, code: string) {
    const payload = await this.verifyGoogleUser(code);

    const existingProvider = await this.prismaService.provider.findFirst({
      where: { providerId: payload.sub, provider: ProviderType.GOOGLE },
    });

    if (existingProvider) {
      throw new BadRequestException("This Google account is already linked with another user.");
    }

    await this.prismaService.provider.create({
      data: {
        provider: ProviderType.GOOGLE,
        providerId: payload.sub,
        userId,
      },
    });

    return payload;
  }
}
