"use client";

import { useEffect, useMemo, useState } from "react";

type TickerItem = {
  symbol: string;
  price: string;
  changePercent: string;
  isUp: boolean;
};

export default function LiveMarketTicker() {
  const [items, setItems] = useState<TickerItem[]>([]);
  const [lastUpdated, setLastUpdated] = useState<string>("--:--:--");

  useEffect(() => {
    let isMounted = true;

    const loadTicker = async () => {
      try {
        const response = await fetch(`/api/market-ticker?t=${Date.now()}`, {
          cache: "no-store",
          headers: {
            "Cache-Control": "no-cache",
          },
        });
        if (!response.ok) {
          return;
        }
        const data = (await response.json()) as { items: TickerItem[]; serverTime?: string };
        if (isMounted && Array.isArray(data.items) && data.items.length > 0) {
          setItems(data.items);
          const time = data.serverTime ? new Date(data.serverTime) : new Date();
          setLastUpdated(time.toLocaleTimeString("en-IN", { hour12: false }));
        }
      } catch {
        // Keep previous values if one polling call fails.
      }
    };

    loadTicker();
    const intervalId = window.setInterval(loadTicker, 5000);

    return () => {
      isMounted = false;
      window.clearInterval(intervalId);
    };
  }, []);

  const renderedItems = useMemo(() => {
    if (items.length === 0) {
      return [
        { symbol: "NIFTY", price: "--", changePercent: "--", isUp: true },
        { symbol: "SENSEX", price: "--", changePercent: "--", isUp: true },
        { symbol: "BANK NIFTY", price: "--", changePercent: "--", isUp: true },
      ];
    }
    return items;
  }, [items]);

  const denseItems = useMemo(
    () => Array.from({ length: 12 }).flatMap(() => renderedItems),
    [renderedItems],
  );

  return (
    <div className="ticker-marquee" aria-label="Live market ticker">
      <div className="ticker-track ticker-track-loop">
        {[0, 1].map((segmentIndex) => (
          <div key={segmentIndex} className="ticker-segment">
            {denseItems.map((item, itemIndex) => (
              <span key={`${segmentIndex}-${item.symbol}-${itemIndex}`} className="inline-flex items-center gap-0.5">
                <span className="font-semibold text-[#8fd9ff]">{item.symbol}</span>
                <span className="text-[#dce8ff]">{item.price}</span>
                <span className={item.isUp ? "text-[#7be0a6]" : "text-[#ff8da1]"}>{item.changePercent}</span>
              </span>
            ))}
          </div>
        ))}
      </div>
      <span className="sr-only">Last updated {lastUpdated}</span>
    </div>
  );
}
