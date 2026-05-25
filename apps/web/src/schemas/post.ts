import z from "zod";

export const postSchema = z.object({
  status: z.enum(["DRAFT", "PUBLISHED", "ARCHIVED"]).optional(),
  title: z.string().min(1).max(200),
  content: z.string().min(1),
  coverImage: z.string().optional(),
  attachment: z.string().optional(),
  categoryId: z.string().optional(),
});

export type PostSchema = z.infer<typeof postSchema>;
