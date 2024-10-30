import gravatar from "gravatar-url";

import { API_URL } from "@/config";

export const sleep = (ms: number) => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

export const getFileUrl = (file: string) => {
  return API_URL + "/files/" + encodeURIComponent(file);
};

export const getGravatar = (email: string) => {
  const avatar = gravatar(email, { size: 200 });
  return avatar;
};
