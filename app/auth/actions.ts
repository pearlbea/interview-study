"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { siteUrl } from "@/lib/supabase/config";

export type AuthState = { error?: string; message?: string };

export async function emailAuth(
  mode: "login" | "signup",
  _previousState: AuthState,
  formData: FormData,
): Promise<AuthState> {
  const email = formData.get("email");
  const password = formData.get("password");
  if (
    typeof email !== "string" ||
    !email.trim() ||
    typeof password !== "string" ||
    !password
  ) {
    return { error: "Enter your email and password." };
  }
  if (mode === "signup" && password.length < 8) {
    return { error: "Your password must be at least 8 characters." };
  }

  const supabase = await createClient(true);
  if (mode === "signup") {
    const { data, error } = await supabase.auth.signUp({
      email: email.trim(),
      password,
      options: { emailRedirectTo: `${siteUrl()}/auth/callback` },
    });
    if (error) {
      return { error: error.message };
    }
    if (data.session) {
      redirect("/");
    }
    return {
      message: "If this email can be registered, check your inbox for a confirmation link. Open it in the same browser and device you used to sign up.",
    };
  }

  const { error } = await supabase.auth.signInWithPassword({
    email: email.trim(),
    password,
  });
  if (error) {
    return { error: "Unable to sign in. Check your credentials and confirm your email." };
  }
  redirect("/");
}

export async function googleAuth() {
  const supabase = await createClient(true);
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: { redirectTo: `${siteUrl()}/auth/callback` },
  });
  if (error || !data.url) {
    console.error("Could not start Google sign-in:", error?.message ?? "Missing OAuth URL");
    redirect("/auth/error");
  }
  redirect(data.url);
}

export async function signOut() {
  const supabase = await createClient(true);
  const { error } = await supabase.auth.signOut();
  if (error) {
    console.error("Could not sign out:", error.message);
    redirect("/auth/error");
  }
  redirect("/");
}
