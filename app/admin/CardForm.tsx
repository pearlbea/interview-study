"use client";

import { useActionState, useState } from "react";
import { saveCard } from "./actions";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

type Topic = { id: string; name: string };
export type AdminCard = {
  id: string;
  question: string;
  answer: string;
  more_info: string | null;
  status: string;
  card_topics: { topic_id: string }[];
};

export function CardForm({ topics, card }: { topics: Topic[]; card?: AdminCard }) {
  const [state, action, pending] = useActionState(saveCard, {});
  const [question, setQuestion] = useState(card?.question ?? "");
  const [answer, setAnswer] = useState(card?.answer ?? "");
  const [moreInfo, setMoreInfo] = useState(card?.more_info ?? "");
  const [status, setStatus] = useState(card?.status ?? "draft");
  const [selectedTopics, setSelectedTopics] = useState(
    card?.card_topics.map(({ topic_id }) => topic_id) ?? [],
  );

  // React resets forms after actions resolve, including validation errors.
  return (
    <form action={action} onReset={(event) => event.preventDefault()} className="space-y-5 rounded-xl border bg-white p-5">
      <h2 className="text-xl font-bold">{card ? "Edit card" : "New card"}</h2>
      <input type="hidden" name="id" value={card?.id ?? ""} />
      <div className="space-y-2">
        <Label htmlFor="question">Question (Markdown)</Label>
        <Textarea id="question" name="question" required rows={6} value={question}
          onChange={(event) => setQuestion(event.target.value)} />
        <p className="text-sm text-muted-foreground">Use Markdown and fenced code blocks for code samples.</p>
      </div>
      <div className="space-y-2">
        <Label htmlFor="answer">Answer</Label>
        <Textarea id="answer" name="answer" required rows={4} value={answer}
          onChange={(event) => setAnswer(event.target.value)} />
      </div>
      <div className="space-y-2">
        <Label htmlFor="moreInfo">More information (optional)</Label>
        <Textarea id="moreInfo" name="moreInfo" rows={3} value={moreInfo}
          onChange={(event) => setMoreInfo(event.target.value)} />
      </div>
      <fieldset className="space-y-2">
        <legend className="font-medium">Topics (choose at least one)</legend>
        <div className="flex flex-wrap gap-4">
          {topics.map((topic) => (
            <label key={topic.id} className="flex items-center gap-2">
              <input type="checkbox" name="topicIds" value={topic.id}
                checked={selectedTopics.includes(topic.id)}
                onChange={(event) => {
                  const checked = event.target.checked;
                  setSelectedTopics((current) =>
                  checked
                    ? [...current, topic.id]
                    : current.filter((id) => id !== topic.id),
                  );
                }} />
              {topic.name}
            </label>
          ))}
        </div>
      </fieldset>
      <div className="space-y-2">
        <Label htmlFor="status">Status</Label>
        <select id="status" name="status" className="block rounded border bg-white p-2"
          value={status} onChange={(event) => setStatus(event.target.value)}>
          <option value="draft">Draft</option>
          <option value="published">Published</option>
          <option value="archived">Archived</option>
        </select>
      </div>
      {state.error && <p role="alert" className="text-destructive">{state.error}</p>}
      <Button type="submit" disabled={pending}>{pending ? "Saving…" : "Save card"}</Button>
    </form>
  );
}
