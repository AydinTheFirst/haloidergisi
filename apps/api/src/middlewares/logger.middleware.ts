import { NestMiddleware } from "@nestjs/common";
import { Injectable, Logger } from "@nestjs/common";
import { Request, Response, NextFunction } from "express";

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  private logger = new Logger("HTTP");

  use(req: Request, res: Response, next: NextFunction) {
    const { method, originalUrl, ip } = req;
    const userAgent = req.get("user-agent") || "";
    const start = Date.now(); // Süre ölçmek için

    // İstek tamamlandığında çalışacak event
    res.on("finish", () => {
      const { statusCode } = res;
      const duration = Date.now() - start;

      const message = `${method} ${originalUrl} ${statusCode} ${duration}ms - ${ip} ${userAgent}`;

      if (statusCode >= 500) {
        return this.logger.error(message);
      }
      if (statusCode >= 400) {
        return this.logger.warn(message);
      }

      return this.logger.log(message);
    });

    next();
  }
}
