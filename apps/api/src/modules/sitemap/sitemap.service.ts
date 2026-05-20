import { Injectable } from "@nestjs/common";
import { eq } from "drizzle-orm";

import { DrizzleService } from "@/database";
import { news, posts } from "@/database/schema";

@Injectable()
export class SitemapService {
  constructor(private readonly drizzle: DrizzleService) {}

  async generateSitemap(): Promise<string> {
    const baseUrl = process.env.FRONTEND_URL || "https://haloidergisi.com";

    const staticPages = [
      { url: "/", changefreq: "daily", priority: "1.0" },
      { url: "/posts", changefreq: "daily", priority: "0.9" },
      { url: "/blog", changefreq: "daily", priority: "0.8" },
      { url: "/about", changefreq: "monthly", priority: "0.7" },
      { url: "/contact", changefreq: "monthly", priority: "0.7" },
      { url: "/team", changefreq: "monthly", priority: "0.6" },
      { url: "/archive", changefreq: "weekly", priority: "0.6" },
      { url: "/terms", changefreq: "yearly", priority: "0.3" },
      { url: "/privacy", changefreq: "yearly", priority: "0.3" },
    ];

    const publishedPosts = await this.drizzle.db
      .select({
        slug: posts.slug,
        updatedAt: posts.updatedAt,
        createdAt: posts.createdAt,
      })
      .from(posts)
      .where(eq(posts.status, "PUBLISHED"));

    const publishedNews = await this.drizzle.db
      .select({
        slug: news.slug,
        updatedAt: news.updatedAt,
        publishedAt: news.publishedAt,
      })
      .from(news)
      .where(eq(news.isPublished, true));

    let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
    xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';

    staticPages.forEach((page) => {
      xml += "  <url>\n";
      xml += `    <loc>${baseUrl}${page.url}</loc>\n`;
      xml += `    <changefreq>${page.changefreq}</changefreq>\n`;
      xml += `    <priority>${page.priority}</priority>\n`;
      xml += "  </url>\n";
    });

    publishedPosts.forEach((post) => {
      xml += "  <url>\n";
      xml += `    <loc>${baseUrl}/posts/${post.slug}</loc>\n`;
      xml += `    <lastmod>${new Date(post.updatedAt || post.createdAt!).toISOString()}</lastmod>\n`;
      xml += "    <changefreq>monthly</changefreq>\n";
      xml += "    <priority>0.8</priority>\n";
      xml += "  </url>\n";
    });

    publishedNews.forEach((item) => {
      xml += "  <url>\n";
      xml += `    <loc>${baseUrl}/blog/${item.slug}</loc>\n`;
      xml += `    <lastmod>${new Date(item.updatedAt || item.publishedAt!).toISOString()}</lastmod>\n`;
      xml += "    <changefreq>monthly</changefreq>\n";
      xml += "    <priority>0.7</priority>\n";
      xml += "  </url>\n";
    });

    xml += "</urlset>";

    return xml;
  }
}
