import { Injectable, Logger } from "@nestjs/common";
import axios, { toFormData } from "axios";

@Injectable()
export class TurnstileService {
  private logger = new Logger(TurnstileService.name);
  private readonly secretKey = process.env.TURNSTILE_SECRET_KEY!;

  async verifyToken(token: string, remoteip?: string): Promise<boolean> {
    try {
      const response = await axios.post(
        "https://challenges.cloudflare.com/turnstile/v0/siteverify",
        toFormData({
          secret: this.secretKey,
          response: token,
          remoteip: remoteip,
        }),
      );

      return response.data.success === true;
    } catch (error) {
      this.logger.error("Error verifying Turnstile token", error);
      return false;
    }
  }
}
