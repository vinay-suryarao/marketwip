"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

export default function ViewportGuard() {
  const pathname = usePathname();

  useEffect(() => {
    const resetHorizontalOffset = () => {
      // Some mobile browsers can restore stale horizontal scroll positions on reload.
      window.scrollTo({ left: 0, top: window.scrollY, behavior: "auto" });
      document.documentElement.scrollLeft = 0;
      document.body.scrollLeft = 0;
    };

    resetHorizontalOffset();

    const rafId = window.requestAnimationFrame(resetHorizontalOffset);
    window.addEventListener("orientationchange", resetHorizontalOffset);

    return () => {
      window.cancelAnimationFrame(rafId);
      window.removeEventListener("orientationchange", resetHorizontalOffset);
    };
  }, [pathname]);

  return null;
}
