import type { Metadata } from "next";
import { Suspense } from "react";
import ZelioLogo from "@/components/ZelioLogo";
import LoginForm from "./LoginForm";

export const metadata: Metadata = {
  title: "Sign in — ZELIO",
  description: "Sign in to your company.",
};

export default function LoginPage() {
  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-mist px-4 py-12">
      {/* Subtle ambient color */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-40 -top-40 h-[480px] w-[480px] rounded-full bg-electric-violet/10 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-48 -right-32 h-[520px] w-[520px] rounded-full bg-hot-pink/10 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-1/3 h-[380px] w-[380px] -translate-x-1/2 rounded-full bg-aqua/10 blur-3xl"
      />

      <div className="relative w-full max-w-md">
        <div className="rounded-3xl border border-ink/[0.07] bg-white p-8 shadow-[0_24px_60px_-24px_rgba(17,18,26,0.18)] sm:p-10">
          <div className="flex justify-center">
            <ZelioLogo markClassName="h-9 w-9" wordmarkClassName="text-2xl font-extrabold tracking-tight text-ink" />
          </div>

          <h1 className="mt-8 text-center text-[28px] font-bold tracking-tight text-ink">
            Welcome back
          </h1>
          <p className="mt-2 text-center text-[15px] text-muted">
            Sign in to your company.
          </p>

          <div className="mt-8">
            <Suspense>
              <LoginForm />
            </Suspense>
          </div>

          <div className="mt-8 flex items-center gap-4">
            <span aria-hidden="true" className="h-px flex-1 bg-ink/[0.08]" />
            <span className="text-xs font-medium uppercase tracking-wider text-muted">
              or
            </span>
            <span aria-hidden="true" className="h-px flex-1 bg-ink/[0.08]" />
          </div>

          <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
            <button
              type="button"
              className="inline-flex items-center justify-center gap-2.5 rounded-xl border border-ink/10 bg-white px-4 py-3 text-sm font-semibold text-ink transition-all duration-150 hover:border-ink/20 hover:bg-mist active:scale-[0.98]"
            >
              <svg viewBox="0 0 24 24" className="h-[18px] w-[18px]" aria-hidden="true">
                <path
                  fill="#4285F4"
                  d="M23.5 12.3c0-.9-.1-1.5-.3-2.3H12v4.5h6.5c-.1 1.1-.8 2.7-2.4 3.8l-.1.1 3.5 2.7.2.1c2.2-2 3.6-5 3.6-8.9z"
                />
                <path
                  fill="#34A853"
                  d="M12 24c3.2 0 5.9-1.1 7.9-2.9l-3.8-2.9c-1 .7-2.4 1.2-4.1 1.2-3.1 0-5.8-2.1-6.8-5l-.1.1-3.6 2.8v.1C3.5 21.3 7.5 24 12 24z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.2 14.4c-.2-.7-.4-1.5-.4-2.4s.1-1.7.4-2.4l-.1-.2-3.5-2.7-.1.1C.6 8.3 0 10 0 12s.6 3.7 1.5 5.3l3.7-2.9z"
                />
                <path
                  fill="#EA4335"
                  d="M12 4.7c1.8 0 3 .8 3.7 1.4l3.3-3.2C17.9 1.1 15.2 0 12 0 7.5 0 3.5 2.7 1.5 6.7l3.7 2.9c1-2.9 3.6-4.9 6.8-4.9z"
                />
              </svg>
              Google
            </button>
            <button
              type="button"
              className="inline-flex items-center justify-center gap-2.5 rounded-xl border border-ink/10 bg-white px-4 py-3 text-sm font-semibold text-ink transition-all duration-150 hover:border-ink/20 hover:bg-mist active:scale-[0.98]"
            >
              <svg viewBox="0 0 24 24" className="h-[18px] w-[18px] fill-ink" aria-hidden="true">
                <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
              </svg>
              GitHub
            </button>
          </div>
        </div>

        <p className="mt-6 text-center text-sm text-muted">
          New to ZELIO?{" "}
          <a href="/register" className="link-underline font-semibold text-ink">
            Create your company →
          </a>
        </p>
      </div>
    </main>
  );
}
