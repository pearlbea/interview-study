import "server-only";

import { isAuthSessionMissingError } from "@supabase/supabase-js";
import { createClient } from "./server";

export async function getAdminClient() {
  const supabase = await createClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();

  if (authError && !isAuthSessionMissingError(authError)) {
    console.error("Could not verify session:", authError.message);
    throw new Error("Could not verify your session.");
  }
  if (!user) return { supabase, access: "signed-out" as const };

  const { data: isAdmin, error } = await supabase.rpc("is_admin");
  if (error) {
    console.error("Could not verify admin access:", error.message);
    throw new Error("Could not verify admin access.");
  }
  return { supabase, access: isAdmin ? "admin" as const : "forbidden" as const };
}
