import { MailerService } from "@nestjs-modules/mailer";
import { Injectable, Logger } from "@nestjs/common";
import { OnEvent } from "@nestjs/event-emitter";
import { render } from "@react-email/render";
import { type Post } from "@repo/db";
import { NewPostEmail } from "@repo/emails";

import { PrismaService } from "@/database";
import { getCdnUrl } from "@/utils/cdn";

@Injectable()
export class NotificationsService {
  logger = new Logger(NotificationsService.name);

  constructor(
    private prisma: PrismaService,
    private mailerService: MailerService,
  ) {}

  @OnEvent("post.created")
  async handlePostCreatedEvent(post: Post) {
    const isDev = process.env.NODE_ENV !== "production";

    const users = await this.prisma.user.findMany({
      where: isDev
        ? { email: "aydinhalil980@gmail.com" }
        : { notificationSettings: { newPost: true, emailNotifications: true } },
      include: { profile: true },
    });

    for (const user of users) {
      await this.mailerService.sendMail({
        to: user.email,
        subject: "Yeni Bir Gönderi Yayınlandı!",
        html: await render(
          NewPostEmail({
            name: user.profile?.name || "HALO Okuyucusu",
            postTitle: post.title,
            postDescription: post.content?.slice(0, 200) + "...",
            coverImageUrl: getCdnUrl(post.coverImage as string),
            postUrl: `https://haloidergisi.com/posts/${post.slug}`,
          }),
        ),
      });
    }

    this.logger.log(`Sent new post notifications to ${users.length} users.`);
  }
}
