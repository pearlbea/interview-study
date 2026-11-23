import { connection } from "next/server";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { createClient } from "@/lib/supabase/server";
import { Questions } from "./Questions";

const topicColors = {
  Postgres: "bg-blue-700",
  "System Design": "bg-emerald-700",
  "Web Performance": "bg-purple-700",
  "Claude Code": "bg-orange-700",
  React: "bg-cyan-700",
  TypeScript: "bg-sky-700",
};

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
    <div className="max-w-4xl mt-8">
      <div className="flex justify-between mb-8">
        <Link href="/home">
          <ArrowLeft />
        </Link>
        <ul className="flex gap-2">
          {topicsRes.data.map((topic) => (
            <li key={topic.id}>
              <Badge
                className={`rounded-xl px-4 py-2 ${topicColors[topic.name as keyof typeof topicColors] ?? "bg-grey-200"}`}
              >
                {topic.name}
              </Badge>
            </li>
          ))}
        </ul>
      </div>

      <Questions questions={cardsRes.data} />
    </div>
  );
}
