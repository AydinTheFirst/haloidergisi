import { Prisma } from "@prisma/client";

export const sleep = (ms: number) => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

export const getPublicUserSelection = (
  extraFields?: (keyof Prisma.UserSelect)[],
): Prisma.UserSelect => {
  const baseFields: Prisma.UserSelect = {
    id: true,
    profile: true,
    username: true,
  };

  if (extraFields) {
    extraFields.forEach((field) => {
      baseFields[field] = true;
    });
  }

  return baseFields;
};
