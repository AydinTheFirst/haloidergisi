export const getCdnUrl = (path: string) => {
  const url = new URL(path, "https://cdn.haloidergisi.com");
  return url.toString();
};
