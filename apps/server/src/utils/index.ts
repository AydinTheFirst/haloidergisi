import { Prisma } from "@prisma/client";

export const sleep = (ms: number) => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

export const getPublicUserSelection = (
  extraFields?: (keyof Prisma.UserSelect)[]
): Prisma.UserSelect => {
  const baseFields: Prisma.UserSelect = {
    bio: true,
    createdAt: true,
    displayName: true,
    email: true,
    id: true,
    title: true,
    username: true,
    website: true,
  };

  if (extraFields) {
    extraFields.forEach((field) => {
      baseFields[field] = true;
    });
  }

  return baseFields;
};
