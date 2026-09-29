"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const inputClass =
  "w-full rounded-xl border border-ink/10 bg-white px-4 py-3 text-[15px] text-ink placeholder:text-muted/70 outline-none transition-all duration-150 focus:border-electric-violet focus:ring-4 focus:ring-electric-violet/15";

export default function RegisterForm() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [working, setWorking] = useState(false);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (working) return;
    setError(null);
    setWorking(true);

    const form = new FormData(e.currentTarget);
    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: form.get("name"),
        email: form.get("email"),
        password: form.get("password"),
      }),
    });

    if (res.ok) {
      router.push("/dashboard");
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
    setWorking(false);
  };

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-5" noValidate={false}>
      <div>
        <label htmlFor="register-name" className="mb-2 block text-sm font-semibold text-ink">
          Your name
        </label>
        <input
          id="register-name"
          name="name"
          type="text"
          required
          autoComplete="name"
          placeholder="Alex"
          className={inputClass}
        />
      </div>

      <div>
        <label htmlFor="register-email" className="mb-2 block text-sm font-semibold text-ink">
          Email
        </label>
        <input
          id="register-email"
          name="email"
          type="email"
          required
          autoComplete="email"
          placeholder="alex@yourcompany.com"
          className={inputClass}
        />
      </div>

      <div>
        <label htmlFor="register-password" className="mb-2 block text-sm font-semibold text-ink">
          Password
        </label>
        <input
          id="register-password"
          name="password"
          type="password"
          required
          minLength={8}
          autoComplete="new-password"
          placeholder="At least 8 characters"
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
        disabled={working}
        className="group mt-1 inline-flex w-full items-center justify-center gap-1.5 rounded-xl bg-signature px-4 py-3.5 text-[15px] font-semibold text-white shadow-[0_12px_28px_-12px_rgba(182,66,255,0.55)] transition-all duration-200 hover:brightness-[1.06] active:scale-[0.99] disabled:cursor-wait disabled:opacity-80"
      >
        {working ? (
          "Creating your company…"
        ) : (
          <>
            Build my company
            <span aria-hidden="true" className="transition-transform duration-200 group-hover:translate-x-0.5">
              →
            </span>
          </>
        )}
      </button>
    </form>
  );
}
