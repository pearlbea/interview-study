import Link from "next/link";
import { AuthForm } from "@/app/auth/auth-form";

export default function LoginPage() {
  return (
    <main className="flex flex-1 flex-col items-center justify-center gap-6 p-6">
      <AuthForm mode="login" />
      <p>New here? <Link href="/signup" className="underline">Create an account</Link></p>
    </main>
  );
}
