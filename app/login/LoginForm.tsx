"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

const inputClass =
  "w-full rounded-xl border border-ink/10 bg-white px-4 py-3 text-[15px] text-ink placeholder:text-muted/70 outline-none transition-all duration-150 focus:border-electric-violet focus:ring-4 focus:ring-electric-violet/15";

export default function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [error, setError] = useState<string | null>(null);
  const [signingIn, setSigningIn] = useState(false);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (signingIn) return;
    setError(null);
    setSigningIn(true);

    const form = new FormData(e.currentTarget);
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: form.get("email"),
        password: form.get("password"),
      }),
    });

    if (res.ok) {
      const next = searchParams.get("next");
      router.push(next && next.startsWith("/") ? next : "/dashboard");
      router.refresh();
      return;
    }

    let message = "Something went wrong. Please try again.";
    try {
      const data = await res.json();
      if (typeof data.error === "string") message = data.error;
    } catch {
      /* keep default */
    }
    setError(message);
    setSigningIn(false);
  };

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-5">
      <div>
        <label
          htmlFor="login-email"
          className="mb-2 block text-sm font-semibold text-ink"
        >
          Email
        </label>
        <input
          id="login-email"
          name="email"
          type="email"
          required
          autoComplete="email"
          placeholder="alex@yourcompany.com"
          className={inputClass}
        />
      </div>

      <div>
        <div className="mb-2 flex items-center justify-between">
          <label
            htmlFor="login-password"
            className="block text-sm font-semibold text-ink"
          >
            Password
          </label>
          <span className="text-sm font-medium text-muted/70">
            Forgot password?
          </span>
        </div>
        <input
          id="login-password"
          name="password"
          type="password"
          required
          autoComplete="current-password"
          placeholder="••••••••••"
          className={inputClass}
        />
      </div>

      {error && (
        <p role="alert" className="rounded-xl bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={signingIn}
        className="group mt-1 inline-flex w-full items-center justify-center gap-1.5 rounded-xl bg-signature px-4 py-3.5 text-[15px] font-semibold text-white shadow-[0_12px_28px_-12px_rgba(182,66,255,0.55)] transition-all duration-200 hover:brightness-[1.06] active:scale-[0.99] disabled:cursor-wait disabled:opacity-80"
      >
        {signingIn ? (
          "Signing in…"
        ) : (
          <>
            Sign in
            <span
              aria-hidden="true"
              className="transition-transform duration-200 group-hover:translate-x-0.5"
            >
              →
            </span>
          </>
        )}
      </button>

      <p className="text-center text-xs text-muted">
        Demo account: <span className="font-semibold text-ink/70">alex@zelio.ai</span>
        {" / "}
        <span className="font-semibold text-ink/70">zelio123</span>
      </p>
    </form>
  );
}
