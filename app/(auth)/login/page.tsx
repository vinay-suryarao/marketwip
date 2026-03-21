"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import PromptToast from "@/components/ui/PromptToast";
import { signIn } from "@/lib/firebase/auth";
import { isAdminEmail } from "@/lib/config/appConfig";
import { upsertUserProfile } from "@/lib/services/userService";
import { toFriendlyAuthErrorMessage } from "@/lib/helpers/userFacingError";
import { useTimedPrompt } from "@/hooks/useTimedPrompt";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { prompt, showPrompt, clearPrompt } = useTimedPrompt(4000);

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    clearPrompt();

    try {
      const credential = await signIn(email.trim(), password);
      const role = isAdminEmail(credential.user.email) ? "admin" : "user";

      await upsertUserProfile(credential.user.uid, {
        email: credential.user.email ?? email.trim(),
        role,
      });

      router.replace(role === "admin" ? "/admin/dashboard" : "/dashboard");
    } catch (nextError) {
      showPrompt(toFriendlyAuthErrorMessage(nextError, "Unable to login right now. Please try again."), "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="relative mx-auto flex w-full max-w-[1200px] flex-1 items-center justify-center px-6 py-20 min-h-[80vh]">
      {/* Background Neon Orbs */}
      <div className="absolute top-[20%] left-[-5%] w-[400px] h-[400px] bg-[#00F0FF] rounded-full mix-blend-screen filter blur-[150px] opacity-20 pointer-events-none z-0 animate-pulse-slow"></div>
      <div className="absolute bottom-[20%] right-[-5%] w-[400px] h-[400px] bg-[#C100FF] rounded-full mix-blend-screen filter blur-[150px] opacity-20 pointer-events-none z-0" style={{ animationDelay: '2s' }}></div>

      <section className="relative z-10 grid w-full max-w-5xl rounded-[2.5rem] border border-[#1A2552] bg-[#0A102E]/80 backdrop-blur-2xl p-4 shadow-[0_30px_60px_rgba(0,0,0,0.5)] md:grid-cols-2">
        <aside className="rounded-[2rem] bg-gradient-to-br from-[#00F0FF] to-[#4353FF] p-10 text-white flex flex-col justify-center shadow-[0_0_30px_rgba(0,240,255,0.3)] min-h-[400px]">
          <p className="text-xs font-bold uppercase tracking-[0.24em] text-white/80 mix-blend-overlay">Market W.I.P</p>
          <h1 className="mt-4 text-4xl sm:text-5xl border-b border-white/20 pb-6 mb-6 font-extrabold font-display leading-tight drop-shadow-md">
            Welcome Back
          </h1>
          <p className="mt-auto text-lg leading-relaxed text-white/90 font-medium pb-2">
            Login to unlock your personal tracking dashboard, access live charts, and receive instant market alerts.
          </p>
        </aside>

        <form onSubmit={onSubmit} className="flex flex-col justify-center p-8 lg:px-14">
          <h2 className="text-3xl font-extrabold text-white font-display mb-1">Login</h2>
          <p className="text-[15px] font-medium text-[#8B95A5] mb-8">Access your personalized workspace.</p>

          <div className="space-y-4 mb-8">
            <Input
              type="email"
              placeholder="Email address"
              required
              value={email}
              onChange={(event) => setEmail(event.target.value)}
            />
            <Input
              type="password"
              placeholder="Password"
              required
              value={password}
              onChange={(event) => setPassword(event.target.value)}
            />
            <div className="flex justify-end">
              <Link
                href="/forgot-password"
                className="text-xs font-semibold text-[#00F0FF] transition-colors hover:text-white"
              >
                Forgot password?
              </Link>
            </div>
          </div>

          <Button type="submit" className="w-full py-3.5 text-base" disabled={isSubmitting}>
            {isSubmitting ? "Logging in..." : "Login"}
          </Button>

          <p className="mt-8 text-[15px] text-[#8B95A5] text-center font-medium">
            New user?{" "}
            <Link className="font-bold text-[#00F0FF] ml-1 hover:text-white transition-colors" href="/signup">
              Create account
            </Link>
          </p>
        </form>
      </section>

      {prompt ? <PromptToast message={prompt.message} tone={prompt.tone} /> : null}
    </main>
  );
}
