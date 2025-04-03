import { GetObjectCommandOutput, S3 } from "@aws-sdk/client-s3";
import { Injectable, Logger, OnModuleInit } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import crypto from "node:crypto";

@Injectable()
export class S3Service implements OnModuleInit {
  bucketName: string;
  cache = new Map<string, GetObjectCommandOutput>();
  s3: S3;

  // Constructor
  constructor(private configService: ConfigService) {
    this.s3 = new S3({
      credentials: {
        accessKeyId: configService.get("AWS_ACCESS_KEY_ID"),
        secretAccessKey: configService.get("AWS_SECRET_ACCESS_KEY"),
      },
      endpoint: configService.get("AWS_ENDPOINT"),
      maxAttempts: 3,
      region: "auto",
    });

    this.bucketName = configService.get("AWS_BUCKET_NAME")!;
  }

  async deleteFile(Key: string) {
    const result = await this.s3.deleteObject({
      Bucket: this.bucketName,
      Key,
    });

    return result;
  }

  async getFile(Key: string) {
    try {
      const result = await this.s3.getObject({
        Bucket: this.bucketName,
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
      Bucket: this.bucketName,
    });

    return result.Contents;
  }

  async onModuleInit() {
    try {
      await this.s3.headBucket({
        Bucket: this.bucketName,
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
      Bucket: this.bucketName,
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
