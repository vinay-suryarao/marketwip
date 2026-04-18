"use client";

import React from "react";
import { useFIIDII } from "@/hooks/useFIIDII";
import { formatDate } from "@/lib/helpers/dateFormat";

function formatValue(value: number) {
  const absValue = Math.abs(value);
  return `${value >= 0 ? "+" : "-"}${absValue.toFixed(2)}`;
}

function getBarWidth(value: number) {
  const absValue = Math.abs(value);
  return Math.min(absValue / 1000, 0.5) * 100;
}

type BidirectionalBarProps = {
  value: number;
  label: string;
};

function BidirectionalBar({ value, label }: BidirectionalBarProps) {
  const isPositive = value >= 0;
  const barWidth = getBarWidth(value);
  const textColor = isPositive ? "text-[#2e9b6e]" : "text-[#c24d62]";
  const barColor = isPositive ? "bg-[#2e9b6e]" : "bg-[#c24d62]";
  const glowColor = isPositive ? "rgba(46,155,110,0.45)" : "rgba(194,77,98,0.45)";

  return (
    <div className="mb-6 flex items-center justify-between gap-3">
      <span className="min-w-fit text-sm font-bold text-[#173462] sm:text-base">{label}</span>

      <div className="relative flex h-3 flex-1 items-center justify-center">
        <div className="absolute left-1/2 top-0 bottom-0 w-0.5 -translate-x-1/2 transform bg-[#c8d7f4]" />

        <div className="relative flex h-full w-full items-center">
          {isPositive ? (
            <div
              className={`${barColor} absolute left-1/2 h-full rounded-r-full`}
              style={{ width: `${barWidth}%`, boxShadow: `0 0 12px ${glowColor}` }}
            />
          ) : (
            <div
              className={`${barColor} absolute right-1/2 h-full rounded-l-full`}
              style={{ width: `${barWidth}%`, boxShadow: `0 0 12px ${glowColor}` }}
            />
          )}
        </div>
      </div>

      <span className={`min-w-fit font-mono text-lg font-extrabold sm:text-xl ${textColor}`}>
        {formatValue(value)}
      </span>
    </div>
  );
}

export default function FIIDIIActivityDisplay() {
  const { data, isLoading } = useFIIDII();

  if (isLoading) {
    return (
      <div className="text-center py-8">
        <div className="inline-block text-[#6074a0] text-sm font-medium">
          Loading FII/DII data...
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="text-center py-8">
        <div className="inline-block text-[#6074a0] text-sm font-medium">
          No FII/DII data available
        </div>
      </div>
    );
  }

  return (
    <div className="bg-linear-to-br from-[#f8fbff] to-[#eef3ff] border border-[#d8e2f5] rounded-2xl p-6 sm:p-8 shadow-[0_10px_24px_rgba(24,58,120,0.1)]">
      {/* Header with date */}
      <div className="mb-8 pb-6 border-b border-[#d8e2f5]">
        <h3 className="text-2xl sm:text-3xl font-extrabold bg-linear-to-r from-[#1a3f89] to-[#2d86cc] bg-clip-text text-transparent">
          FII/DII Cash Market
        </h3>
        <p className="text-xs sm:text-sm text-[#6074a0] mt-2 font-medium">
          📅 {formatDate(new Date(data.date))}
        </p>
      </div>

      {/* FII Row */}
      <BidirectionalBar value={data.fiiCashMarket} label="FII Cash Market*" />

      {/* DII Row */}
      <BidirectionalBar value={data.diiCashMarket} label="DII Cash Market*" />

      {/* Footer note */}
      <div className="pt-4 border-t border-[#d8e2f5]">
        <p className="text-xs text-[#6074a0] font-medium">
          * Market cash flow data. Green (right) indicates positive inflow, Red (left) indicates outflow.
        </p>
      </div>
    </div>
  );
}
