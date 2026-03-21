"use client";

import { PropsWithChildren, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";

export default function AdminGate({ children }: PropsWithChildren) {
  const router = useRouter();
  const { user, isAdmin, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading && !user) {
      router.replace("/login");
      return;
    }

    if (!isLoading && user && !isAdmin) {
      router.replace("/dashboard");
    }
  }, [isAdmin, isLoading, router, user]);

  if (isLoading) {
    return <main className="mx-auto w-full max-w-6xl flex-1 px-6 py-10">Loading admin access...</main>;
  }

  if (!user || !isAdmin) {
    return null;
  }

  return <>{children}</>;
}
