"use server";

import { z } from "zod";
import { createClient } from "@/lib/supabase/server";

const ReviewSchema = z.object({
  cardId: z.uuid(),
  rating: z.number().int().min(1).max(4),
});

export async function saveReview(input: {
  cardId: string;
  rating: number;
}): Promise<{ error?: string }> {
  const result = ReviewSchema.safeParse(input);
  if (!result.success) {
    return { error: "Invalid rating" };
  }

  const supabase = await createClient();
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return { error: "Please sign in to save your rating." };
  }

  const { error } = await supabase.from("reviews").insert({
    user_id: user.id,
    card_id: result.data.cardId,
    rating: result.data.rating,
    review_kind: "practice",
  });

  if (error) {
    console.error("Could not save rating:", error.message);
    return { error: "Could not save your rating. Please try again." };
  }

  return {};
}
