import Link from "next/link";
import { AuthForm } from "@/app/auth/auth-form";

export default function SignupPage() {
  return (
    <main className="flex flex-1 flex-col items-center justify-center gap-6 p-6">
      <AuthForm mode="signup" />
      <p>Already have an account? <Link href="/login" className="underline">Sign in</Link></p>
    </main>
  );
}
