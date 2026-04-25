"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

export default function ViewportGuard() {
  const pathname = usePathname();

  useEffect(() => {
    const isHomeRoute = pathname === "/";

    const resetViewportOffset = () => {
      // Some mobile browsers can restore stale horizontal and vertical scroll positions on reload.
      window.scrollTo({ left: 0, top: isHomeRoute ? 0 : window.scrollY, behavior: "auto" });
      document.documentElement.scrollLeft = 0;
      document.body.scrollLeft = 0;
      if (document.scrollingElement) {
        document.scrollingElement.scrollLeft = 0;
      }

      if (isHomeRoute) {
        document.documentElement.scrollTop = 0;
        document.body.scrollTop = 0;
        if (document.scrollingElement) {
          document.scrollingElement.scrollTop = 0;
        }
      }
    };

    resetViewportOffset();

    const rafId = window.requestAnimationFrame(resetViewportOffset);
    const timeoutId = window.setTimeout(resetViewportOffset, 120);
    const timeoutId2 = window.setTimeout(resetViewportOffset, 420);

    const onPageShow = () => resetViewportOffset();
    const onResize = () => resetViewportOffset();

    window.addEventListener("pageshow", onPageShow);
    window.addEventListener("resize", onResize);
    window.addEventListener("orientationchange", resetViewportOffset);

    return () => {
      window.cancelAnimationFrame(rafId);
      window.clearTimeout(timeoutId);
      window.clearTimeout(timeoutId2);
      window.removeEventListener("pageshow", onPageShow);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("orientationchange", resetViewportOffset);
    };
  }, [pathname]);

  return null;
}
