import { MailerModule } from "@nestjs-modules/mailer";
import { MiddlewareConsumer, Module, NestModule } from "@nestjs/common";
import { MulterModule } from "@nestjs/platform-express";
import { ServeStaticModule } from "@nestjs/serve-static";
import { ThrottlerModule } from "@nestjs/throttler";

import { AuthMiddleware, LoggerMiddleware } from "@/common/middlewares";
import {
  mailerConfig,
  multerConfig,
  serveStaticConfig,
  throttlerConfig,
} from "@/config";
import { AwsModule, NetgsmModule } from "@/modules";
import { PrismaModule } from "@/prisma";
import { AppRoutes } from "@/routes";
import { WebsocketModule } from "@/websocket";

import { AppController } from "./app.controller";
import { AppService } from "./app.service";

const { AWS_BUCKET_NAME, NETGSM_USER, SMTP_USER } = process.env;

const modules = () => {
  const appModules = [];
  if (SMTP_USER) appModules.push(MailerModule.forRoot(mailerConfig));
  if (AWS_BUCKET_NAME) appModules.push(AwsModule);
  if (NETGSM_USER) appModules.push(NetgsmModule);
  return appModules;
};

@Module({
  controllers: [AppController],
  imports: [
    ...AppRoutes,
    PrismaModule,
    WebsocketModule,
    ...modules(),
    ThrottlerModule.forRoot(throttlerConfig),
    ServeStaticModule.forRoot(serveStaticConfig),
    MulterModule.register(multerConfig),
  ],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware, AuthMiddleware).forRoutes("*");
  }
}
