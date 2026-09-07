export function loadGoogleFont(fontFamilyStr: string) {
  if (typeof window === "undefined" || !fontFamilyStr) return;

  // Extract primary font name (e.g., '"Plus Jakarta Sans", sans-serif' -> 'Plus Jakarta Sans')
  const match = fontFamilyStr.match(/["']?([^"',]+)["']?/);
  const fontName = match ? match[1].trim() : fontFamilyStr.split(",")[0].trim();

  // Skip browser standard / generic fonts
  const genericFonts = [
    "system-ui",
    "sans-serif",
    "serif",
    "monospace",
    "georgia",
    "cambria",
    "times new roman",
    "arial",
    "helvetica",
    "courier new",
  ];
  if (genericFonts.includes(fontName.toLowerCase())) {
    return;
  }

  const linkId = "dynamic-google-font-loader";
  let link = document.getElementById(linkId) as HTMLLinkElement | null;
  if (!link) {
    link = document.createElement("link");
    link.id = linkId;
    link.rel = "stylesheet";
    document.head.appendChild(link);
  }

  const encodedFont = encodeURIComponent(fontName).replace(/%20/g, "+");
  const href = `https://fonts.googleapis.com/css2?family=${encodedFont}:ital,wght@0,400;0,500;0,600;0,700;1,400&display=swap`;

  if (link.href !== href) {
    link.href = href;
  }
}
