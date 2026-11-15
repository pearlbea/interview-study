import Link from "next/link";
import { connection } from "next/server";
import { Suspense } from "react";
import { isAuthSessionMissingError } from "@supabase/supabase-js";
import { signOut } from "@/app/auth/actions";
import { createClient } from "@/lib/supabase/server";

async function Account() {
  await connection();
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getClaims();
  if (error && !isAuthSessionMissingError(error)) {
    console.error("Could not verify session:", error.message);
    throw new Error("Could not verify your session. Please try again.");
  }

  if (!data?.claims) {
    return (
      <div className="flex gap-4">
        <Link href="/login" className="underline">Sign in</Link>
        <Link href="/signup" className="underline">Create an account</Link>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <p>Signed in as {data.claims.email}</p>
      <form action={signOut}>
        <button className="rounded border border-zinc-400 px-4 py-2">Sign out</button>
      </form>
    </div>
  );
}

export default function Home() {
  return (
    <main className="flex flex-1 flex-col items-center justify-center gap-6 p-6 text-center">
      <h1 className="text-3xl font-semibold">Interview Study</h1>
      <p>Sign in to keep track of your study progress.</p>
      <Suspense fallback={<p>Loading account...</p>}>
        <Account />
      </Suspense>
    </main>
  );
}
