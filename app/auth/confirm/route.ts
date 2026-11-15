import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { siteUrl } from "@/lib/supabase/config";

export async function GET(request: NextRequest) {
  const tokenHash = request.nextUrl.searchParams.get("token_hash");
  if (tokenHash && request.nextUrl.searchParams.get("type") === "email") {
    const supabase = await createClient(true);
    const { error } = await supabase.auth.verifyOtp({
      token_hash: tokenHash,
      type: "email",
    });
    if (!error) {
      return NextResponse.redirect(new URL("/", siteUrl()));
    }
    console.error("Email confirmation failed:", error.message);
  }
  return NextResponse.redirect(new URL("/auth/error", siteUrl()));
}
