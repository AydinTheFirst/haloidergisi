import z from "zod";

export const postSchema = z.object({
  status: z.enum(["DRAFT", "PUBLISHED", "ARCHIVED"]).optional(),
  title: z.string().min(1).max(200),
  content: z.string().min(1),
  coverImage: z.string().optional(),
  attachment: z.string().optional(),
  categoryId: z.string().optional(),
  themes: z
    .array(
      z.object({
        work: z.string().min(1, "Eser adı boş olamaz"),
        category: z.string().min(1, "Kategori boş olamaz"),
      }),
    )
    .optional(),
});

export type PostSchema = z.infer<typeof postSchema>;
