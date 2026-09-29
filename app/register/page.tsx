import type { Metadata } from "next";
import ZelioLogo from "@/components/ZelioLogo";
import RegisterForm from "./RegisterForm";

export const metadata: Metadata = {
  title: "Create your company — ZELIO",
  description: "Start your company with ZELIO.",
};

export default function RegisterPage() {
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
            Create your company
          </h1>
          <p className="mt-2 text-center text-[15px] text-muted">
            One founder. An entire AI company.
          </p>

          <div className="mt-8">
            <RegisterForm />
          </div>
        </div>

        <p className="mt-6 text-center text-sm text-muted">
          Already building with ZELIO?{" "}
          <a href="/login" className="link-underline font-semibold text-ink">
            Sign in →
          </a>
        </p>
      </div>
    </main>
  );
}
