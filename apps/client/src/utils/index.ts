import gravatar from "gravatar-url";

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
