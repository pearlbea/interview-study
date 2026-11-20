"use client";

import { useState } from "react";
import { grotesk } from "../app/fonts";
import type { Questions } from "@/lib/schemas/question";

function QuestionCard({ question }: { question: string }) {
  return (
    <div className="relative pt-4 mt-16">
      <div className="absolute top-0 inset-x-6 bottom-6 bg-(--color-yellow) rounded-4xl -rotate-[1.6deg]"></div>
      <div className="absolute top-2 inset-x-3 bottom-3 bg-(--color-lilac) rounded-4xl rotate-[1.2deg]"></div>
      <div className="relative bg-white border-2 border-(--dark) rounded-4xl shadow-[0_8px_0_#1c1b2e] p-9 flex flex-col gap-7">
        <div className="flex">
          <span
            className={`${grotesk.className} bg-(--color-medium-purple) rounded-lg px-4 py-1 flex-start`}
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

function AnswerCard({
  answer,
  moreInfo,
}: {
  answer: string;
  moreInfo: string;
}) {
  return (
    <div className="relative pt-4 mt-16">
      <div className="absolute top-0 inset-x-6 bottom-6 bg-(--color-lilac) rounded-[28px] -rotate-[1.6deg]"></div>
      <div className="absolute top-2 inset-x-3 bottom-3 bg-(--color-light-yellow) rounded-[28px] rotate-[1.2deg]"></div>
      <div className="relative bg-white border-2 border-[#1c1b2e] rounded-[28px] shadow-[0_8px_0_#1c1b2e] p-9 flex flex-col gap-7">
        <div className="flex">
          <span
            className={`${grotesk.className} bg-(--color-yellow) rounded-lg px-4 py-1 flex-start`}
          >
            ANSWER
          </span>
        </div>
        <div className={`flex text-2xl ${grotesk.className}`}>{answer}</div>
        <div>{moreInfo}</div>
        <div>
          <span>Your answer</span>
        </div>
      </div>
    </div>
  );
}

export function Questions({ questions }: { questions: Questions }) {
  const [questionIndex, setQuestionIndex] = useState(0);
  const [cardShown, setCardShown] = useState<"question" | "answer">("question");

  const maxIndex = questions.length - 1;

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
        <QuestionCard question={questions[questionIndex]?.question} />
      ) : (
        <AnswerCard
          answer={questions[questionIndex]?.answer}
          moreInfo={questions[questionIndex]?.more_info || ""}
        />
      )}

      <div className="flex justify-between mt-8">
        <button
          type="button"
          className="rounded-xl border-2 border-(--color-darker-grey) px-4 py-2"
          onClick={handleFirstClick}
        >
          {cardShown === "question" ? "Skip" : "Flip back"}
        </button>

        {cardShown === "answer" && questionIndex === maxIndex ? (
          "No more questions"
        ) : (
          <button
            type="button"
            className="inline-flex items-center text-white bg-(--color-purple) px-4 py-2 gap-1 rounded-xl cursor-pointer"
            onClick={handleSecondClick}
          >
            {cardShown === "question" ? "Flip card" : "Next card"}
          </button>
        )}
      </div>
    </div>
  );
}
