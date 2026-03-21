"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import PromptToast from "@/components/ui/PromptToast";
import { signUp } from "@/lib/firebase/auth";
import { isAdminEmail } from "@/lib/config/appConfig";
import { upsertUserProfile } from "@/lib/services/userService";
import { toFriendlyAuthErrorMessage } from "@/lib/helpers/userFacingError";
import { useTimedPrompt } from "@/hooks/useTimedPrompt";

export default function SignupPage() {
  const router = useRouter();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { prompt, showPrompt, clearPrompt } = useTimedPrompt(4000);

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    clearPrompt();

    try {
      const credential = await signUp(email.trim(), password);
      const role = isAdminEmail(credential.user.email) ? "admin" : "user";

      await upsertUserProfile(credential.user.uid, {
        email: credential.user.email ?? email.trim(),
        displayName: fullName.trim(),
        role,
      });

      router.replace(role === "admin" ? "/admin/dashboard" : "/dashboard");
    } catch (nextError) {
      showPrompt(toFriendlyAuthErrorMessage(nextError, "Unable to create account right now. Please try again."), "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="relative mx-auto flex w-full max-w-[1200px] flex-1 items-center justify-center px-4 py-10 min-h-[70vh] sm:px-6 sm:py-20 sm:min-h-[80vh]">
      {/* Background Neon Orbs */}
      <div className="absolute top-[30%] left-[-10%] w-[450px] h-[450px] bg-[#C100FF] rounded-full mix-blend-screen filter blur-[150px] opacity-20 pointer-events-none z-0 animate-pulse-slow"></div>
      <div className="absolute bottom-[-10%] right-[0%] w-[500px] h-[500px] bg-[#34E0A1] rounded-full mix-blend-screen filter blur-[150px] opacity-15 pointer-events-none z-0" style={{ animationDelay: '3s' }}></div>

      <section className="relative z-10 grid w-full max-w-5xl rounded-2xl border border-[#1A2552] bg-[#0A102E]/80 p-3 shadow-[0_30px_60px_rgba(0,0,0,0.5)] backdrop-blur-2xl sm:rounded-[2.5rem] sm:p-4 md:grid-cols-2">
        <aside className="hidden flex-col justify-center rounded-[2rem] bg-gradient-to-br from-[#C100FF] to-[#4353FF] p-10 text-white shadow-[0_0_30px_rgba(193,0,255,0.3)] md:flex">
          <p className="text-xs font-bold uppercase tracking-[0.24em] text-white/80 mix-blend-overlay">Market W.I.P</p>
          <h1 className="mt-4 text-4xl sm:text-5xl border-b border-white/20 pb-6 mb-6 font-extrabold font-display leading-tight drop-shadow-md">
            Start Your Journey
          </h1>
          <p className="mt-auto text-lg leading-relaxed text-white/90 font-medium">
            Join the platform to automatically filter noise, monitor custom watchlists, and gain the ultimate investor edge.
          </p>
        </aside>

        <form onSubmit={onSubmit} className="flex flex-col justify-center p-5 sm:p-8 lg:px-14">
          <h2 className="mb-1 text-2xl font-extrabold font-display text-white sm:text-3xl">Register</h2>
          <p className="mb-6 text-[14px] font-medium text-[#8B95A5] sm:mb-8 sm:text-[15px]">Setup your account in seconds.</p>

          <div className="space-y-4 mb-8">
            <Input
              type="text"
              placeholder="Full name"
              required
              value={fullName}
              onChange={(event) => setFullName(event.target.value)}
            />
            <Input
              type="email"
              placeholder="Email address"
              required
              value={email}
              onChange={(event) => setEmail(event.target.value)}
            />
            <Input
              type="password"
              placeholder="Create password"
              required
              value={password}
              onChange={(event) => setPassword(event.target.value)}
            />
          </div>

          <Button type="submit" className="w-full py-3.5 text-base" disabled={isSubmitting}>
            {isSubmitting ? "Registering..." : "Register"}
          </Button>

          <p className="mt-8 text-center text-[15px] font-medium text-[#8B95A5]">
            Already registered?{" "}
            <Link href="/login" className="font-bold text-[#C100FF] hover:text-[#00F0FF] transition-colors hover:underline">
              Login
            </Link>
          </p>
        </form>
      </section>

      {prompt ? <PromptToast message={prompt.message} tone={prompt.tone} /> : null}
    </main>
  );
}
