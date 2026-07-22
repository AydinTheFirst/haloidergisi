import { ISendMailOptions, MailerService } from "@nestjs-modules/mailer";
import { Injectable, Logger } from "@nestjs/common";
import { OnEvent } from "@nestjs/event-emitter";
import { render } from "@react-email/render";
import { notificationSettings, profiles, users } from "@repo/db";
import {
  ArticleStatusUpdatedEmail,
  ArticleSubmittedAdminEmail,
  ArticleSubmittedAuthorEmail,
  NewPostEmail,
  ResetPasswordEmail,
  VerifyEmail,
  WelcomeEmail,
} from "@repo/emails";
import { eq, sql } from "drizzle-orm";

import { EMAIL_EVENTS } from "@/constants";
import { DrizzleService } from "@/database";
import { sleep } from "@/utils";

export class BaseEmailDto {
  to!: string;
  constructor(data: BaseEmailDto) {
    Object.assign(this, data);
  }
}

export class WelcomeEmailDto extends BaseEmailDto {
  name!: string;
  constructor(data: WelcomeEmailDto) {
    super(data);
    Object.assign(this, data);
  }
}

export class VerifyEmailDto extends BaseEmailDto {
  name!: string;
  token!: string;
  constructor(data: VerifyEmailDto) {
    super(data);
    Object.assign(this, data);
  }
}

export class ResetPasswordEmailDto extends BaseEmailDto {
  name!: string;
  token!: string;
  constructor(data: ResetPasswordEmailDto) {
    super(data);
    Object.assign(this, data);
  }
}

export class NewPostEmailDto {
  title!: string;
  content!: string;
  slug!: string;
  coverImage!: string;

  constructor(data: NewPostEmailDto) {
    Object.assign(this, data);
  }
}

export class ArticleSubmittedAuthorEmailDto extends BaseEmailDto {
  authorName!: string;
  articleTitle!: string;
  callTitle!: string;
  constructor(data: ArticleSubmittedAuthorEmailDto) {
    super(data);
    Object.assign(this, data);
  }
}

export class ArticleSubmittedAdminEmailDto {
  authorName!: string;
  authorEmail!: string;
  articleTitle!: string;
  callTitle!: string;
  articleId!: string;
  constructor(data: ArticleSubmittedAdminEmailDto) {
    Object.assign(this, data);
  }
}

export class ArticleStatusUpdatedEmailDto extends BaseEmailDto {
  authorName!: string;
  articleTitle!: string;
  status!: string;
  statusText!: string;
  adminNote?: string;
  constructor(data: ArticleStatusUpdatedEmailDto) {
    super(data);
    Object.assign(this, data);
  }
}

@Injectable()
export class MailService {
  private readonly logger = new Logger(MailService.name);
  constructor(
    private readonly mailerService: MailerService,
    private readonly drizzle: DrizzleService,
  ) {}

  async send(options: ISendMailOptions) {
    try {
      await this.mailerService.sendMail(options);
      this.logger.log(`Mail sent to ${options.to as string} with subject "${options.subject}"`);
    } catch (error) {
      this.logger.error(`Failed to send mail to ${options.to as string}: ${error}`);
    }
  }

  @OnEvent(EMAIL_EVENTS.WELCOME)
  async sendWelcomeEmail({ to, ...rest }: WelcomeEmailDto) {
    await this.send({
      to,
      subject: "HALO Dergisi'ne Hoş Geldiniz!",
      html: await render(
        WelcomeEmail({
          ...rest,
        }),
      ),
    });
  }

  @OnEvent(EMAIL_EVENTS.VERIFY_EMAIL)
  async sendVerifyEmail({ to, ...rest }: VerifyEmailDto) {
    await this.send({
      to,
      subject: "E-posta Adresinizi Doğrulayın",
      html: await render(
        VerifyEmail({
          ...rest,
        }),
      ),
    });
  }

  @OnEvent(EMAIL_EVENTS.RESET_PASSWORD)
  async sendResetPasswordEmail({ to, ...rest }: ResetPasswordEmailDto) {
    await this.send({
      to,
      subject: "Şifre Sıfırlama Talebi",
      html: await render(
        ResetPasswordEmail({
          ...rest,
        }),
      ),
    });
  }

  @OnEvent(EMAIL_EVENTS.NEW_POST)
  async sendNewPostEmail({ ...rest }: NewPostEmailDto) {
    const targetUsers = await this.drizzle.db
      .select({
        email: users.email,
        name: profiles.name,
      })
      .from(users)
      .innerJoin(notificationSettings, eq(notificationSettings.userId, users.id))
      .leftJoin(profiles, eq(profiles.userId, users.id))
      .where(eq(notificationSettings.newPost, true));

    for (const user of targetUsers) {
      await this.send({
        to: user.email,
        subject: "Yeni Bir Gönderi Yayınlandı!",
        html: await render(
          NewPostEmail({
            ...rest,
            name: user.name || "HALO Okuyucusu",
          }),
        ),
      });

      await sleep(Math.random() * 1000 + 500);
    }
  }

  @OnEvent(EMAIL_EVENTS.ARTICLE_SUBMITTED_AUTHOR)
  async sendArticleSubmittedAuthorEmail({ to, ...rest }: ArticleSubmittedAuthorEmailDto) {
    await this.send({
      to,
      subject: "Yazınız Başarıyla Alındı - HALO Dergisi",
      html: await render(
        ArticleSubmittedAuthorEmail({
          ...rest,
        }),
      ),
    });
  }

  @OnEvent(EMAIL_EVENTS.ARTICLE_SUBMITTED_ADMIN)
  async sendArticleSubmittedAdminEmail({ ...rest }: ArticleSubmittedAdminEmailDto) {
    const adminUsers = await this.drizzle.db
      .select({
        email: users.email,
        name: profiles.name,
      })
      .from(users)
      .leftJoin(profiles, eq(profiles.userId, users.id))
      .where(sql`${users.roles} @> ARRAY['ADMIN']::"Role"[]`);

    for (const admin of adminUsers) {
      await this.send({
        to: admin.email,
        subject: "Yeni Bir Yazı Gönderimi Yapıldı!",
        html: await render(
          ArticleSubmittedAdminEmail({
            ...rest,
            adminName: admin.name || "Editör",
          }),
        ),
      });
      await sleep(500);
    }
  }

  @OnEvent(EMAIL_EVENTS.ARTICLE_STATUS_UPDATED)
  async sendArticleStatusUpdatedEmail({ to, ...rest }: ArticleStatusUpdatedEmailDto) {
    await this.send({
      to,
      subject: `Yazı Durumu Güncellendi: ${rest.statusText}`,
      html: await render(
        ArticleStatusUpdatedEmail({
          ...rest,
        }),
      ),
    });
  }
}
