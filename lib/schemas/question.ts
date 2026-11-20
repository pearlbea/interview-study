import { z } from "zod";

const TopicId = z.object({
  topic_id: z.uuid(),
});

export const QuestionSchema = z.object({
  id: z.uuid(),
  answer: z.string(),
  card_topics: z.array(TopicId),
  more_info: z.string().optional(),
  question: z.string(),
});

export const QuestionsSchema = z.array(QuestionSchema);
export type Question = z.infer<typeof QuestionSchema>;
export type Questions = z.infer<typeof QuestionsSchema>;
