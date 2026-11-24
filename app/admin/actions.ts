"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { getAdminClient } from "@/lib/supabase/admin";

const cardInput = z.object({
  id: z.union([z.literal(""), z.uuid()]),
  question: z.string().refine((value) => value.trim().length > 0),
  answer: z.string().refine((value) => value.trim().length > 0),
  moreInfo: z.string(),
  status: z.enum(["draft", "published", "archived"]),
  topicIds: z.array(z.uuid()).min(1),
});

export type AdminActionState = { error?: string };

export async function saveCard(
  _previous: AdminActionState,
  formData: FormData,
): Promise<AdminActionState> {
  const { supabase, access } = await getAdminClient();
  if (access !== "admin") return { error: "Admin access is required." };

  const result = cardInput.safeParse({
    id: formData.get("id"),
    question: formData.get("question"),
    answer: formData.get("answer"),
    moreInfo: formData.get("moreInfo"),
    status: formData.get("status"),
    topicIds: formData.getAll("topicIds"),
  });
  if (!result.success) {
    return { error: "Enter a question and answer, choose a status and at least one topic." };
  }

  const { error } = await supabase.rpc("admin_save_card", {
    p_id: result.data.id || null,
    p_question: result.data.question,
    p_answer: result.data.answer,
    p_more_info: result.data.moreInfo,
    p_status: result.data.status,
    p_topic_ids: result.data.topicIds,
  });
  if (error) {
    console.error("Could not save card:", error.message);
    return { error: "Could not save the card. Please try again." };
  }

  revalidatePath("/admin");
  redirect("/admin?notice=saved");
}

export async function removeCard(
  _previous: AdminActionState,
  formData: FormData,
): Promise<AdminActionState> {
  const { supabase, access } = await getAdminClient();
  if (access !== "admin") return { error: "Admin access is required." };

  const id = z.uuid().safeParse(formData.get("id"));
  if (!id.success) return { error: "Invalid card ID." };

  const { data, error } = await supabase.rpc("admin_remove_card", { p_id: id.data });
  if (error || (data !== "deleted" && data !== "archived")) {
    console.error("Could not remove card:", error?.message ?? "Unexpected result");
    return { error: "Could not remove the card. Please try again." };
  }

  revalidatePath("/admin");
  redirect(`/admin?notice=${data}`);
}
