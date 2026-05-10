import { Injectable } from "@nestjs/common";
import { files } from "@repo/db";
import { eq } from "drizzle-orm";

import { DrizzleService } from "@/database";
import { StorageService } from "@/services";

@Injectable()
export class FilesService {
  constructor(
    private readonly drizzle: DrizzleService,
    private readonly storageService: StorageService,
  ) {}

  async upload(file: Express.Multer.File): Promise<string> {
    const key = await this.storageService.uploadFile(file);
    await this.drizzle.db.insert(files).values({ key });
    return key;
  }

  async remove(key: string): Promise<void> {
    await this.storageService.deleteFile(key);
    await this.drizzle.db.delete(files).where(eq(files.key, key));
  }
}
