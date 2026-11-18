import { connection } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { QuestionCard } from "./QuestionCard";

// TODO: check for duplicate cards

export async function QuizContent({
  searchParams,
}: {
  searchParams: Promise<{ topics: string }>;
}) {
  
  const { topics } = await searchParams;
  const topicList = topics ? topics.split(",").filter(Boolean) : [];
  await connection();
  const supabase = await createClient();

  const [topicsRes, cardsRes] = await Promise.all([
    supabase
      .from("topics")
      .select("id, name")
      .in("id", topicList)
      .order("name"),
    supabase
      .from("cards")
      .select("id, question, answer, more_info, card_topics!inner(topic_id)")
      .eq("status", "published")
      .in("card_topics.topic_id", topicList),
  ]);

  if (cardsRes.error || topicsRes.error) {
    throw new Error(
      `Could not load quiz: ${(topicsRes.error ?? cardsRes.error)!.message}`,
    );
  }

  if (!cardsRes.data.length) {
    return "no matches";
  }

  // TODO: Style topic badges
  return (
    <div className="max-w-4xl">
      <div className="flex justify-between">
        <div>back</div>
        <ul className="flex gap-4">
          {topicsRes.data.map((topic) => (
            <li key={topic.id}>{topic.name}</li>
          ))}
        </ul>
      </div>
      <QuestionCard questions={cardsRes.data} />
    </div>
  );
}
