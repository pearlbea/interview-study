import { connection } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { TopicSelector } from "./TopicSelector";

export async function Topics() {
  await connection();
  const supabase = await createClient();

  const { data: topics, error } = await supabase
    .from("topics")
    .select("id, name")
    .order("name");

  if (error) {
    throw new Error(`Could not load topics: ${error.message}`);
  }
  return <TopicSelector topics={topics} />;
}
