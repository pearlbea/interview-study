import Link from "next/link";

export default function AuthErrorPage() {
  return (
    <main className="flex flex-1 flex-col items-center justify-center gap-4 p-6 text-center">
      <h1 className="text-2xl font-semibold">Authentication failed</h1>
      <p>The sign-in or confirmation link may have expired. Please try again.</p>
      <Link href="/login" className="underline">Return to sign in</Link>
    </main>
  );
}
