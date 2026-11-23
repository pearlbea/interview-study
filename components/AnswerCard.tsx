"use client";

import { RateQuestion } from "@/components/RateQuestion";
import type { Question } from "@/lib/schemas/question";
import type { Rating } from "@/lib/ratings";

export function AnswerCard({
  question,
  error,
  status,
  handleRating,
}: {
  question: Question;
  error: string | null;
  status: string;
  handleRating: (value: Rating) => Promise<void>;
}) {


  
  return (
    <div className="relative pt-4 mt-16">
      <div className="absolute top-0 inset-x-6 bottom-6 bg-(--chart-3) rounded-[28px] -rotate-[1.6deg]"></div>
      <div className="absolute top-2 inset-x-3 bottom-3 bg-(--chart-1) rounded-[28px] rotate-[1.2deg]"></div>
      <div className="relative bg-white border-2 border-[#1c1b2e] rounded-[28px] shadow-[0_8px_0_#1c1b2e] p-9 flex flex-col gap-7">
        <div className="flex">
          <span className="bg-(--color-yellow) rounded-lg px-4 py-1 flex-start heading-font">
            ANSWER
          </span>
        </div>
        <div className={`flex text-2xl heading-font`}>{question.answer}</div>
        <div className="p-4 border-2 border-dashed border-(--color-darker-grey) rounded-xl bg-(--background)">
          Your answer
        </div>
        <RateQuestion handleRating={handleRating} />
        {status === "saving" && <p role="status">Saving rating…</p>}
        {status === "saved" && <p role="status">Rating saved!</p>}
        {error && <p role="alert">{error}</p>}
        <div>{question.more_info}</div>
        <div></div>
      </div>
    </div>
  );
}
