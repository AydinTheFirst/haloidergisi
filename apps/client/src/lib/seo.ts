import type { MetaDescriptor } from "react-router";

interface MetaOptions {
  author?: string;
  canonical?: string;
  category?: string;
  description?: string;
  image?: string;
  keywords?: string;
  publishedTime?: string; // ISO 8601
  robots?: string; // e.g. "index, follow"
  title?: string;
  updatedTime?: string; // ISO 8601
  url?: string;
}

export function createMetaTags({
  author = "HALO",
  canonical,
  category = "Dergi Kategorisi",
  description = "HALO Dergisi - Dergi Detay",
  image = "/banner.png",
  keywords = "HALO Dergisi",
  publishedTime,
  robots = "index, follow",
  title = "HALO Dergisi - Dergi Detay",
  updatedTime,
  url = "https://haloidergisi.com",
}: MetaOptions): MetaDescriptor[] {
  return [
    // Basic
    { description, title },
    { content: keywords, name: "keywords" },
    { content: category, name: "category" },
    { content: author, name: "author" },
    { content: robots, name: "robots" },

    // OpenGraph
    { content: title, property: "og:title" },
    { content: description, property: "og:description" },
    { content: image, property: "og:image" },
    { content: "article", property: "og:type" },
    { content: url, property: "og:url" },
    ...(publishedTime ? [{ content: publishedTime, property: "article:published_time" }] : []),
    ...(updatedTime ? [{ content: updatedTime, property: "article:modified_time" }] : []),

    // Twitter
    { content: title, name: "twitter:title" },
    { content: description, name: "twitter:description" },
    { content: image, name: "twitter:image" },
    { content: "summary_large_image", name: "twitter:card" },

    // Canonical link
    ...(canonical ? [{ href: canonical, rel: "canonical", tagName: "link" }] : []),
  ];
}
