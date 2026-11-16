"use client";

import { useState } from "react";
import { ReactElement } from "react";
import { CheckBox } from "../components/CheckBox/CheckBox";

interface TopicCardProps {
  title: string;
  text: string;
}

export function TopicCard({ title, text }: TopicCardProps): ReactElement {
  const [pressed, setPressed] = useState(false);
  return (
    <button
      type="button"
      aria-pressed={pressed}
      className={`flex flex-col p-8 gap-4 border-2 rounded-2xl ${pressed ? "bg-(--topic-background)" : "bg-white"} ${pressed ? "border-(--purple)" : "border-(--grey)"} ${pressed ? "shadow-(--topic-shadow-pressed)" : "shadow-(--topic-shadow)"}`}
      onClick={() => setPressed((prev) => !prev)}
    >
      <span className="flex justify-end">
        <CheckBox pressed={pressed} />
      </span>
      <span className="flex flex-col">
        <h3>{title}</h3>
        <span>{text}</span>
      </span>
    </button>
  );
}
