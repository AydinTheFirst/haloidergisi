import { CDN_URL } from "~/config";

export const cdnSource = (path: string) => {
  return new URL(path, CDN_URL).href;
};

export const sleep = (ms: number) => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

export function toFormData(target: HTMLFormElement) {
  const formData = new FormData(target);
  const data: Record<string, unknown> = Object.fromEntries(formData.entries());
  return data;
}
