import z from "zod";

export const crewSchema = z.object({
  name: z.string().min(1).max(100),
});

export type CrewSchema = z.infer<typeof crewSchema>;
