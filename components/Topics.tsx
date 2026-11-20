import { connection } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { TopicSelector } from "./TopicSelector";
import { TopicsSchema } from "@/lib/schemas/topic";

export async function Topics() {
  await connection();
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("topics")
    .select("id, name")
    .order("name");

  if (error) {
    throw new Error(`Could not load topics: ${error.message}`);
  }

  const topics = TopicsSchema.parse(data);
  return <TopicSelector topics={topics} />;
}
