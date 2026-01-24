import {
  Body,
  Controller,
  Delete,
  Post,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from "@nestjs/common";
import { FilesInterceptor } from "@nestjs/platform-express";

import { Roles } from "@/decorators";
import { AuthGuard } from "@/guards";

import { FilesService } from "./files.service";

@Controller("files")
@UseGuards(AuthGuard)
@Roles("ADMIN")
export class FilesController {
  constructor(private readonly filesService: FilesService) {}

  @Post()
  @UseInterceptors(FilesInterceptor("files"))
  upload(@UploadedFiles() files: Express.Multer.File[]) {
    return this.filesService.upload(files);
  }

  @Delete()
  remove(@Body() keys: string[]) {
    return this.filesService.remove(keys);
  }
}
