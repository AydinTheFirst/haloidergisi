import { DeleteObjectCommand, PutObjectCommand, S3 } from "@aws-sdk/client-s3";
import { Injectable } from "@nestjs/common";

@Injectable()
export class StorageService extends S3 {
  private bucket = process.env.AWS_BUCKET!;

  constructor() {
    super({
      region: process.env.AWS_REGION,
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
      },
      endpoint: process.env.AWS_ENDPOINT,
    });
  }

  async uploadFiles(files: Express.Multer.File[]): Promise<string[]> {
    const uploadPromises = files.map(async (file) => {
      const key = `${Date.now()}-${file.originalname}`;

      const command = new PutObjectCommand({
        Bucket: this.bucket,
        Key: key,
        Body: file.buffer,
        ContentType: file.mimetype,
      });

      await this.send(command);

      return key;
    });

    return Promise.all(uploadPromises);
  }

  async deleteFiles(keys: string[]): Promise<void> {
    const deletePromises = keys.map(async (key) => {
      const command = new DeleteObjectCommand({
        Bucket: this.bucket,
        Key: key,
      });

      await this.send(command);
    });

    await Promise.all(deletePromises);
  }
}
