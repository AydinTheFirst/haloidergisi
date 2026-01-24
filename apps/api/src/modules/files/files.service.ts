import { Injectable } from "@nestjs/common";

import { PrismaService } from "@/database";
import { StorageService } from "@/services";

@Injectable()
export class FilesService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly storageService: StorageService,
  ) {}

  async upload(files: Express.Multer.File[]): Promise<string[]> {
    const keys = await this.storageService.uploadFiles(files);
    await this.prismaService.file.createMany({
      data: keys.map((key) => ({ key })),
    });

    return keys;
  }

  async remove(keys: string[]): Promise<void> {
    await this.storageService.deleteFiles(keys);
    await this.prismaService.file.deleteMany({
      where: {
        key: { in: keys },
      },
    });
  }
}
