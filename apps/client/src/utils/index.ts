import gravatar from "gravatar-url";

import type { User } from "@/types";

export const sleep = (ms: number) => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

export const getFileUrl = (file?: string) => {
  if (!file) return "";
  return "https://cdn.haloidergisi.com/" + encodeURIComponent(file);
};

export const getGravatar = (email: string) => {
  const avatar = gravatar(email, { size: 200 });
  return avatar;
};

export function getAvatar(user: User) {
  if (user.avatar) return getFileUrl(user.avatar);
  if (user.email) return getGravatar(user.email);
  return "/images/default-avatar.png";
}
