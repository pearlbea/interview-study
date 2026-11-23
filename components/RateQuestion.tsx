"use client";

import { useState } from "react";
import { type Rating, ratings } from "@/lib/ratings";
import { Button } from "@/components/ui/button";

export function RateQuestion({
  handleRating,
  ratingStatus,
}: {
  handleRating: (number: Rating) => Promise<void>;
  ratingStatus: "idle" | "saving" | "saved";
}) {
  const [selectedRating, setSelectedRating] = useState<Rating | null>(null);

  function handleClick(value: Rating) {
    handleRating(value);
    setSelectedRating(value);
  }
  return (
    <div>
      <h3>How well did you recall the answer?</h3>

      <ul className="flex gap-4">
        {ratings.map(({ value, label }) => (
          <li key={value}>
            <Button
              variant="outline"
              onClick={() => handleClick(value)}
              aria-pressed={selectedRating === value}
              className={` ${selectedRating === value ? "bg-muted" : "bg-background"}`}
              disabled={ratingStatus === "saving"}
            >
              {label}
            </Button>
          </li>
        ))}
      </ul>
    </div>
  );
}
