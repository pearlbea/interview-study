import { z } from "zod";

export const TopicSchema = z.object({
  id: z.uuid(),
  name: z.string(),
});

export const TopicsSchema = z.array(TopicSchema);
export type Topic = z.infer<typeof TopicSchema>;
