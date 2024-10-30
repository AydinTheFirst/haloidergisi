export * from "./mailer.config";
export * from "./multer.config";
export * from "./serve-static.config";
export * from "./swagger.config";
export * from "./throttler.config";

export const config = {
  port: process.env.PORT || 8080,
  title: "NestJS API",
};
