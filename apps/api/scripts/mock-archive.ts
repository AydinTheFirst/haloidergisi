import { eq } from "drizzle-orm";

import { db, themes, posts, categories, postThemes, PostStatus } from "../src";

async function main() {
  console.log("Generating mock data for archive...");

  const now = new Date();

  // 1. Create Categories
  const catNames = ["Kültür", "Sanat", "Teknoloji", "Edebiyat"];
  const createdCategories = [];

  for (const name of catNames) {
    let cat = await db.query.categories.findFirst({
      where: eq(categories.name, name),
    });

    if (!cat) {
      const [newCat] = await db
        .insert(categories)
        .values({
          name,
          createdAt: now,
        })
        .returning();
      cat = newCat;
    }
    createdCategories.push(cat);
  }

  // 2. Create Themes
  const themeNames = ["Modernizm", "Gelecek", "Klasikler", "Dijital Dönüşüm"];
  const createdThemes = [];

  for (const name of themeNames) {
    let theme = await db.query.themes.findFirst({
      where: eq(themes.name, name),
    });

    if (!theme) {
      const [newTheme] = await db
        .insert(themes)
        .values({
          name,
          createdAt: now,
        })
        .returning();
      theme = newTheme;
    }
    createdThemes.push(theme);
  }

  // 3. Create Posts
  const mockPosts = [
    {
      title: "Modern Sanatın İzinde",
      content: "Modern sanatın kökenleri ve günümüzdeki yansımaları üzerine bir inceleme.",
      categoryIdx: 1, // Sanat
      themeIdx: 0, // Modernizm
    },
    {
      title: "Yapay Zeka ve Gelecek",
      content: "Yapay zekanın hayatımızı nasıl değiştireceğine dair öngörüler.",
      categoryIdx: 2, // Teknoloji
      themeIdx: 1, // Gelecek
    },
    {
      title: "Antik Yunan Edebiyatı",
      content: "Klasik eserlerin günümüz edebiyatına olan etkileri.",
      categoryIdx: 3, // Edebiyat
      themeIdx: 2, // Klasikler
    },
    {
      title: "Blokzincir Teknolojileri",
      content: "Dijital dünyada güvenin yeni adı: Blokzincir.",
      categoryIdx: 2, // Teknoloji
      themeIdx: 3, // Dijital Dönüşüm
    },
    {
      title: "Post-Modern Mimari",
      content: "Şehirlerimizin çehresini değiştiren mimari akımlar.",
      categoryIdx: 1, // Sanat
      themeIdx: 0, // Modernizm
    },
  ];

  for (const mock of mockPosts) {
    const slug = mock.title.toLowerCase().replace(/ /g, "-") + "-" + Date.now();

    const [post] = await db
      .insert(posts)
      .values({
        title: mock.title,
        content: mock.content,
        slug: slug,
        status: PostStatus.PUBLISHED,
        categoryId: createdCategories[mock.categoryIdx].id,
        createdAt: now,
        updatedAt: now,
      })
      .returning();

    await db.insert(postThemes).values({
      postId: post.id,
      themeId: createdThemes[mock.themeIdx].id,
      work: "Mock Eser",
      category: "Film",
    });
  }

  console.log("Mock data generation completed successfully.");
}

main().catch((err) => {
  console.error("Error generating mock data:", err);
  process.exit(1);
});
