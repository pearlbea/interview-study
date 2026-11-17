"use client";

import { ReactElement } from "react";
import { CheckBox } from "../components/CheckBox/CheckBox";
import { grotesk } from "../fonts";

interface TopicCardProps {
  topic: string;
  text: string;
  selected: boolean;
  handleSelected: (topic: string) => void;
}

export function TopicCard({
  topic,
  text,
  selected,
  handleSelected,
}: TopicCardProps): ReactElement {
  return (
    <button
      type="button"
      aria-pressed={selected}
      onClick={() => handleSelected(topic)}
      className={`flex flex-col p-4 border-2 rounded-2xl min-h-40 min-w-52 gap-4 cursor-pointer ${selected ? "bg-(--topic-background)" : "bg-white"} ${selected ? "border-(--purple)" : "border-(--grey)"} ${selected ? "shadow-(--topic-shadow-selected)" : "shadow-(--topic-shadow)"}`}
    >
      <span className="flex justify-end">
        <CheckBox selected={selected} />
      </span>
      <span className="flex flex-col text-left">
        <h3 className={`${grotesk.className} text-xl`}>{topic}</h3>
        <span>{text}</span>
      </span>
    </button>
  );
}
