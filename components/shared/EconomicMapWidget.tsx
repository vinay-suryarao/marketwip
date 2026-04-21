"use client";

import { useEffect, useRef } from "react";

const ECONOMIC_MAP_SCRIPT_ID = "tradingview-economic-map-script";
const ECONOMIC_MAP_SCRIPT_SRC = "https://widgets.tradingview-widget.com/w/en/tv-economic-map.js";

export default function EconomicMapWidget() {
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) {
      return;
    }

    container.innerHTML = "";

    let isUnmounted = false;

    const mountEconomicMap = () => {
      if (isUnmounted) {
        return;
      }

      container.innerHTML = "";

      const widgetElement = document.createElement("tv-economic-map");
      widgetElement.setAttribute("region", "global");
      widgetElement.setAttribute("metric", "gdp");
      widgetElement.setAttribute("locale", "en");
      widgetElement.style.display = "block";
      widgetElement.style.width = "100%";
      widgetElement.style.height = "100%";

      // Match TradingView scale with our blue brand palette.
      widgetElement.style.setProperty("--tv-widget-scale-fill-one", "#ebf4ff");
      widgetElement.style.setProperty("--tv-widget-scale-fill-two", "#d8e8ff");
      widgetElement.style.setProperty("--tv-widget-scale-fill-three", "#bad6ff");
      widgetElement.style.setProperty("--tv-widget-scale-fill-four", "#7fb2eb");
      widgetElement.style.setProperty("--tv-widget-scale-fill-five", "#4f8fd6");
      widgetElement.style.setProperty("--tv-widget-scale-fill-six", "#2d72c0");

      container.appendChild(widgetElement);
    };

    const existingScript = document.getElementById(ECONOMIC_MAP_SCRIPT_ID) as HTMLScriptElement | null;
    const script = existingScript ?? document.createElement("script");
    script.id = ECONOMIC_MAP_SCRIPT_ID;
    script.src = ECONOMIC_MAP_SCRIPT_SRC;
    script.type = "module";

    if (!existingScript) {
      document.head.appendChild(script);
    }

    customElements
      .whenDefined("tv-economic-map")
      .then(() => mountEconomicMap())
      .catch(() => {
        // Ignore script failures and keep the section shell rendered.
      });

    return () => {
      isUnmounted = true;
      container.innerHTML = "";
    };
  }, []);

  return <div ref={containerRef} className="tradingview-widget-container h-120 w-full" />;
}
