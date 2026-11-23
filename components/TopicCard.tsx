"use client";

import { ReactElement } from "react";
import { Checkbox } from "@/components/ui/checkbox";

interface TopicCardProps {
  id: string;
  name: string;
  selected: boolean;
  handleSelected: (topic: string) => void;
}

export function TopicCard({
  id,
  name,
  selected,
  handleSelected,
}: TopicCardProps): ReactElement {
  return (
    <button
      aria-pressed={selected}
      onClick={() => handleSelected(id)}
      className={`flex flex-col p-4 border-2 rounded-2xl min-h-40 min-w-52 gap-4 shadow-[0px_6px_0px_rgb(--border))] shadow-border ${selected ? "bg-primary-foreground border-(--primary) shadow-[0px_6px_0px_rgb(--primary))] shadow-primary" : "bg-white"} `}
    >
      <span className="flex justify-end">
        <Checkbox checked={selected} aria-hidden="true" />
      </span>
      <span className="flex flex-col text-left">
        <h3 className="text-xl font-heading font-bold">{name}</h3>
      </span>
    </button>
  );
}
