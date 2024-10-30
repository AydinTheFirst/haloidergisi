import { type MailerOptions } from "@nestjs-modules/mailer";
import { HandlebarsAdapter } from "@nestjs-modules/mailer/dist/adapters/handlebars.adapter";

export const mailerConfig: MailerOptions = {
  defaults: {
    from: `"nest-modules" <${process.env.SMTP_USER}>`,
  },
  template: {
    adapter: new HandlebarsAdapter(),
    dir: process.cwd() + "/src/templates/email/",
    options: {
      strict: true,
    },
  },
  transport: {
    auth: {
      pass: process.env.SMTP_PASS,
      user: process.env.SMTP_USER,
    },
    host: process.env.SMTP_HOST,
    port: +process.env.SMTP_PORT || 465,
    secure: true,
  },
  verifyTransporters: true,
};
