import { Injectable, NotFoundException } from "@nestjs/common";
import { Response } from "express";

import { S3Service } from "@/modules";

@Injectable()
export class FilesService {
  constructor(private s3: S3Service) {}

  async create(file: Express.Multer.File[]) {
    const uploadedFiles = await Promise.allSettled(
      file.map(async (f) => {
        const key = await this.s3.uploadFile(f);
        return key;
      })
    );

    return uploadedFiles;
  }

  async findAll() {
    const files = await this.s3.getFiles();
    if (!files) return [];
    return files.map((file) => file.Key);
  }

  async findOne(key: string, res: Response) {
    const file = await this.s3.getFile(key);

    if (!file) {
      throw new NotFoundException("Dosya bulunamadı");
    }

    if (!file.Body) {
      throw new NotFoundException("Dosya bulunamadı");
    }

    res.set({
      "Content-Length": file.ContentLength,
      "Content-Type": file.ContentType,
      //"Content-Disposition": `attachment; filename="${key}"`, // Makes the browser download the file
    });

    const fileStream = file.Body as NodeJS.ReadableStream;
    fileStream.pipe(res);
  }

  async remove(key: string) {
    const result = await this.s3.deleteFile(key);
    return result;
  }
}
