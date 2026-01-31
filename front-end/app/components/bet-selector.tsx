"use client";

import { BET_TYPES, getNumberColor, BetType } from "../lib/constants";

interface BetSelectorProps {
  selectedBet: BetType | null;
  onSelectBet: (bet: BetType) => void;
}

export function BetSelector({ selectedBet, onSelectBet }: BetSelectorProps) {
  const outsideBets = [
    { type: BET_TYPES.RED, label: "RED", color: "bg-red-600 hover:bg-red-700" },
    { type: BET_TYPES.BLACK, label: "BLACK", color: "bg-gray-800 hover:bg-gray-900" },
    { type: BET_TYPES.ODD, label: "ODD", color: "bg-amber-600 hover:bg-amber-700" },
    { type: BET_TYPES.EVEN, label: "EVEN", color: "bg-amber-600 hover:bg-amber-700" },
    { type: BET_TYPES.LOW, label: "1-18", color: "bg-blue-600 hover:bg-blue-700" },
    { type: BET_TYPES.HIGH, label: "19-36", color: "bg-blue-600 hover:bg-blue-700" },
  ];

  return (
    <div className="space-y-6">
      {/* Outside Bets */}
      <div>
        <h3 className="text-lg font-semibold text-gray-300 mb-3">Outside Bets (2x)</h3>
        <div className="grid grid-cols-3 gap-3">
          {outsideBets.map(({ type, label, color }) => (
            <button
              key={type}
              onClick={() => onSelectBet(type)}
              className={`${color} ${
                selectedBet === type
                  ? "ring-4 ring-yellow-400 scale-105"
                  : ""
              } text-white font-bold py-4 px-6 rounded-xl transition-all duration-200 shadow-lg hover:scale-105`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Number Grid */}
      <div>
        <h3 className="text-lg font-semibold text-gray-300 mb-3">Single Numbers (36x)</h3>
        {/* Zero */}
        <div className="mb-3">
          <button
            onClick={() => onSelectBet(0)}
            className={`w-full bg-green-600 hover:bg-green-700 ${
              selectedBet === 0 ? "ring-4 ring-yellow-400 scale-105" : ""
            } text-white font-bold py-3 rounded-xl transition-all duration-200 shadow-lg`}
          >
            0
          </button>
        </div>
        {/* Numbers 1-36 */}
        <div className="grid grid-cols-6 gap-2">
          {Array.from({ length: 36 }, (_, i) => i + 1).map((num) => {
            const color = getNumberColor(num);
            const bgColor =
              color === "red"
                ? "bg-red-600 hover:bg-red-700"
                : "bg-gray-800 hover:bg-gray-900";
            return (
              <button
                key={num}
                onClick={() => onSelectBet(num as BetType)}
                className={`${bgColor} ${
                  selectedBet === num
                    ? "ring-4 ring-yellow-400 scale-110 z-10"
                    : ""
                } text-white font-bold py-2 rounded-lg transition-all duration-200 shadow-md hover:scale-105 text-sm`}
              >
                {num}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
