import {
  Body,
  Controller,
  Delete,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";

import { Roles } from "@/decorators";
import { AuthGuard } from "@/guards";

import { FilesService } from "./files.service";

@Controller("files")
@UseGuards(AuthGuard)
@Roles("ADMIN")
export class FilesController {
  constructor(private readonly filesService: FilesService) {}

  @Post()
  @UseInterceptors(FileInterceptor("file"))
  upload(@UploadedFile() file: Express.Multer.File) {
    return this.filesService.upload(file);
  }

  @Delete()
  remove(@Body("key") key: string) {
    return this.filesService.remove(key);
  }
}
