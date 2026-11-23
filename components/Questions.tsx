"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Progress,
  ProgressLabel,
  ProgressValue,
} from "@/components/ui/progress";
import { rateQuestion } from "@/app/actions";
import { AnswerCard } from "@/components/AnswerCard";
import { QuestionCard } from "@/components/QuestionCard";
import { RefreshCw, RefreshCcw, ArrowRight } from "lucide-react";

import type { Questions } from "@/lib/schemas/question";

export function Questions({ questions }: { questions: Questions }) {
  const [questionIndex, setQuestionIndex] = useState(0);
  const [cardShown, setCardShown] = useState<"question" | "answer">("question");

  const [ratingState, setRatingState] = useState<{
    questionId: string;
    status: "idle" | "saving" | "saved";
    error: string | null;
  } | null>(null);

  const maxIndex = questions.length - 1;
  const percentDone = (questionIndex / questions.length) * 100;
  const currentRating = ratingState?.questionId === questions[questionIndex]?.id
    ? ratingState
    : null;

  async function handleRating(value: number) {
    const pending = {
      questionId: questions[questionIndex].id,
      status: "saving" as const,
      error: null,
    };
    setRatingState(pending);

    try {
      const response = await rateQuestion({
        questionId: pending.questionId,
        ratingValue: value,
      });

      // Only the request still associated with this card may update its feedback
      setRatingState((current) =>
        current === pending
          ? {
              questionId: pending.questionId,
              status: response.error ? "idle" : "saved",
              error: response.error ?? null,
            }
          : current,
      );
    } catch (error) {
      setRatingState((current) =>
        current === pending
          ? {
              questionId: pending.questionId,
              status: "idle",
              error: error instanceof Error ? error.message : String(error),
            }
          : current,
      );
    }
  }

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
    if (questionIndex < questions.length) {
      setRatingState(null);
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
      <Progress value={percentDone} className="w-full">
        <ProgressLabel>{`Question ${questionIndex + 1} of ${questions.length}`}</ProgressLabel>
        <ProgressValue />
      </Progress>
      {cardShown === "question" ? (
        <QuestionCard question={questions[questionIndex]?.question} />
      ) : (
        <AnswerCard
          question={questions[questionIndex]}
          handleRating={handleRating}
          error={currentRating?.error ?? null}
          status={currentRating?.status ?? "idle"}
        />
      )}

      <div className="flex justify-between mt-8">
        {cardShown == "question" && questionIndex === maxIndex ? (
          "Last question"
        ) : (
          <Button size="lg" onClick={handleFirstClick} variant="outline">
            {cardShown === "question" ? (
              "Skip"
            ) : (
              <>
                <RefreshCcw /> Flip back
              </>
            )}
          </Button>
        )}

        {cardShown === "answer" && questionIndex === maxIndex ? (
          "No more questions"
        ) : (
          <Button size="lg" onClick={handleSecondClick}>
            {cardShown === "question" ? (
              <>
                <RefreshCw />
                Flip card
              </>
            ) : (
              <>
                Next card <ArrowRight />
              </>
            )}
          </Button>
        )}
      </div>
    </div>
  );
}
