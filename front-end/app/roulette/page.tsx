"use client";

import { useState } from "react";
import { useCurrentAccount } from "@mysten/dapp-kit";
import { WalletConnectButton } from "../components/connect-button";
import { BalanceDisplay } from "../components/balance-display";
import { RouletteWheel } from "../components/roulette-wheel";
import { useSpin } from "../hooks/use-spin";
import { IDRX_DECIMALS } from "../lib/constants";
import Link from "next/link";

// Multiplier odds table
const MULTIPLIER_ODDS = [
  { multiplier: "0x", probability: "25%", color: "bg-gray-600", description: "Lose all" },
  { multiplier: "0.5x", probability: "35%", color: "bg-orange-600", description: "Half back" },
  { multiplier: "1x", probability: "25%", color: "bg-yellow-600", description: "Break even" },
  { multiplier: "2x", probability: "10%", color: "bg-green-600", description: "Double!" },
  { multiplier: "5x", probability: "3.5%", color: "bg-blue-600", description: "5x win!" },
  { multiplier: "10x", probability: "1.45%", color: "bg-purple-600", description: "10x win!" },
  { multiplier: "100x", probability: "0.05%", color: "bg-pink-600", description: "JACKPOT!" },
];

export default function RoulettePage() {
  const account = useCurrentAccount();
  const { spin, isSpinning, result, error, clearError } = useSpin();
  
  const [betAmount, setBetAmount] = useState<string>("1");

  const handleSpin = async () => {
    const amount = parseFloat(betAmount);
    if (isNaN(amount) || amount <= 0) {
      alert("Please enter a valid bet amount");
      return;
    }

    await spin(amount);
  };

  const formatAmount = (amount: bigint) => {
    return (Number(amount) / Math.pow(10, IDRX_DECIMALS)).toFixed(2);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-purple-900/20 to-gray-900">
      {/* Header */}
      <header className="border-b border-gray-800 backdrop-blur-sm bg-gray-900/50 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
              <span className="text-3xl">🎰</span>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
                  Multiplier Roulette
                </h1>
                <p className="text-xs text-gray-500">Spin to win up to 100x!</p>
              </div>
            </Link>
          </div>
          <div className="flex items-center gap-4">
            {account && <BalanceDisplay />}
            <WalletConnectButton />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        {!account ? (
          // Not connected state
          <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
            <div className="text-8xl mb-6">🎲</div>
            <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">
              Connect to Play
            </h2>
            <p className="text-gray-400 mb-8 max-w-md">
              Connect your wallet to spin the Multiplier Roulette and win up to 100x!
            </p>
            <WalletConnectButton />
          </div>
        ) : (
          // Connected state - Game UI
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Left: Wheel and Controls */}
            <div className="flex flex-col items-center">
              <RouletteWheel 
                isSpinning={isSpinning} 
                multiplier={result?.multiplier ?? null} 
              />
              
              {/* Bet Amount Input */}
              <div className="mt-8 w-full max-w-sm">
                <label className="block text-sm text-gray-400 mb-2">Bet Amount (IDRX)</label>
                <div className="relative">
                  <input
                    type="number"
                    value={betAmount}
                    onChange={(e) => setBetAmount(e.target.value)}
                    min="0.01"
                    step="0.01"
                    className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white text-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="Enter amount"
                    disabled={isSpinning}
                  />
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 flex gap-2">
                    {[1, 5, 10, 50].map((amt) => (
                      <button
                        key={amt}
                        onClick={() => setBetAmount(amt.toString())}
                        className="px-2 py-1 text-xs bg-gray-700 hover:bg-gray-600 rounded text-gray-300"
                        disabled={isSpinning}
                      >
                        {amt}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Spin Button */}
              <button
                onClick={handleSpin}
                disabled={isSpinning}
                className={`mt-6 w-full max-w-sm py-4 px-8 rounded-2xl text-xl font-bold transition-all duration-300 ${
                  isSpinning
                    ? "bg-gray-700 text-gray-500 cursor-not-allowed"
                    : "bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-400 hover:to-orange-400 text-gray-900 shadow-lg hover:shadow-yellow-500/25 hover:scale-105"
                }`}
              >
                {isSpinning ? "Spinning..." : "🎲 SPIN"}
              </button>

              {/* Error Display */}
              {error && (
                <div className="mt-4 p-4 bg-red-500/20 border border-red-500/50 rounded-xl text-red-400 max-w-sm w-full">
                  <p className="text-sm">{error}</p>
                  <button
                    onClick={clearError}
                    className="mt-2 text-xs text-red-300 hover:text-white"
                  >
                    Dismiss
                  </button>
                </div>
              )}

              {/* Result Display */}
              {result && !isSpinning && (
                <div
                  className={`mt-4 p-6 rounded-xl max-w-sm w-full text-center animate-slide-in ${
                    result.won
                      ? "bg-green-500/20 border border-green-500/50"
                      : result.multiplier === 1
                      ? "bg-yellow-500/20 border border-yellow-500/50"
                      : "bg-red-500/20 border border-red-500/50"
                  }`}
                >
                  {result.multiplier === 100 ? (
                    <p className="text-3xl font-bold mb-2 animate-pulse">
                      🎉 JACKPOT! 🎉
                    </p>
                  ) : result.won ? (
                    <p className="text-2xl font-bold mb-2">
                      🎉 YOU WON!
                    </p>
                  ) : result.multiplier === 1 ? (
                    <p className="text-2xl font-bold mb-2">
                      😐 Break Even
                    </p>
                  ) : (
                    <p className="text-2xl font-bold mb-2">
                      {result.multiplier === 0 ? "😢 Lost All" : "😕 Partial Loss"}
                    </p>
                  )}
                  
                  <p className="text-3xl font-bold mb-2">
                    {result.multiplier}x
                  </p>
                  
                  <div className="text-sm text-gray-400 space-y-1">
                    <p>Bet: {formatAmount(result.deposit)} IDRX</p>
                    <p className={result.won ? "text-green-400 font-bold" : ""}>
                      Payout: {formatAmount(result.payout)} IDRX
                    </p>
                    {result.won && (
                      <p className="text-green-400 font-bold text-lg">
                        +{formatAmount(result.payout - result.deposit)} IDRX profit!
                      </p>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Right: Multiplier Odds */}
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-3xl p-6 border border-gray-700">
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                <span>🎯</span> Multiplier Odds
              </h2>
              
              <p className="text-gray-400 mb-6">
                Spin the wheel and get a random multiplier! The higher the multiplier, the rarer it is.
              </p>

              <div className="space-y-3">
                {MULTIPLIER_ODDS.map((odd, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-4 p-3 rounded-xl bg-gray-800/50 border border-gray-700"
                  >
                    <div className={`w-16 h-10 rounded-lg ${odd.color} flex items-center justify-center text-white font-bold`}>
                      {odd.multiplier}
                    </div>
                    <div className="flex-1">
                      <p className="text-white font-medium">{odd.description}</p>
                      <p className="text-sm text-gray-400">{odd.probability} chance</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-xl">
                <p className="text-yellow-400 text-sm">
                  ⚠️ <strong>House Edge:</strong> 2% fee is taken from each bet. 
                  Expected value favors the house. Play responsibly!
                </p>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-800 mt-16">
        <div className="max-w-7xl mx-auto px-4 py-6 text-center text-gray-500 text-sm">
          <p>Multiplier Roulette • Built on Sui Blockchain • Play responsibly 🎲</p>
        </div>
      </footer>
    </div>
  );
}
