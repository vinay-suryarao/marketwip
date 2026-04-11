"use client";

import React from "react";
import { useFIIDII } from "@/hooks/useFIIDII";
import { formatDate } from "@/lib/helpers/dateFormat";

export default function FIIDIIActivityDisplay() {
  const { data, isLoading } = useFIIDII();

  if (isLoading) {
    return (
      <div className="text-center py-8">
        <div className="inline-block text-[#8B95A5] text-sm font-medium">
          Loading FII/DII data...
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="text-center py-8">
        <div className="inline-block text-[#8B95A5] text-sm font-medium">
          No FII/DII data available
        </div>
      </div>
    );
  }

  const fiiPositive = data.fiiCashMarket >= 0;
  const diiPositive = data.diiCashMarket >= 0;

  const formatValue = (value: number) => {
    const absValue = Math.abs(value);
    return `${value >= 0 ? "+" : "-"}${absValue.toFixed(2)}`;
  };

  const getFiiTextColor = () => {
    return fiiPositive ? "text-[#34E0A1]" : "text-[#FF5B79]";
  };

  const getDiiTextColor = () => {
    return diiPositive ? "text-[#34E0A1]" : "text-[#FF5B79]";
  };

  // Calculate percentage for bar width (max 50% each side)
  const getBarWidth = (value: number) => {
    const absValue = Math.abs(value);
    return Math.min(absValue / 1000, 0.5) * 100; // 0-50%
  };

  const BidirectionalBar = ({ value, label }: { value: number; label: string }) => {
    const isPositive = value >= 0;
    const barWidth = getBarWidth(value);
    const textColor = isPositive ? "text-[#34E0A1]" : "text-[#FF5B79]";
    const barColor = isPositive ? "bg-[#34E0A1]" : "bg-[#FF5B79]";
    const glowColor = isPositive ? "rgba(52,224,161,0.6)" : "rgba(255,91,121,0.6)";

    return (
      <div className="flex items-center justify-between gap-3 mb-6">
        <span className="text-sm sm:text-base font-bold text-white min-w-fit">
          {label}
        </span>

        {/* Bidirectional Bar */}
        <div className="flex items-center justify-center flex-1 h-3 relative">
          {/* Center line */}
          <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-[#1A2552] transform -translate-x-1/2" />

          {/* Bar container */}
          <div className="w-full relative h-full flex items-center">
            {isPositive ? (
              // Green bar extends right
              <div
                className={`${barColor} rounded-r-full h-full absolute left-1/2 shadow-[0_0_12px_${glowColor}]`}
                style={{
                  width: `${barWidth}%`,
                }}
              />
            ) : (
              // Red bar extends left
              <div
                className={`${barColor} rounded-l-full h-full absolute right-1/2 shadow-[0_0_12px_${glowColor}]`}
                style={{
                  width: `${barWidth}%`,
                }}
              />
            )}
          </div>
        </div>

        <span className={`text-lg sm:text-xl font-extrabold font-mono min-w-fit ${textColor}`}>
          {formatValue(value)}
        </span>
      </div>
    );
  };

  return (
    <div className="bg-gradient-to-br from-[#0A102E]/80 to-[#060B19] border border-[#1A2552] rounded-2xl p-6 sm:p-8 backdrop-blur-xl shadow-[0_8px_32px_rgba(0,0,0,0.3)]">
      {/* Header with date */}
      <div className="mb-8 pb-6 border-b border-[#1A2552]">
        <h3 className="text-2xl sm:text-3xl font-extrabold bg-gradient-to-r from-[#00F0FF] to-[#8B22FF] bg-clip-text text-transparent">
          FII/DII Cash Market
        </h3>
        <p className="text-xs sm:text-sm text-[#8B95A5] mt-2 font-medium">
          📅 {formatDate(new Date(data.date))}
        </p>
      </div>

      {/* FII Row */}
      <BidirectionalBar value={data.fiiCashMarket} label="FII Cash Market*" />

      {/* DII Row */}
      <BidirectionalBar value={data.diiCashMarket} label="DII Cash Market*" />

      {/* Footer note */}
      <div className="pt-4 border-t border-[#1A2552]/50">
        <p className="text-xs text-[#8B95A5] font-medium">
          * Market cash flow data. Green (right) indicates positive inflow, Red (left) indicates outflow.
        </p>
      </div>
    </div>
  );
}
