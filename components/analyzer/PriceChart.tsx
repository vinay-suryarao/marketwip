"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import {
  createChart,
  CandlestickSeries,
  HistogramSeries,
  ColorType,
  CrosshairMode,
  type IChartApi,
  type ISeriesApi,
  type CandlestickData,
  type HistogramData,
  type Time,
} from "lightweight-charts";

type Props = {
  symbol: string;
  companyName?: string;
  nseCode?: string;
  bseCode?: string;
};

type ChartRange = "1d" | "5d" | "1mo" | "3mo" | "6mo" | "1y" | "2y" | "5y" | "max";

const RANGE_CONFIG: Record<ChartRange, { label: string; interval: string }> = {
  "1d": { label: "1D", interval: "5m" },
  "5d": { label: "5D", interval: "15m" },
  "1mo": { label: "1M", interval: "1d" },
  "3mo": { label: "3M", interval: "1d" },
  "6mo": { label: "6M", interval: "1d" },
  "1y": { label: "1Y", interval: "1d" },
  "2y": { label: "2Y", interval: "1wk" },
  "5y": { label: "5Y", interval: "1wk" },
  "max": { label: "MAX", interval: "1mo" },
};

type ChartStyle = "candlestick" | "line" | "area";

export default function PriceChart({ symbol, companyName, nseCode, bseCode }: Props) {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<IChartApi | null>(null);
  const candleSeriesRef = useRef<ISeriesApi<"Candlestick"> | null>(null);
  const volumeSeriesRef = useRef<ISeriesApi<"Histogram"> | null>(null);

  const [range, setRange] = useState<ChartRange>("1y");
  const [chartStyle, setChartStyle] = useState<ChartStyle>("candlestick");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [priceInfo, setPriceInfo] = useState<{
    open?: number;
    high?: number;
    low?: number;
    close?: number;
    volume?: number;
    change?: number;
    changePercent?: number;
  } | null>(null);

  // Determine the best symbol for Yahoo Finance
  const chartSymbol = nseCode && nseCode !== "—" ? nseCode : bseCode && bseCode !== "—" ? bseCode : symbol;

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);

    const config = RANGE_CONFIG[range];
    try {
      const res = await fetch(
        `/api/analyzer/chart?symbol=${encodeURIComponent(chartSymbol)}&range=${range}&interval=${config.interval}`
      );

      if (!res.ok) {
        throw new Error(`Failed to load chart data (${res.status})`);
      }

      const json = await res.json();

      if (!json.candles || json.candles.length === 0) {
        throw new Error("No chart data available for this stock");
      }

      return json;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load chart data");
      return null;
    } finally {
      setLoading(false);
    }
  }, [chartSymbol, range]);

  // Create chart on mount
  useEffect(() => {
    const container = chartContainerRef.current;
    if (!container) return;

    const chart = createChart(container, {
      layout: {
        background: { type: ColorType.Solid, color: "#ffffff" },
        textColor: "#6074a0",
        fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
        fontSize: 12,
      },
      grid: {
        vertLines: { color: "#f0f4fb" },
        horzLines: { color: "#f0f4fb" },
      },
      crosshair: {
        mode: CrosshairMode.Normal,
        vertLine: {
          color: "#2e7ac9",
          width: 1,
          style: 3,
          labelBackgroundColor: "#2e7ac9",
        },
        horzLine: {
          color: "#2e7ac9",
          width: 1,
          style: 3,
          labelBackgroundColor: "#2e7ac9",
        },
      },
      rightPriceScale: {
        borderColor: "#e4ecf8",
        scaleMargins: {
          top: 0.05,
          bottom: 0.25,
        },
      },
      timeScale: {
        borderColor: "#e4ecf8",
        timeVisible: range === "1d" || range === "5d",
        secondsVisible: false,
        rightOffset: 5,
        barSpacing: 8,
        fixLeftEdge: true,
        fixRightEdge: true,
      },
      handleScroll: { vertTouchDrag: false },
    });

    chartRef.current = chart;

    // Create candlestick series
    const candleSeries = chart.addSeries(CandlestickSeries, {
      upColor: "#06AA5A",
      downColor: "#FF3B5C",
      borderDownColor: "#FF3B5C",
      borderUpColor: "#06AA5A",
      wickDownColor: "#FF3B5C",
      wickUpColor: "#06AA5A",
    });
    candleSeriesRef.current = candleSeries;

    // Create volume series
    const volumeSeries = chart.addSeries(HistogramSeries, {
      priceFormat: { type: "volume" },
      priceScaleId: "",
    });
    volumeSeries.priceScale().applyOptions({
      scaleMargins: {
        top: 0.8,
        bottom: 0,
      },
    });
    volumeSeriesRef.current = volumeSeries;

    // Subscribe to crosshair move for price info tooltip
    chart.subscribeCrosshairMove((param) => {
      if (!param || !param.time || !param.seriesData) {
        setPriceInfo(null);
        return;
      }

      const candleData = param.seriesData.get(candleSeries) as CandlestickData<Time> | undefined;
      const volumeData = param.seriesData.get(volumeSeries) as HistogramData<Time> | undefined;

      if (candleData) {
        const change = (candleData.close as number) - (candleData.open as number);
        const changePercent = ((change / (candleData.open as number)) * 100);
        setPriceInfo({
          open: candleData.open as number,
          high: candleData.high as number,
          low: candleData.low as number,
          close: candleData.close as number,
          volume: volumeData?.value as number,
          change,
          changePercent,
        });
      }
    });

    // Handle resize
    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width, height } = entry.contentRect;
        chart.applyOptions({ width, height });
      }
    });
    resizeObserver.observe(container);

    return () => {
      resizeObserver.disconnect();
      chart.remove();
      chartRef.current = null;
      candleSeriesRef.current = null;
      volumeSeriesRef.current = null;
    };
  }, []); // only create chart once

  // Fetch data and update series when range changes
  useEffect(() => {
    let cancelled = false;

    (async () => {
      const data = await fetchData();
      if (cancelled || !data) return;

      const candleSeries = candleSeriesRef.current;
      const volumeSeries = volumeSeriesRef.current;
      const chart = chartRef.current;
      if (!candleSeries || !volumeSeries || !chart) return;

      // Update time scale options for intraday
      chart.timeScale().applyOptions({
        timeVisible: range === "1d" || range === "5d",
      });

      // Transform candles to Lightweight Charts format
      const candleData: CandlestickData<Time>[] = data.candles.map((c: any) => ({
        time: c.time as Time,
        open: c.open,
        high: c.high,
        low: c.low,
        close: c.close,
      }));

      const volumeData: HistogramData<Time>[] = data.candles.map((c: any) => ({
        time: c.time as Time,
        value: c.volume,
        color: c.close >= c.open ? "rgba(6, 170, 90, 0.3)" : "rgba(255, 59, 92, 0.3)",
      }));

      candleSeries.setData(candleData);
      volumeSeries.setData(volumeData);

      chart.timeScale().fitContent();

      // Set initial price info from last candle
      if (data.candles.length > 0) {
        const last = data.candles[data.candles.length - 1];
        const change = last.close - last.open;
        const changePercent = (change / last.open) * 100;
        setPriceInfo({
          open: last.open,
          high: last.high,
          low: last.low,
          close: last.close,
          volume: last.volume,
          change,
          changePercent,
        });
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [range, fetchData]);

  const formatPrice = (value?: number) => {
    if (value == null) return "—";
    return `₹${value.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  const formatVolume = (value?: number) => {
    if (value == null) return "—";
    if (value >= 10000000) return `${(value / 10000000).toFixed(2)} Cr`;
    if (value >= 100000) return `${(value / 100000).toFixed(2)} L`;
    if (value >= 1000) return `${(value / 1000).toFixed(1)}K`;
    return value.toLocaleString("en-IN");
  };

  return (
    <section className="overflow-hidden rounded-3xl border border-[#d8e2f5] bg-white shadow-[0_12px_28px_rgba(24,58,120,0.1)]">
      {/* Header */}
      <div className="border-b border-[#d8e2f5] px-5 py-4 sm:px-8">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#5f77a5]">
              Interactive Chart
            </p>
            <h2 className="mt-1 text-xl font-extrabold text-[#173462] sm:text-2xl">
              {companyName || symbol} — Price Chart
            </h2>
          </div>

          {/* OHLC Price Info */}
          {priceInfo && (
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs font-semibold sm:text-sm">
              <span className="text-[#8599c1]">
                O <span className="text-[#173462]">{formatPrice(priceInfo.open)}</span>
              </span>
              <span className="text-[#8599c1]">
                H <span className="text-[#06AA5A]">{formatPrice(priceInfo.high)}</span>
              </span>
              <span className="text-[#8599c1]">
                L <span className="text-[#FF3B5C]">{formatPrice(priceInfo.low)}</span>
              </span>
              <span className="text-[#8599c1]">
                C{" "}
                <span
                  className={
                    priceInfo.change != null && priceInfo.change >= 0
                      ? "text-[#06AA5A]"
                      : "text-[#FF3B5C]"
                  }
                >
                  {formatPrice(priceInfo.close)}
                </span>
              </span>
              {priceInfo.volume != null && (
                <span className="text-[#8599c1]">
                  Vol <span className="text-[#173462]">{formatVolume(priceInfo.volume)}</span>
                </span>
              )}
              {priceInfo.changePercent != null && (
                <span
                  className={`rounded-md px-2 py-0.5 text-xs font-bold ${
                    priceInfo.changePercent >= 0
                      ? "bg-[#e8f8f0] text-[#06AA5A]"
                      : "bg-[#fff0f2] text-[#FF3B5C]"
                  }`}
                >
                  {priceInfo.changePercent >= 0 ? "▲" : "▼"}{" "}
                  {Math.abs(priceInfo.changePercent).toFixed(2)}%
                </span>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Controls Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#eef3fb] px-5 py-2.5 sm:px-8">
        {/* Range Selector */}
        <div className="flex items-center gap-1">
          {(Object.entries(RANGE_CONFIG) as [ChartRange, { label: string }][]).map(
            ([key, { label }]) => (
              <button
                key={key}
                onClick={() => setRange(key)}
                className={`rounded-lg px-2.5 py-1.5 text-xs font-bold transition-all sm:px-3 sm:text-sm ${
                  range === key
                    ? "bg-[#2e7ac9] text-white shadow-[0_2px_8px_rgba(46,122,201,0.3)]"
                    : "text-[#6074a0] hover:bg-[#f1f7ff] hover:text-[#2e7ac9]"
                }`}
              >
                {label}
              </button>
            )
          )}
        </div>

        {/* Chart Style Selector */}
        <div className="flex items-center gap-1 rounded-xl border border-[#e4ecf8] p-0.5">
          <button
            onClick={() => setChartStyle("candlestick")}
            className={`rounded-lg p-1.5 transition-all ${
              chartStyle === "candlestick"
                ? "bg-[#2e7ac9] text-white"
                : "text-[#8599c1] hover:text-[#2e7ac9]"
            }`}
            title="Candlestick"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M9 4v4M9 14v6M15 4v6M15 18v2" />
              <rect x="7" y="8" width="4" height="6" rx="1" fill="currentColor" opacity="0.3" />
              <rect x="13" y="10" width="4" height="8" rx="1" fill="currentColor" opacity="0.3" />
            </svg>
          </button>
          <button
            onClick={() => setChartStyle("line")}
            className={`rounded-lg p-1.5 transition-all ${
              chartStyle === "line"
                ? "bg-[#2e7ac9] text-white"
                : "text-[#8599c1] hover:text-[#2e7ac9]"
            }`}
            title="Line"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M3 17l4-4 4 4 4-8 6 4" />
            </svg>
          </button>
          <button
            onClick={() => setChartStyle("area")}
            className={`rounded-lg p-1.5 transition-all ${
              chartStyle === "area"
                ? "bg-[#2e7ac9] text-white"
                : "text-[#8599c1] hover:text-[#2e7ac9]"
            }`}
            title="Area"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M3 17l4-4 4 4 4-8 6 4v8H3z" fill="currentColor" opacity="0.15" />
              <path d="M3 17l4-4 4 4 4-8 6 4" />
            </svg>
          </button>
        </div>
      </div>

      {/* Chart Area */}
      <div className="relative">
        {/* Loading overlay */}
        {loading && (
          <div className="absolute inset-0 z-10 flex items-center justify-center bg-white/80 backdrop-blur-sm">
            <div className="flex flex-col items-center gap-3">
              <div className="h-10 w-10 animate-spin rounded-full border-4 border-[#e4ecf8] border-t-[#2e7ac9]" />
              <p className="text-sm font-semibold text-[#6074a0]">Loading chart data...</p>
            </div>
          </div>
        )}

        {/* Error overlay */}
        {error && !loading && (
          <div className="absolute inset-0 z-10 flex items-center justify-center bg-white/90">
            <div className="flex flex-col items-center gap-3 px-6 text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#fff0f2]">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#FF3B5C" strokeWidth="2">
                  <circle cx="12" cy="12" r="10" />
                  <path d="M15 9l-6 6M9 9l6 6" />
                </svg>
              </div>
              <p className="text-sm font-bold text-[#d92b4a]">{error}</p>
              <button
                onClick={() => fetchData()}
                className="mt-1 rounded-lg border border-[#cddcf6] bg-white px-4 py-2 text-xs font-bold text-[#2e7ac9] transition hover:bg-[#f1f7ff]"
              >
                Try Again
              </button>
            </div>
          </div>
        )}

        <div
          ref={chartContainerRef}
          className="h-[480px] w-full sm:h-[600px] lg:h-[700px]"
        />
      </div>
    </section>
  );
}
