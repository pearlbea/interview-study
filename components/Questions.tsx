"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
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
    ratingStatus: "idle" | "saving" | "saved";
    ratingError: string | null;
  } | null>(null);

  const [yourAnswer, setYourAnswer] = useState<{
    questionId: string;
    answerText: string;
  } | null>(null);

  function handleYourAnswer(answer: string) {
    setYourAnswer({
      questionId: questions[questionIndex].id,
      answerText: answer,
    });
  }

  const maxIndex = questions.length - 1;
  const currentRating =
    ratingState?.questionId === questions[questionIndex]?.id
      ? ratingState
      : null;
  const currentAnswer =
    yourAnswer?.questionId === questions[questionIndex]?.id
      ? yourAnswer.answerText
      : "";

  async function handleRating(value: number) {
    const pending = {
      questionId: questions[questionIndex].id,
      ratingStatus: "saving" as const,
      ratingError: null,
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
              ratingStatus: response.error ? "idle" : "saved",
              ratingError: response.error ?? null,
            }
          : current,
      );
    } catch (error) {
      setRatingState((current) =>
        current === pending
          ? {
              questionId: pending.questionId,
              ratingStatus: "idle",
              ratingError:
                error instanceof Error ? error.message : String(error),
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
      setYourAnswer(null);
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
      <div>{`Question ${questionIndex + 1} of ${questions.length}`}</div>
      {cardShown === "question" ? (
        <QuestionCard
          question={questions[questionIndex]?.question}
          yourAnswerText={currentAnswer}
          handleYourAnswer={handleYourAnswer}
        />
      ) : (
        <AnswerCard
          question={questions[questionIndex]}
          yourAnswerText={currentAnswer}
          handleRating={handleRating}
          ratingError={currentRating?.ratingError ?? null}
          ratingStatus={currentRating?.ratingStatus ?? "idle"}
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
