"use client";

import { useState } from "react";
import { TopicCard } from "./TopicCard";

interface TopicSelectorProps {
  topics: Record<string, string>;
}

export function TopicSelector({ topics }: TopicSelectorProps) {
  const [selected, setSelected] = useState<string[]>([]);

  function handleSelected(topic: string) {
    setSelected((current) =>
      current.includes(topic)
        ? current.filter((item) => item !== topic)
        : [...current, topic],
    );
  }

  return (
    <div className="flex flex-wrap gap-4 justify-start">
      {Object.entries(topics).map(([k, v]) => (
        <TopicCard
          key={k}
          topic={k}
          text={v}
          selected={selected.includes(k)}
          handleSelected={handleSelected}
        />
      ))}
      <div className="flex border-2 rounded-2xl p-4 mt-8 bg-white border-(--grey) justify-between items-center w-full">
        <div className="flex gap-4">
          <div className="leading-10">{`${selected.length} topics selected`}</div>
          <button
            type="button"
            className="cursor-pointer underline"
            onClick={() => setSelected(Object.keys(topics))}
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
          className="inline-flex items-center text-white bg-(--purple) px-4 py-2 gap-1 rounded-xl cursor-pointer"
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
