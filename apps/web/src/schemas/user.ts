import z from "zod";

export const userSchema = z.object({
  name: z.string().min(1).max(100),
  email: z.email(),
  password: z.string().min(6).max(100).optional(),
  crewId: z.string().optional(),
  roles: z.array(z.enum(["USER", "ADMIN", "SUPER_ADMIN"])).optional(),
});

export type UserSchema = z.infer<typeof userSchema>;
