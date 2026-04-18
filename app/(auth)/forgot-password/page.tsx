"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import PromptToast from "@/components/ui/PromptToast";
import { sendPasswordResetLink } from "@/lib/firebase/auth";
import { useTimedPrompt } from "@/hooks/useTimedPrompt";
import { toFriendlyAuthErrorMessage } from "@/lib/helpers/userFacingError";

function getResetErrorMessage(error: unknown) {
  const code =
    typeof error === "object" && error !== null && "code" in error
      ? String((error as { code?: string }).code)
      : "";

  if (code === "auth/invalid-email") {
    return "Please enter a valid email address.";
  }

  if (code === "auth/user-not-found") {
    return "This email is not registered in our system.";
  }

  if (code === "auth/too-many-requests") {
    return "Too many attempts. Please try again after some time.";
  }

  return toFriendlyAuthErrorMessage(error, "Unable to send reset link right now. Please try again.");
}

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { prompt, showPrompt, clearPrompt } = useTimedPrompt(4000);

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    clearPrompt();

    const normalizedEmail = email.trim().toLowerCase();

    try {
      await sendPasswordResetLink(normalizedEmail);
      showPrompt("Password reset link sent. Check your email inbox.", "success");
      setEmail("");
    } catch (nextError) {
      showPrompt(getResetErrorMessage(nextError), "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="relative mx-auto flex w-full max-w-300 flex-1 items-center justify-center px-4 py-10 min-h-[70vh] sm:px-6 sm:py-20 sm:min-h-[80vh]">
      <div className="pointer-events-none absolute left-[-5%] top-[15%] z-0 h-87.5 w-87.5 rounded-full bg-[#8bb5ff]/24 blur-[125px]" />
      <div className="pointer-events-none absolute bottom-[8%] right-[-5%] z-0 h-75 w-75 rounded-full bg-[#95ddff]/24 blur-[120px]" />

      <section className="relative z-10 grid w-full max-w-5xl rounded-2xl border border-[#d8e2f5] bg-white p-3 shadow-[0_16px_34px_rgba(24,58,120,0.14)] sm:rounded-[2.5rem] sm:p-4 md:grid-cols-2">
        <aside className="hidden min-h-100 flex-col justify-center rounded-4xl border border-[#d5e0f5] bg-linear-to-br from-[#f6f9ff] to-[#edf3ff] p-10 text-[#173462] md:flex">
          <p className="text-xs font-bold uppercase tracking-[0.24em] text-[#3d74d7]">Market W.I.P</p>
          <h1 className="mt-4 text-4xl sm:text-5xl border-b border-white/20 pb-6 mb-6 font-extrabold font-display leading-tight drop-shadow-md">
            Forgot Password
          </h1>
          <p className="mt-auto pb-2 text-lg font-medium leading-relaxed text-[#526894]">
            Enter your registered email and we will send a secure Firebase password reset link.
          </p>
        </aside>

        <form onSubmit={onSubmit} className="flex flex-col justify-center p-5 sm:p-8 lg:px-14">
          <h2 className="mb-1 text-2xl font-extrabold text-[#173462] font-display sm:text-3xl">Reset Access</h2>
          <p className="mb-6 text-[14px] font-medium text-[#6074a0] sm:mb-8 sm:text-[15px]">Use your registered email to continue.</p>

          <div className="space-y-4 mb-8">
            <Input
              type="email"
              placeholder="Registered email"
              required
              value={email}
              onChange={(event) => setEmail(event.target.value)}
            />
          </div>

          <Button type="submit" className="w-full py-3.5 text-base" disabled={isSubmitting}>
            {isSubmitting ? "Sending link..." : "Send reset link"}
          </Button>

          <p className="mt-8 text-center text-[15px] font-medium text-[#6074a0]">
            Remembered your password?{" "}
            <Link className="ml-1 font-bold text-[#2e7ac9] transition-colors hover:text-[#173462]" href="/login">
              Back to login
            </Link>
          </p>
        </form>
      </section>

      {prompt ? <PromptToast message={prompt.message} tone={prompt.tone} /> : null}
    </main>
  );
}
