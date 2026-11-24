import { Suspense } from "react";
import Link from "next/link";
import { connection } from "next/server";
import { notFound, redirect } from "next/navigation";
import { z } from "zod";
import { getAdminClient } from "@/lib/supabase/admin";
import { CardForm, type AdminCard } from "./CardForm";
import { RemoveCard } from "./RemoveCard";

type Params = Promise<{ edit?: string | string[]; notice?: string | string[] }>;

async function AdminContent({ searchParams }: { searchParams: Params }) {
  await connection();
  const { supabase, access } = await getAdminClient();
  if (access === "signed-out") redirect("/login");
  if (access === "forbidden") {
    return <p role="alert">You do not have access to administer questions.</p>;
  }

  const { edit, notice } = await searchParams;
  if (edit !== undefined && !z.uuid().safeParse(edit).success) notFound();

  const [topicsResult, cardsResult] = await Promise.all([
    supabase.from("topics").select("id, name").order("name"),
    supabase.from("cards").select("id, question, answer, more_info, status, card_topics(topic_id)")
      .order("updated_at", { ascending: false }),
  ]);
  if (topicsResult.error || cardsResult.error) {
    console.error("Could not load admin questions:", topicsResult.error ?? cardsResult.error);
    throw new Error("Could not load questions.");
  }

  const cards: AdminCard[] = cardsResult.data;
  const card = edit ? cards.find((item) => item.id === edit) : undefined;
  if (edit && !card) notFound();

  const notices: Record<string, string> = {
    saved: "Question saved.",
    deleted: "Question deleted.",
    archived: "Question archived to preserve study history.",
  };
  const message = typeof notice === "string" ? notices[notice] : undefined;

  return (
    <div className="space-y-8">
      {message && <p role="status">{message}</p>}
      <CardForm key={card?.id ?? "new"} topics={topicsResult.data} card={card} />
      {card && <Link href="/admin" className="underline">Create a new question instead</Link>}
      <section className="space-y-4">
        <h2 className="text-xl font-bold">Questions</h2>
        {cards.length === 0 && <p>No questions yet.</p>}
        <ul className="space-y-3">
          {cards.map((item) => (
            <li key={item.id} className="space-y-3 rounded-xl border bg-white p-4">
              <p className="whitespace-pre-wrap break-words">{item.question}</p>
              <p className="text-sm text-muted-foreground">Status: {item.status}</p>
              <div className="flex items-center gap-4">
                <Link className="underline" href={`/admin?edit=${item.id}`}>Edit</Link>
                <RemoveCard id={item.id} />
              </div>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}

export default function AdminPage({ searchParams }: { searchParams: Params }) {
  return (
    <main className="w-full max-w-4xl space-y-6 p-8">
      <Link href="/home" className="underline">Back to topics</Link>
      <h1 className="text-4xl font-heading font-bold">Manage questions</h1>
      <Suspense fallback={<p>Loading questions…</p>}>
        <AdminContent searchParams={searchParams} />
      </Suspense>
    </main>
  );
}
