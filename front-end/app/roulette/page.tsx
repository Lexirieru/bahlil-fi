"use client";

import { useState } from "react";
import { useCurrentAccount } from "@mysten/dapp-kit";
import { WalletConnectButton } from "../components/connect-button";
import { BalanceDisplay } from "../components/balance-display";
import { BetSelector } from "../components/bet-selector";
import { RouletteWheel } from "../components/roulette-wheel";
import { useSpin } from "../hooks/use-spin";
import { BetType, BET_TYPE_LABELS, BET_MULTIPLIERS, IDRX_DECIMALS } from "../lib/constants";
import Link from "next/link";

export default function RoulettePage() {
  const account = useCurrentAccount();
  const { spin, isSpinning, result, error, clearError } = useSpin();
  
  const [selectedBet, setSelectedBet] = useState<BetType | null>(null);
  const [betAmount, setBetAmount] = useState<string>("1");
  const [wheelResult, setWheelResult] = useState<number | null>(null);

  const handleSpin = async () => {
    if (selectedBet === null) {
      alert("Please select a bet type");
      return;
    }

    const amount = parseFloat(betAmount);
    if (isNaN(amount) || amount <= 0) {
      alert("Please enter a valid bet amount");
      return;
    }

    // Start wheel animation
    setWheelResult(null);
    
    const spinResult = await spin(selectedBet, amount);
    
    if (spinResult) {
      // Generate a random number for visual effect (0-36)
      const randomResult = Math.floor(Math.random() * 37);
      setWheelResult(randomResult);
    }
  };

  const formatPayout = (payout: bigint) => {
    return (Number(payout) / Math.pow(10, IDRX_DECIMALS)).toFixed(2);
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
                  Bahlil Roulette
                </h1>
                <p className="text-xs text-gray-500">Multiplier Roulette on Sui</p>
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
              Connect to Play Roulette
            </h2>
            <p className="text-gray-400 mb-8 max-w-md">
              Connect your wallet to start playing Multiplier Roulette on Sui blockchain with IDRX tokens.
            </p>
            <WalletConnectButton />
          </div>
        ) : (
          // Connected state - Game UI
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Left: Wheel and Controls */}
            <div className="flex flex-col items-center">
              <RouletteWheel isSpinning={isSpinning} result={wheelResult} />
              
              {/* Bet Amount Input */}
              <div className="mt-8 w-full max-w-xs">
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
                    {[1, 5, 10].map((amt) => (
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

              {/* Selected Bet Display */}
              {selectedBet !== null && (
                <div className="mt-4 text-center">
                  <p className="text-gray-400 text-sm">Selected Bet</p>
                  <p className="text-xl font-bold text-white">
                    {BET_TYPE_LABELS[selectedBet]} ({BET_MULTIPLIERS[selectedBet].num / BET_MULTIPLIERS[selectedBet].denom}x)
                  </p>
                </div>
              )}

              {/* Spin Button */}
              <button
                onClick={handleSpin}
                disabled={isSpinning || selectedBet === null}
                className={`mt-6 w-full max-w-xs py-4 px-8 rounded-2xl text-xl font-bold transition-all duration-300 ${
                  isSpinning || selectedBet === null
                    ? "bg-gray-700 text-gray-500 cursor-not-allowed"
                    : "bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-400 hover:to-orange-400 text-gray-900 shadow-lg hover:shadow-yellow-500/25 hover:scale-105"
                }`}
              >
                {isSpinning ? "Spinning..." : "🎲 SPIN"}
              </button>

              {/* Error Display */}
              {error && (
                <div className="mt-4 p-4 bg-red-500/20 border border-red-500/50 rounded-xl text-red-400 max-w-xs w-full">
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
                  className={`mt-4 p-4 rounded-xl max-w-xs w-full text-center animate-slide-in ${
                    result.won
                      ? "bg-green-500/20 border border-green-500/50"
                      : "bg-red-500/20 border border-red-500/50"
                  }`}
                >
                  <p className="text-2xl font-bold mb-2">
                    {result.won ? "🎉 YOU WON!" : "😢 You Lost"}
                  </p>
                  {result.won && (
                    <p className="text-xl text-green-400">
                      +{formatPayout(result.payout)} IDRX
                    </p>
                  )}
                  <p className="text-sm text-gray-400 mt-2">
                    Bet: {formatPayout(result.deposit)} IDRX | Multiplier: {result.multiplierNum}/{result.multiplierDenom}x
                  </p>
                </div>
              )}
            </div>

            {/* Right: Bet Selector */}
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-3xl p-6 border border-gray-700">
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                <span>🎯</span> Place Your Bet
              </h2>
              <BetSelector selectedBet={selectedBet} onSelectBet={setSelectedBet} />
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-800 mt-16">
        <div className="max-w-7xl mx-auto px-4 py-6 text-center text-gray-500 text-sm">
          <p>Bahlil Roulette • Built on Sui Blockchain • Play responsibly 🎲</p>
        </div>
      </footer>
    </div>
  );
}
