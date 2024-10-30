import { S3 } from "@aws-sdk/client-s3";
import { Injectable, Logger, OnModuleInit } from "@nestjs/common";
import crypto from "node:crypto";

@Injectable()
export class S3Service implements OnModuleInit {
  s3: S3;
  constructor() {
    this.s3 = new S3({
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
      },
      endpoint: process.env.AWS_ENDPOINT,
      maxAttempts: 3,
      region: "auto",
    });
  }

  async deleteFile(Key: string) {
    const result = await this.s3.deleteObject({
      Bucket: process.env.AWS_BUCKET_NAME!,
      Key,
    });

    return result;
  }

  async getFile(Key: string) {
    try {
      const result = await this.s3.getObject({
        Bucket: process.env.AWS_BUCKET_NAME!,
        Key,
      });

      return result;
    } catch (err) {
      console.error(err);
      return null;
    }
  }

  async getFiles() {
    const result = await this.s3.listObjects({
      Bucket: process.env.AWS_BUCKET_NAME!,
    });

    return result.Contents;
  }

  async onModuleInit() {
    try {
      await this.s3.headBucket({
        Bucket: process.env.AWS_BUCKET_NAME!,
      });
      Logger.debug("AWS S3 bucket is ready", "AWS");
    } catch (err) {
      console.error(err);
    }
  }

  async uploadFile(file: Express.Multer.File) {
    const key = crypto.randomUUID();

    await this.s3.putObject({
      Body: file.buffer,
      Bucket: process.env.AWS_BUCKET_NAME!,
      ContentType: file.mimetype,
      Key: key,
    });

    return key;
  }

  async uploadFiles(files: Express.Multer.File[]) {
    const keys = await Promise.all(
      files.map(async (file) => {
        return await this.uploadFile(file);
      })
    );

    return keys;
  }
}
