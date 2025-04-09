import {
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Res,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from "@nestjs/common";
import { FilesInterceptor } from "@nestjs/platform-express";
import { Response } from "express";

import { Roles } from "@/common/decorators";
import { AuthGuard } from "@/common/guards";

import { FilesService } from "./files.service";

@Controller("files")
@Roles(["ADMIN"])
@UseGuards(AuthGuard)
export class FilesController {
  constructor(private readonly filesService: FilesService) {}

  @Post()
  @UseInterceptors(FilesInterceptor("files"))
  create(@UploadedFiles() files: Express.Multer.File[]) {
    return this.filesService.create(files);
  }

  @Get()
  findAll() {
    return this.filesService.findAll();
  }

  @Get(":id")
  findOne(@Param("id") id: string, @Res() res: Response) {
    return this.filesService.findOne(id, res);
  }

  @Get("signed-url/:id")
  getSignedUrl(@Param("id") id: string) {
    return this.filesService.getSignedUrl(id);
  }

  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.filesService.remove(id);
  }
}
