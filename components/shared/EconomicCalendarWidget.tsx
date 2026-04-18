"use client";

import { useEffect, useRef } from "react";

export default function EconomicCalendarWidget() {
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) {
      return;
    }

    container.innerHTML = "";

    const widgetHost = document.createElement("div");
    widgetHost.className = "tradingview-widget-container__widget";

    const script = document.createElement("script");
    script.src = "https://s3.tradingview.com/external-embedding/embed-widget-events.js";
    script.type = "text/javascript";
    script.async = true;
    script.text = JSON.stringify({
      colorTheme: "light",
      isTransparent: true,
      width: "100%",
      height: 640,
      locale: "en",
      importanceFilter: "-1,0,1",
      currencyFilter: "INR,USD,EUR,GBP,JPY",
      countryFilter: "in,us,eu,gb,jp,cn",
    });

    container.appendChild(widgetHost);
    container.appendChild(script);
  }, []);

  return <div ref={containerRef} className="tradingview-widget-container" />;
}
