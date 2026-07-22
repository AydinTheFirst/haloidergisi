export function getCdnUrl(path?: string | null) {
  if (!path) return "";
  if (path.startsWith("http://") || path.startsWith("https://")) return path;
  try {
    const cdnBase = import.meta.env.VITE_CDN_URL || "https://cdn.haloidergisi.com";
    const url = new URL(path, cdnBase.endsWith("/") ? cdnBase : `${cdnBase}/`);
    return url.toString();
  } catch {
    return path;
  }
}
