"use client";

import { PropsWithChildren, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";

export default function AuthGate({ children }: PropsWithChildren) {
  const router = useRouter();
  const { user, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading && !user) {
      router.replace("/login");
    }
  }, [isLoading, router, user]);

  if (isLoading) {
    return <main className="mx-auto w-full max-w-6xl flex-1 px-6 py-10">Loading account...</main>;
  }

  if (!user) {
    return null;
  }

  return <>{children}</>;
}
