"use client";

import { getNumberColor } from "../lib/constants";

interface RouletteWheelProps {
  isSpinning: boolean;
  multiplier: number | null;
}

export function RouletteWheel({ isSpinning, multiplier }: RouletteWheelProps) {
  // Get color based on multiplier
  const getMultiplierColor = (mult: number) => {
    if (mult === 0) return "bg-gray-700";
    if (mult < 1) return "bg-orange-600";
    if (mult === 1) return "bg-yellow-600";
    if (mult <= 2) return "bg-green-600";
    if (mult <= 5) return "bg-blue-600";
    if (mult <= 10) return "bg-purple-600";
    return "bg-gradient-to-r from-yellow-400 via-pink-500 to-purple-600"; // Jackpot
  };

  return (
    <div className="relative flex flex-col items-center">
      {/* Wheel */}
      <div
        className={`relative w-64 h-64 rounded-full border-8 border-yellow-500 shadow-2xl ${
          isSpinning ? "animate-spin" : ""
        }`}
        style={{
          background: `conic-gradient(
            from 0deg,
            #374151 0deg 90deg,
            #f97316 90deg 216deg,
            #eab308 216deg 306deg,
            #22c55e 306deg 342deg,
            #3b82f6 342deg 354.6deg,
            #8b5cf6 354.6deg 359.82deg,
            #ec4899 359.82deg 360deg
          )`,
          animationDuration: "0.3s",
        }}
      >
        {/* Center */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-24 h-24 rounded-full bg-gradient-to-br from-yellow-400 to-yellow-600 shadow-inner flex items-center justify-center">
            <span className="text-3xl">🎰</span>
          </div>
        </div>
      </div>

      {/* Pointer */}
      <div className="absolute -top-2 left-1/2 transform -translate-x-1/2">
        <div className="w-0 h-0 border-l-[12px] border-r-[12px] border-t-[20px] border-l-transparent border-r-transparent border-t-yellow-400 drop-shadow-lg"></div>
      </div>

      {/* Result Display */}
      {multiplier !== null && !isSpinning && (
        <div className="mt-8 text-center">
          <p className="text-gray-400 text-sm mb-2">Multiplier</p>
          <div
            className={`w-24 h-24 rounded-full flex items-center justify-center text-2xl font-bold text-white shadow-2xl ${getMultiplierColor(multiplier)}`}
          >
            {multiplier === 100 ? "🎉" : ""}{multiplier}x
          </div>
          {multiplier === 100 && (
            <p className="mt-2 text-2xl font-bold text-pink-500 animate-pulse">
              JACKPOT!
            </p>
          )}
        </div>
      )}

      {/* Spinning Text */}
      {isSpinning && (
        <div className="mt-8 text-center">
          <p className="text-2xl font-bold text-yellow-400 animate-pulse">
            Spinning...
          </p>
        </div>
      )}
    </div>
  );
}
