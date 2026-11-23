"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ArrowRightIcon } from "lucide-react";
import { TopicCard } from "./TopicCard";

export type Topic = { id: string; name: string };

export function TopicSelector({ topics }: { topics: Topic[] }) {
  const [selected, setSelected] = useState<string[]>([]);
  const router = useRouter();

  function handleSelected(topic: string) {
    setSelected((current) =>
      current.includes(topic)
        ? current.filter((item) => item !== topic)
        : [...current, topic],
    );
  }

  function handleStartQuiz() {
    const params = new URLSearchParams();
    if (selected.length) {
      params.set("topics", selected.join(","));
    }
    router.push(`/quiz?${params.toString()}`);
  }

  return (
    <div className="flex flex-wrap gap-4 justify-start max-w-4xl">
      {topics.map((item) => (
        <TopicCard
          key={item.id}
          id={item.id}
          name={item.name}
          selected={selected.includes(item.id)}
          handleSelected={handleSelected}
        />
      ))}
      <div className="flex border-2 rounded-2xl p-4 mt-8 bg-white justify-between items-center w-full">
        <div className="flex gap-4">
          <div className="leading-10">{`${selected.length} topics selected`}</div>
          <button
            type="button"
            className="cursor-pointer underline"
            onClick={() => setSelected(topics.map((t) => t.id))}
          >
            Select all
          </button>
          <button
            type="reset"
            className="cursor-pointer underline"
            onClick={() => setSelected([])}
          >
            Clear
          </button>
        </div>
        <Button onClick={handleStartQuiz}>
          Start quiz
          <ArrowRightIcon />
        </Button>
      </div>
    </div>
  );
}
