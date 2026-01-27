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

  async uploadFile(file: Express.Multer.File): Promise<string> {
    const key = `${Date.now()}-${file.originalname}`;

    const command = new PutObjectCommand({
      Bucket: this.bucket,
      Key: key,
      Body: file.buffer,
      ContentType: file.mimetype,
    });

    await this.send(command);

    return key;
  }

  async deleteFile(key: string): Promise<void> {
    const command = new DeleteObjectCommand({
      Bucket: this.bucket,
      Key: key,
    });

    await this.send(command);
  }
}
