import { Injectable } from "@nestjs/common";

import { PrismaService } from "@/database";
import { StorageService } from "@/services";

@Injectable()
export class FilesService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly storageService: StorageService,
  ) {}

  async upload(file: Express.Multer.File): Promise<string> {
    const key = await this.storageService.uploadFile(file);
    await this.prismaService.file.create({ data: { key } });
    return key;
  }

  async remove(key: string): Promise<void> {
    await this.storageService.deleteFile(key);
    await this.prismaService.file.deleteMany({
      where: { key },
    });
  }
}
