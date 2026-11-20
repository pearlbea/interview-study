"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { TopicCard } from "./TopicCard";

export type Topic = { id: string; name: string };

// TODO: Move svg to component for dark mode
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
      <div className="flex border-2 rounded-2xl p-4 mt-8 bg-white border-(--color-grey) justify-between items-center w-full">
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
        <button
          type="button"
          className="inline-flex items-center text-white bg-(--color-purple) px-4 py-2 gap-1 rounded-xl cursor-pointer"
          onClick={handleStartQuiz}
        >
          Start quiz
          <svg width="20" height="20" viewBox="0 0 20 20" aria-hidden="true">
            <path
              d="M4 10h11M11 5l5 5-5 5"
              stroke="#FFFFFF"
              strokeWidth="2.2"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
            ></path>
          </svg>
        </button>
      </div>
    </div>
  );
}
