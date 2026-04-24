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
      if (document.scrollingElement) {
        document.scrollingElement.scrollLeft = 0;
      }
    };

    resetHorizontalOffset();

    const rafId = window.requestAnimationFrame(resetHorizontalOffset);
    const timeoutId = window.setTimeout(resetHorizontalOffset, 120);
    const timeoutId2 = window.setTimeout(resetHorizontalOffset, 420);

    const onPageShow = () => resetHorizontalOffset();
    const onResize = () => resetHorizontalOffset();

    window.addEventListener("pageshow", onPageShow);
    window.addEventListener("resize", onResize);
    window.addEventListener("orientationchange", resetHorizontalOffset);

    return () => {
      window.cancelAnimationFrame(rafId);
      window.clearTimeout(timeoutId);
      window.clearTimeout(timeoutId2);
      window.removeEventListener("pageshow", onPageShow);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("orientationchange", resetHorizontalOffset);
    };
  }, [pathname]);

  return null;
}
