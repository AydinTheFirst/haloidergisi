export function getCdnUrl(path: string) {
  const url = new URL(path, import.meta.env.VITE_CDN_URL);
  return url.toString();
}
