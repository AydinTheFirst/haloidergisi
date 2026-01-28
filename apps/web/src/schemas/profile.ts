import z from "zod";

export const profileSchema = z.object({
  name: z.string().min(1).max(100),
  title: z.string().max(100).optional(),
  website: z.url().max(200).optional().or(z.literal("")),
  bio: z.string().max(500).optional(),
  avatarUrl: z.string().optional(),
});

export type ProfileSchema = z.infer<typeof profileSchema>;
