"use client";

import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Markdown } from "@/components/Markdown";

export function CardFront({
  question,
  yourAnswerText,
  handleYourAnswer,
}: {
  question: string;
  yourAnswerText: string;
  handleYourAnswer: (answer: string) => void;
}) {
  return (
    <>
      <div className="relative pt-4 mt-8">
        <div className="absolute top-0 inset-x-6 bottom-6 bg-(--chart-1) rounded-4xl -rotate-[1.6deg]"></div>
        <div className="absolute top-2 inset-x-3 bottom-3 bg-(--chart-3) rounded-4xl rotate-[1.2deg]"></div>
        <div className="relative bg-white border-2 border-(--foreground) rounded-4xl shadow-[0_8px_0_#1c1b2e] p-9 flex flex-col gap-7">
          <div className="flex">
            <span className="font-bold">QUESTION</span>
          </div>
          <div className="font-heading text-xl">
            <Markdown>{question}</Markdown>
          </div>
          <div>
            <Label htmlFor="your-answer" className="mb-4 font-bold">
              Your answer
            </Label>
            <Textarea
              id="your-answer"
              placeholder="Jot down your answer. You can compare it to our answer when you flip the card."
              value={yourAnswerText}
              onChange={(e) => handleYourAnswer(e.target.value)}
            />
          </div>
        </div>
      </div>
    </>
  );
}
