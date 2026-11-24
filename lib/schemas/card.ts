import { z } from "zod";

const TopicId = z.object({
  topic_id: z.uuid(),
});

export const CardSchema = z.object({
  id: z.uuid(),
  answer: z.string(),
  card_topics: z.array(TopicId),
  more_info: z.string().optional(),
  question: z.string(),
});

export const CardsSchema = z.array(CardSchema);
export type Card = z.infer<typeof CardSchema>;
export type Cards = z.infer<typeof CardsSchema>;
