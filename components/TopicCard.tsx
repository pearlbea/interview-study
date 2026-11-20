"use client";

import { ReactElement } from "react";
import { CheckBox } from "./CheckBox/CheckBox";
import { grotesk } from "../app/fonts";
import { TypeScriptLogo } from "./TypeScript";

interface TopicCardProps {
  id: string;
  name: string;
  selected: boolean;
  handleSelected: (topic: string) => void;
}

// TODO: Add icons for each topic
export function TopicCard({
  id,
  name,
  selected,
  handleSelected,
}: TopicCardProps): ReactElement {
  return (
    <button
      type="button"
      aria-pressed={selected}
      onClick={() => handleSelected(id)}
      className={`flex flex-col p-4 border-2 rounded-2xl min-h-40 min-w-52 gap-4 cursor-pointer ${selected ? "bg-(--color-medium-purple)" : "bg-white"} ${selected ? "border-(--color-purple)" : "border-(--color-grey)"} ${selected ? "shadow-(--topic-shadow-selected)" : "shadow-(--topic-shadow)"}`}
    >
      <span className="flex justify-between">
        {name === "TypeScript" ? <TypeScriptLogo /> : ""}
        <CheckBox selected={selected} />
      </span>
      <span className="flex flex-col text-left">
        <h3 className={`${grotesk.className} text-xl`}>{name}</h3>
      </span>
    </button>
  );
}
