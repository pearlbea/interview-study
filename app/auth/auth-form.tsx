"use client";

import { useActionState } from "react";
import { emailAuth, type AuthState } from "./actions";

const initialState: AuthState = {};

export function AuthForm({ mode }: { mode: "login" | "signup" }) {
  const [state, action, pending] = useActionState(
    emailAuth.bind(null, mode),
    initialState,
  );
  const signup = mode === "signup";

  return (
    <div className="w-full max-w-sm space-y-6">
      <h1 className="text-3xl font-semibold">
        {signup ? "Create an account" : "Sign in"}
      </h1>
      <form action={action} className="space-y-4">
        <div className="space-y-1">
          <label htmlFor="email" className="block font-medium">Email</label>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            required
            className="w-full rounded border border-zinc-400 px-3 py-2"
          />
        </div>
        <div className="space-y-1">
          <label htmlFor="password" className="block font-medium">Password</label>
          <input
            id="password"
            name="password"
            type="password"
            autoComplete={signup ? "new-password" : "current-password"}
            minLength={signup ? 8 : undefined}
            required
            className="w-full rounded border border-zinc-400 px-3 py-2"
          />
          {signup && <p className="text-sm">At least 8 characters.</p>}
        </div>
        {state.error && <p role="alert" className="text-red-600 dark:text-red-400">{state.error}</p>}
        {state.message && <p role="status">{state.message}</p>}
        <button disabled={pending} className="w-full rounded bg-foreground px-4 py-2 font-medium text-background disabled:opacity-50">
          {pending ? "Please wait..." : signup ? "Create account" : "Sign in"}
        </button>
      </form>
    </div>
  );
}
