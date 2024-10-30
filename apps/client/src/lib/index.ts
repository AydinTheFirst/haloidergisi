export { cn } from "@nextui-org/react";
export * from "./http";
import gravatar from "gravatar-url";

export const CDN = "https://cdn.haloidergisi.com/";

export const sleep = (ms: number) =>
  new Promise((resolve) => setTimeout(resolve, ms));

export const getGravatar = (email: string) => {
  const avatar = gravatar(email, { size: 200 });
  return avatar;
};
