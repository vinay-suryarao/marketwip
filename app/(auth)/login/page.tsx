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
    <main className="relative mx-auto flex w-full max-w-300 flex-1 items-center justify-center px-4 py-10 min-h-[70vh] sm:px-6 sm:py-20 sm:min-h-[80vh]">
      <div className="pointer-events-none absolute left-[-4%] top-[8%] z-0 h-90 w-90 rounded-full bg-[#8bb5ff]/24 blur-[120px]" />
      <div className="pointer-events-none absolute bottom-[6%] right-[-4%] z-0 h-80 w-80 rounded-full bg-[#95ddff]/24 blur-[120px]" />

      <section className="relative z-10 grid w-full max-w-5xl rounded-2xl border border-[#d8e2f5] bg-white p-3 shadow-[0_16px_34px_rgba(24,58,120,0.14)] sm:rounded-[2.5rem] sm:p-4 md:grid-cols-2">
        <aside className="hidden min-h-100 flex-col justify-center rounded-4xl border border-[#d5e0f5] bg-linear-to-br from-[#f6f9ff] to-[#edf3ff] p-10 text-[#173462] md:flex">
          <p className="text-xs font-bold uppercase tracking-[0.24em] text-[#3d74d7]">Market W.I.P</p>
          <h1 className="mt-4 text-4xl sm:text-5xl border-b border-white/20 pb-6 mb-6 font-extrabold font-display leading-tight drop-shadow-md">
            Welcome Back
          </h1>
          <p className="mt-auto pb-2 text-lg font-medium leading-relaxed text-[#526894]">
            Login to unlock your personal tracking dashboard, access live charts, and receive instant market alerts.
          </p>
        </aside>

        <form onSubmit={onSubmit} className="flex flex-col justify-center p-5 sm:p-8 lg:px-14">
          <h2 className="mb-1 text-2xl font-extrabold text-[#173462] font-display sm:text-3xl">Login</h2>
          <p className="mb-6 text-[14px] font-medium text-[#6074a0] sm:mb-8 sm:text-[15px]">Access your personalized workspace.</p>

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
                className="text-xs font-semibold text-[#2e7ac9] transition-colors hover:text-[#173462]"
              >
                Forgot password?
              </Link>
            </div>
          </div>

          <Button type="submit" className="w-full py-3.5 text-base" disabled={isSubmitting}>
            {isSubmitting ? "Logging in..." : "Login"}
          </Button>

          <p className="mt-8 text-center text-[15px] font-medium text-[#6074a0]">
            New user?{" "}
            <Link className="ml-1 font-bold text-[#2e7ac9] transition-colors hover:text-[#173462]" href="/signup">
              Create account
            </Link>
          </p>
        </form>
      </section>

      {prompt ? <PromptToast message={prompt.message} tone={prompt.tone} /> : null}
    </main>
  );
}
