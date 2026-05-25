# SEO Improvements for HALO Dergisi

This document outlines all the SEO improvements implemented for the HALO Dergisi website.

## Summary of Changes

### 1. **SEO Utility Helper** (`apps/web/src/utils/seo.ts`)

Created a comprehensive SEO utility module with the following functions:

- **`generateMetaTags(config: SEOConfig)`**: Generates meta tags for:
  - Basic meta tags (title, description, keywords, author)
  - Open Graph tags (og:title, og:description, og:image, og:type, etc.)
  - Twitter Card tags
  - Article-specific tags (published time, modified time, section, tags)
  - Robots directives (noindex, nofollow)

- **`generateCanonicalUrl(path: string, baseUrl?: string)`**: Creates canonical URLs

- **`generateStructuredData(type, data)`**: Generates JSON-LD structured data for:
  - WebSite schema
  - Article schema
  - Organization schema

### 2. **Dynamic Meta Tags on Routes**

Added SEO meta tags to key routes:

#### **Homepage** (`apps/web/src/routes/_landing/index.tsx`)

- Title: "Ana Sayfa - Aylık Fikir, Sanat ve Edebiyat Dergisi"
- Rich description with keywords
- WebSite structured data with search action
- Open Graph and Twitter Cards

#### **Blog Listing** (`apps/web/src/routes/_landing/blog/index.tsx`)

- Page-specific title and description
- Keywords targeting blog and announcements

#### **Blog Post Detail** (`apps/web/src/routes/_landing/blog/$slug.tsx`)

- Dynamic title and description from post content
- Article structured data
- Author information
- Published and modified dates
- Open Graph image and Twitter Cards
- Canonical URL for each post

#### **Magazine Post Detail** (`apps/web/src/routes/_landing/posts/$postId.tsx`)

- Dynamic title and description from post
- Article structured data
- Cover image as Open Graph image
- Category as article section
- Canonical URL for each magazine

#### **Root Layout** (`apps/web/src/routes/__root.tsx`)

- Enhanced default meta tags with:
  - Comprehensive site description
  - Keywords
  - Full Open Graph tags
  - Twitter Card tags
  - Theme color
  - Manifest link
  - Apple touch icon

### 3. **Sitemap Generation**

#### Backend (`apps/api/src/modules/sitemap/`)

Created a new sitemap module:

- **Controller** (`sitemap.controller.ts`): Exposes `/sitemap/xml` endpoint
- **Service** (`sitemap.service.ts`): Generates XML sitemap with:
  - All static pages (homepage, posts, blog, about, contact, etc.)
  - All published magazine posts with last modified dates
  - All published blog articles with last modified dates
  - Proper priority and change frequency for each URL type

#### Frontend Proxy (`apps/web/app/routes/sitemap.xml.ts`)

- Nitro server route that proxies sitemap from backend
- Accessible at `/sitemap.xml`
- Caches response for 1 hour

### 4. **Manifest.json Updates** (`apps/web/public/manifest.json`)

Updated PWA manifest with:

- Proper app name: "HALO Dergisi"
- Descriptive name and description
- Correct icon configuration
- Turkish language setting
- Proper categories (education, lifestyle, magazines)
- Theme and background colors

### 5. **Robots.txt Updates** (`apps/web/public/robots.txt`)

Enhanced robots.txt with:

- Allow all public pages
- Disallow dashboard and API routes
- Sitemap reference: `https://haloidergisi.com/sitemap.xml`

## Technical Features

### Meta Tags Coverage

- ✅ Title tags (unique per page)
- ✅ Meta descriptions (unique per page)
- ✅ Keywords
- ✅ Author information
- ✅ Canonical URLs
- ✅ Open Graph (Facebook, LinkedIn)
- ✅ Twitter Cards
- ✅ Robots directives
- ✅ Theme color
- ✅ Viewport
- ✅ Character set

### Structured Data (JSON-LD)

- ✅ WebSite schema with search action
- ✅ Article schema for blog posts and magazines
- ✅ Organization schema ready (can be added to about page)

### Sitemap

- ✅ XML sitemap with all public URLs
- ✅ Dynamic content from database
- ✅ Last modified dates
- ✅ Priority and change frequency
- ✅ Proper caching

### Additional SEO Elements

- ✅ Semantic HTML (lang="tr" in root)
- ✅ Mobile-friendly viewport
- ✅ PWA manifest
- ✅ Robots.txt with sitemap reference

## Usage

### Adding SEO to New Routes

To add SEO to a new route, import the utility and add a `head` function:

```typescript
import { generateMetaTags, generateCanonicalUrl } from "@/utils/seo";

export const Route = createFileRoute("/your-route")({
  component: YourComponent,
  head: () => {
    const canonicalUrl = generateCanonicalUrl("/your-route");
    const meta = generateMetaTags({
      title: "Your Page Title",
      description: "Your page description",
      keywords: ["keyword1", "keyword2"],
      canonical: canonicalUrl,
      type: "website", // or "article"
    });

    return {
      meta,
      links: [{ rel: "canonical", href: canonicalUrl }],
    };
  },
});
```

### Testing SEO

1. **Meta Tags**: View page source and check `<head>` section
2. **Open Graph**: Test with [Facebook Sharing Debugger](https://developers.facebook.com/tools/debug/)
3. **Twitter Cards**: Test with [Twitter Card Validator](https://cards-dev.twitter.com/validator)
4. **Structured Data**: Test with [Google Rich Results Test](https://search.google.com/test/rich-results)
5. **Sitemap**: Visit `/sitemap.xml` and validate with [XML Sitemap Validator](https://www.xml-sitemaps.com/validate-xml-sitemap.html)

## Performance Considerations

- Sitemap is cached for 1 hour on the server
- Structured data is generated at build time (SSR)
- No client-side JavaScript required for SEO tags
- Canonical URLs prevent duplicate content issues

## Future Improvements

Consider adding:

- [ ] Breadcrumb structured data
- [ ] Organization schema on about page
- [ ] Person schema for team members
- [ ] FAQ schema if applicable
- [ ] Image sitemaps for magazine covers
- [ ] hreflang tags if multi-language support is added
- [ ] AMP versions of pages (optional)
- [ ] RSS/Atom feeds for blog
- [ ] Social media meta tags for specific platforms (Pinterest, WhatsApp)

## Configuration

### Environment Variables

Make sure these are set in your `.env` files:

```bash
# Backend (.env)
FRONTEND_URL=https://haloidergisi.com

# Frontend (.env)
VITE_API_URL=https://api.haloidergisi.com
```

### Update robots.txt Domain

If your domain changes, update the sitemap URL in `apps/web/public/robots.txt`:

```txt
Sitemap: https://your-domain.com/sitemap.xml
```

## Verification Steps

After deployment:

1. **Google Search Console**:
   - Submit sitemap.xml
   - Monitor indexing status
   - Check for crawl errors

2. **Bing Webmaster Tools**:
   - Submit sitemap.xml
   - Monitor indexing

3. **Validate Meta Tags**:
   - Use browser dev tools to inspect `<head>`
   - Check Open Graph with social media debuggers
   - Verify structured data with Google's tools

4. **Monitor Performance**:
   - Google Analytics for organic traffic
   - Search Console for search performance
   - Core Web Vitals

## Resources

- [Google SEO Starter Guide](https://developers.google.com/search/docs/beginner/seo-starter-guide)
- [Open Graph Protocol](https://ogp.me/)
- [Twitter Cards Documentation](https://developer.twitter.com/en/docs/twitter-for-websites/cards/overview/abouts-cards)
- [Schema.org Documentation](https://schema.org/)
- [Sitemap Protocol](https://www.sitemaps.org/protocol.html)
