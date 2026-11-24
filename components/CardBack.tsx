"use client";

import { RatingButtons } from "@/components/RatingButtons";
import type { Card } from "@/lib/schemas/card";
import type { Rating } from "@/lib/ratings";
import { Markdown } from "@/components/Markdown";

export function CardBack({
  card,
  yourAnswerText,
  ratingError,
  ratingStatus,
  handleRating,
}: {
  card: Card;
  yourAnswerText: string;
  ratingError: string | null;
  ratingStatus: "idle" | "saving" | "saved";
  handleRating: (value: Rating) => Promise<void>;
}) {
  return (
    <div className="relative pt-4 mt-8">
      <div className="absolute top-0 inset-x-6 bottom-6 bg-(--chart-3) rounded-[28px] -rotate-[1.6deg]"></div>
      <div className="absolute top-2 inset-x-3 bottom-3 bg-(--chart-1) rounded-[28px] rotate-[1.2deg]"></div>
      <div className="relative bg-white border-2 border-[#1c1b2e] rounded-[28px] shadow-[0_8px_0_#1c1b2e] p-9 flex flex-col gap-7">
        <div className="flex">
          <span className="bg-(--color-yellow) rounded-lg px-4 py-1 flex-start heading-font">
            ANSWER
          </span>
        </div>
        <div className={`text-2xl heading-font`}>
          <Markdown>{card.answer}</Markdown>
        </div>
        <div>{card.more_info}</div>
        <div className="flex flex-col p-4 border-2 border-dashed rounded-xl bg-muted">
          <span className="mb-2">You wrote:</span>
          <div className="whitespace-pre-wrap">{yourAnswerText}</div>
        </div>
        <RatingButtons handleRating={handleRating} ratingStatus={ratingStatus} />
        {ratingStatus === "saving" && <p role="status">Saving rating…</p>}
        {ratingStatus === "saved" && <p role="status">Rating saved!</p>}
        {ratingError && <p role="alert">{ratingError}</p>}

        <div></div>
      </div>
    </div>
  );
}
