"use client";

import { getNumberColor } from "../lib/constants";

interface RouletteWheelProps {
  isSpinning: boolean;
  result: number | null;
}

export function RouletteWheel({ isSpinning, result }: RouletteWheelProps) {
  const resultColor = result !== null ? getNumberColor(result) : null;

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
            #22c55e 0deg 9.73deg,
            #dc2626 9.73deg 19.46deg,
            #1f2937 19.46deg 29.19deg,
            #dc2626 29.19deg 38.92deg,
            #1f2937 38.92deg 48.65deg,
            #dc2626 48.65deg 58.38deg,
            #1f2937 58.38deg 68.11deg,
            #dc2626 68.11deg 77.84deg,
            #1f2937 77.84deg 87.57deg,
            #dc2626 87.57deg 97.3deg,
            #1f2937 97.3deg 107.03deg,
            #dc2626 107.03deg 116.76deg,
            #1f2937 116.76deg 126.49deg,
            #dc2626 126.49deg 136.22deg,
            #1f2937 136.22deg 145.95deg,
            #dc2626 145.95deg 155.68deg,
            #1f2937 155.68deg 165.41deg,
            #dc2626 165.41deg 175.14deg,
            #1f2937 175.14deg 184.87deg,
            #dc2626 184.87deg 194.6deg,
            #1f2937 194.6deg 204.33deg,
            #dc2626 204.33deg 214.06deg,
            #1f2937 214.06deg 223.79deg,
            #dc2626 223.79deg 233.52deg,
            #1f2937 233.52deg 243.25deg,
            #dc2626 243.25deg 252.98deg,
            #1f2937 252.98deg 262.71deg,
            #dc2626 262.71deg 272.44deg,
            #1f2937 272.44deg 282.17deg,
            #dc2626 282.17deg 291.9deg,
            #1f2937 291.9deg 301.63deg,
            #dc2626 301.63deg 311.36deg,
            #1f2937 311.36deg 321.09deg,
            #dc2626 321.09deg 330.82deg,
            #1f2937 330.82deg 340.55deg,
            #dc2626 340.55deg 350.28deg,
            #1f2937 350.28deg 360deg
          )`,
          animationDuration: "0.5s",
        }}
      >
        {/* Center */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-yellow-400 to-yellow-600 shadow-inner flex items-center justify-center">
            <span className="text-2xl">🎰</span>
          </div>
        </div>
      </div>

      {/* Pointer */}
      <div className="absolute -top-2 left-1/2 transform -translate-x-1/2">
        <div className="w-0 h-0 border-l-[12px] border-r-[12px] border-t-[20px] border-l-transparent border-r-transparent border-t-yellow-400 drop-shadow-lg"></div>
      </div>

      {/* Result Display */}
      {result !== null && !isSpinning && (
        <div className="mt-8 text-center">
          <p className="text-gray-400 text-sm mb-2">Result</p>
          <div
            className={`w-20 h-20 rounded-full flex items-center justify-center text-3xl font-bold text-white shadow-2xl ${
              resultColor === "red"
                ? "bg-red-600"
                : resultColor === "black"
                ? "bg-gray-800"
                : "bg-green-600"
            }`}
          >
            {result}
          </div>
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
