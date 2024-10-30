import { MulterModuleOptions } from "@nestjs/platform-express";
import multer from "multer";

export const multerConfig: MulterModuleOptions = {
  storage: multer.memoryStorage(),
};
