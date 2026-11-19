"use client";

import { useState } from "react";
import { grotesk } from "../app/fonts";

function QuestionCard({ question }) {
  return (
    <div className="relative pt-4 mt-16">
      <div className="absolute top-0 inset-x-6 bottom-6 bg-(--light-yellow) rounded-[28px] -rotate-[1.6deg]"></div>
      <div className="absolute top-2 inset-x-3 bottom-3 bg-(--light-purple) rounded-[28px] rotate-[1.2deg]"></div>
      <div className="relative bg-white border-2 border-[#1c1b2e] rounded-[28px] shadow-[0_8px_0_#1c1b2e] p-9 flex flex-col gap-7">
        <div className="flex">
          <span
            className={`${grotesk.className} bg-[rgb(236,233,255)] rounded-lg px-4 py-1 flex-start`}
          >
            QUESTION
          </span>
        </div>
        <div className={`flex text-2xl ${grotesk.className}`}>{question}</div>
        <div>
          <span>Your answer</span>
        </div>
      </div>
    </div>
  );
}

function AnswerCard({ answer }) {
  return (
    <div className="relative pt-4 mt-16">
      <div className="absolute top-0 inset-x-6 bottom-6 bg-(--light-purple) rounded-[28px] -rotate-[1.6deg]"></div>
      <div className="absolute top-2 inset-x-3 bottom-3 bg-(--light-yellow) rounded-[28px] rotate-[1.2deg]"></div>
      <div className="relative bg-white border-2 border-[#1c1b2e] rounded-[28px] shadow-[0_8px_0_#1c1b2e] p-9 flex flex-col gap-7">
        <div className="flex">
          <span
            className={`${grotesk.className} bg-(--yellow) rounded-lg px-4 py-1 flex-start`}
          >
            Answer
          </span>
        </div>
        <div className={`flex text-2xl ${grotesk.className}`}>{answer}</div>
        <div>
          <span>Your answer</span>
        </div>
      </div>
    </div>
  );
}

export function Questions({ questions }) {
  const [questionIndex, setQuestionIndex] = useState(0);
  const [cardShown, setCardShown] = useState<"question" | "answer">("question");

  // TODO: Show message when questions run out

  function handleFirstClick() {
    if (cardShown === "question") {
      handleIndexChange();
    } else {
      handleCardFlip();
    }
  }

  function handleSecondClick() {
    if (cardShown === "question") {
      handleCardFlip();
    } else {
      handleIndexChange();
    }
  }

  function handleIndexChange() {
    const maxIndex = questions.length - 1;
    if (questionIndex < maxIndex) {
      setQuestionIndex((prev) => prev + 1);
      setCardShown("question");
    }
  }

  function handleCardFlip() {
    if (cardShown === "question") {
      setCardShown("answer");
    } else {
      setCardShown("question");
    }
  }

  return (
    <div className="">
      {cardShown === "question" ? (
        <QuestionCard question={questions[questionIndex].question} />
      ) : (
        <AnswerCard answer={questions[questionIndex].answer} />
      )}

      <div className="flex justify-between mt-8">
        <button type="button" onClick={handleFirstClick}>
          {cardShown === "question" ? "Skip" : "Flip back"}
        </button>
        <button type="button" onClick={handleSecondClick}>
          {cardShown === "question" ? "Flip card" : "Next card"}
        </button>
      </div>
    </div>
  );
}
