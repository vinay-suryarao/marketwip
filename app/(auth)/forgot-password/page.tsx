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
    <main className="relative mx-auto flex w-full max-w-[1200px] flex-1 items-center justify-center px-4 py-10 min-h-[70vh] sm:px-6 sm:py-20 sm:min-h-[80vh]">
      <div className="absolute top-[20%] left-[-5%] w-[400px] h-[400px] bg-[#00F0FF] rounded-full mix-blend-screen filter blur-[150px] opacity-20 pointer-events-none z-0 animate-pulse-slow"></div>
      <div
        className="absolute bottom-[20%] right-[-5%] w-[400px] h-[400px] bg-[#34E0A1] rounded-full mix-blend-screen filter blur-[150px] opacity-20 pointer-events-none z-0"
        style={{ animationDelay: "2s" }}
      ></div>

      <section className="relative z-10 grid w-full max-w-5xl rounded-2xl border border-[#1A2552] bg-[#0A102E]/80 p-3 shadow-[0_30px_60px_rgba(0,0,0,0.5)] backdrop-blur-2xl sm:rounded-[2.5rem] sm:p-4 md:grid-cols-2">
        <aside className="hidden min-h-[400px] flex-col justify-center rounded-[2rem] bg-gradient-to-br from-[#34E0A1] to-[#4353FF] p-10 text-white shadow-[0_0_30px_rgba(52,224,161,0.3)] md:flex">
          <p className="text-xs font-bold uppercase tracking-[0.24em] text-white/80 mix-blend-overlay">Market W.I.P</p>
          <h1 className="mt-4 text-4xl sm:text-5xl border-b border-white/20 pb-6 mb-6 font-extrabold font-display leading-tight drop-shadow-md">
            Forgot Password
          </h1>
          <p className="mt-auto text-lg leading-relaxed text-white/90 font-medium pb-2">
            Enter your registered email and we will send a secure Firebase password reset link.
          </p>
        </aside>

        <form onSubmit={onSubmit} className="flex flex-col justify-center p-5 sm:p-8 lg:px-14">
          <h2 className="mb-1 text-2xl font-extrabold text-white font-display sm:text-3xl">Reset Access</h2>
          <p className="mb-6 text-[14px] font-medium text-[#8B95A5] sm:mb-8 sm:text-[15px]">Use your registered email to continue.</p>

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

          <p className="mt-8 text-[15px] text-[#8B95A5] text-center font-medium">
            Remembered your password?{" "}
            <Link className="font-bold text-[#00F0FF] ml-1 hover:text-white transition-colors" href="/login">
              Back to login
            </Link>
          </p>
        </form>
      </section>

      {prompt ? <PromptToast message={prompt.message} tone={prompt.tone} /> : null}
    </main>
  );
}
