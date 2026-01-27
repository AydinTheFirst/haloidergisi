import z from "zod";

export const categoriesSchema = z.object({
  name: z.string().min(1).max(100),
});

export type CategorySchema = z.infer<typeof categoriesSchema>;
