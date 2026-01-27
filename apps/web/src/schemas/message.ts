import z from "zod";

export const messageSchema = z.object({
  name: z.string().min(1).max(100),
  email: z.email().max(255),
  subject: z.string().min(1).max(150),
  content: z.string().min(1).max(5000),
});

export type MessageSchema = z.infer<typeof messageSchema>;

export const feedbackSchema = messageSchema.extend({
  name: z.string().optional(),
  email: z.string().optional(),
  subject: z.string().optional(),
});

export type FeedbackSchema = z.infer<typeof feedbackSchema>;
