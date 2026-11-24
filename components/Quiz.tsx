"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { saveReview } from "@/app/actions";
import { CardBack } from "@/components/CardBack";
import { CardFront } from "@/components/CardFront";
import { RefreshCw, RefreshCcw, ArrowRight } from "lucide-react";

import type { Cards } from "@/lib/schemas/card";

export function Quiz({ cards }: { cards: Cards }) {
  const [cardIndex, setCardIndex] = useState(0);
  const [sideShown, setSideShown] = useState<"question" | "answer">("question");

  const [ratingState, setRatingState] = useState<{
    cardId: string;
    ratingStatus: "idle" | "saving" | "saved";
    ratingError: string | null;
  } | null>(null);

  const [yourAnswer, setYourAnswer] = useState<{
    cardId: string;
    answerText: string;
  } | null>(null);

  function handleYourAnswer(answer: string) {
    setYourAnswer({
      cardId: cards[cardIndex].id,
      answerText: answer,
    });
  }

  const maxIndex = cards.length - 1;
  const currentRating =
    ratingState?.cardId === cards[cardIndex]?.id
      ? ratingState
      : null;
  const currentAnswer =
    yourAnswer?.cardId === cards[cardIndex]?.id
      ? yourAnswer.answerText
      : "";

  async function handleRating(value: number) {
    const pending = {
      cardId: cards[cardIndex].id,
      ratingStatus: "saving" as const,
      ratingError: null,
    };
    setRatingState(pending);

    try {
      const response = await saveReview({
        cardId: pending.cardId,
        rating: value,
      });

      // Only the request still associated with this card may update its feedback
      setRatingState((current) =>
        current === pending
          ? {
              cardId: pending.cardId,
              ratingStatus: response.error ? "idle" : "saved",
              ratingError: response.error ?? null,
            }
          : current,
      );
    } catch (error) {
      setRatingState((current) =>
        current === pending
          ? {
              cardId: pending.cardId,
              ratingStatus: "idle",
              ratingError:
                error instanceof Error ? error.message : String(error),
            }
          : current,
      );
    }
  }

  function handleFirstClick() {
    if (sideShown === "question") {
      handleNextCard();
    } else {
      handleFlip();
    }
  }

  function handleSecondClick() {
    if (sideShown === "question") {
      handleFlip();
    } else {
      handleNextCard();
    }
  }

  function handleNextCard() {
    if (cardIndex < cards.length) {
      setRatingState(null);
      setYourAnswer(null);
      setCardIndex((prev) => prev + 1);
      setSideShown("question");
    }
  }

  function handleFlip() {
    if (sideShown === "question") {
      setSideShown("answer");
    } else {
      setSideShown("question");
    }
  }

  return (
    <div className="">
      <div>{`Card ${cardIndex + 1} of ${cards.length}`}</div>
      {sideShown === "question" ? (
        <CardFront
          question={cards[cardIndex]?.question}
          yourAnswerText={currentAnswer}
          handleYourAnswer={handleYourAnswer}
        />
      ) : (
        <CardBack
          card={cards[cardIndex]}
          yourAnswerText={currentAnswer}
          handleRating={handleRating}
          ratingError={currentRating?.ratingError ?? null}
          ratingStatus={currentRating?.ratingStatus ?? "idle"}
        />
      )}

      <div className="flex justify-between mt-8">
        {sideShown == "question" && cardIndex === maxIndex ? (
          "Last card"
        ) : (
          <Button size="lg" onClick={handleFirstClick} variant="outline">
            {sideShown === "question" ? (
              "Skip"
            ) : (
              <>
                <RefreshCcw /> Flip back
              </>
            )}
          </Button>
        )}

        {sideShown === "answer" && cardIndex === maxIndex ? (
          "No more cards"
        ) : (
          <Button size="lg" onClick={handleSecondClick}>
            {sideShown === "question" ? (
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
