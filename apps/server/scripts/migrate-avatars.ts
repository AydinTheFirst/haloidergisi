import { S3 } from "@aws-sdk/client-s3";
import { PrismaClient } from "@prisma/client";
import axios from "axios";
import crypto from "crypto";

const prisma = new PrismaClient();

const bucketName = process.env.AWS_BUCKET_NAME;
const s3 = new S3({
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
  endpoint: process.env.AWS_ENDPOINT,
  maxAttempts: 3,
  region: "auto",
});

const getGravatarUrl = (email: string) => {
  const hash = crypto.createHash("md5").update(email.trim().toLowerCase()).digest("hex");

  return `https://www.gravatar.com/avatar/${hash}?d=identicon`;
};

async function migrateAvatars() {
  const users = await prisma.user.findMany({
    include: {
      profile: true,
    },
    where: {
      profile: {
        isNot: null,
      },
    },
  });

  console.log(`Found ${users.length} users without avatars.`);

  for (const user of users) {
    if (user.profile.avatarUrl) {
      console.log(`User ${user.id} (${user.email}) already has an avatar.`);
      continue;
    }

    const gravatarUrl = getGravatarUrl(user.email);

    const isExist = await axios.head(gravatarUrl);

    if (!isExist) {
      console.warn(`Gravatar not found for user ${user.id} (${user.email})`);
      continue;
    }

    const response = await axios.get(gravatarUrl, {
      responseType: "arraybuffer",
    });

    const buffer = Buffer.from(response.data, "binary");
    const fileName = `${user.id}_avatar`;
    const fileKey = `avatars/${fileName}`;
    const mimeType = response.headers["content-type"] || "image/png";

    const uploadParams = {
      Body: buffer,
      Bucket: bucketName,
      ContentType: mimeType,
      Key: fileKey,
    };
    try {
      await s3.putObject(uploadParams);

      await prisma.user.update({
        data: {
          profile: {
            update: {
              avatarUrl: fileKey,
            },
          },
        },
        where: { id: user.id },
      });

      console.log(`Uploaded avatar for user ${user.id} (${user.email})`);
    } catch (error) {
      console.error(`Failed to upload avatar for user ${user.id}:`, error);
    }
  }
}

migrateAvatars()
  .then(() => {
    console.log("Avatar migration completed successfully.");
  })
  .catch((error) => {
    console.error("Error during avatar migration:", error);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
