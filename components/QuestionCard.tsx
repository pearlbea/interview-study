"use client";

import { useState } from "react";
import { grotesk } from "../app/fonts";

export function QuestionCard({ questions }) {
  const [questionIndex, setQuestionIndex] = useState(0);

  return (
    <div>
      <div className="relative pt-4 mt-16">
        <div className="absolute top-0 inset-x-6 bottom-6 bg-[#ffd25e] rounded-[28px] -rotate-[1.6deg]"></div>
        <div className="absolute top-2 inset-x-3 bottom-3 bg-[#dcd6ff] rounded-[28px] rotate-[1.2deg]"></div>
        <div>
          <div className="relative bg-white border-2 border-[#1c1b2e] rounded-[28px] shadow-[0_8px_0_#1c1b2e] p-9 flex flex-col gap-7">
            <div className="flex">
              <span
                className={`${grotesk.className} bg-[rgb(236,233,255)] rounded-lg px-4 py-1 flex-start`}
              >
                QUESTION
              </span>
            </div>
            <div className={`flex text-2xl ${grotesk.className}`}>
              {questions[questionIndex].question}
            </div>
            <div>
              <span>Your answer</span>
            </div>
          </div>
        </div>
      </div>
      <div className="flex justify-between mt-8">
        <button type="button">Skip</button>
        <button type="button">Flip card</button>
      </div>
    </div>
  );
}
