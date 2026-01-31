"use client";

import Link from "next/link";
import { useCurrentAccount } from "@mysten/dapp-kit";
import { WalletConnectButton } from "./components/connect-button";
import { BalanceDisplay } from "./components/balance-display";

interface GameCardProps {
  title: string;
  description: string;
  icon: string;
  href: string;
  disabled?: boolean;
  gradient: string;
}

function GameCard({ title, description, icon, href, disabled, gradient }: GameCardProps) {
  const content = (
    <div
      className={`relative overflow-hidden rounded-3xl p-8 h-full transition-all duration-300 ${
        disabled
          ? "bg-gray-800/50 cursor-not-allowed opacity-60"
          : `bg-gradient-to-br ${gradient} hover:scale-105 hover:shadow-2xl cursor-pointer`
      }`}
    >
      {/* Coming Soon Badge */}
      {disabled && (
        <div className="absolute top-4 right-4 bg-gray-700 text-gray-300 text-xs font-bold px-3 py-1 rounded-full">
          Coming Soon
        </div>
      )}

      {/* Icon */}
      <div className="text-7xl mb-6">{icon}</div>

      {/* Title */}
      <h3 className="text-3xl font-bold text-white mb-3">{title}</h3>

      {/* Description */}
      <p className={`text-lg ${disabled ? "text-gray-500" : "text-white/80"}`}>
        {description}
      </p>

      {/* Play Button */}
      {!disabled && (
        <div className="mt-6">
          <span className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm text-white font-bold py-3 px-6 rounded-xl hover:bg-white/30 transition-all">
            Play Now
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 7l5 5m0 0l-5 5m5-5H6"
              />
            </svg>
          </span>
        </div>
      )}
    </div>
  );

  if (disabled) {
    return content;
  }

  return <Link href={href}>{content}</Link>;
}

export default function Home() {
  const account = useCurrentAccount();

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-purple-900/20 to-gray-900">
      {/* Header */}
      <header className="border-b border-gray-800 backdrop-blur-sm bg-gray-900/50 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-3xl">🎮</span>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-400 via-pink-500 to-orange-500 bg-clip-text text-transparent">
                Bahlil Games
              </h1>
              <p className="text-xs text-gray-500">Gaming on Sui Blockchain</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            {account && <BalanceDisplay />}
            <WalletConnectButton />
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 py-16 text-center">
        <h2 className="text-5xl md:text-6xl font-bold mb-6">
          <span className="bg-gradient-to-r from-purple-400 via-pink-500 to-orange-500 bg-clip-text text-transparent">
            Play & Win
          </span>
          <br />
          <span className="text-white">on Sui Blockchain</span>
        </h2>
        <p className="text-xl text-gray-400 max-w-2xl mx-auto mb-8">
          Experience the thrill of blockchain gaming with IDRX tokens. 
          Fair, transparent, and instant payouts.
        </p>
        {!account && (
          <div className="flex justify-center">
            <WalletConnectButton />
          </div>
        )}
      </section>

      {/* Games Grid */}
      <section className="max-w-7xl mx-auto px-4 pb-16">
        <h3 className="text-2xl font-bold text-white mb-8 text-center">
          Choose Your Game
        </h3>
        <div className="grid md:grid-cols-3 gap-6">
          {/* Roulette - Active */}
          <GameCard
            title="Roulette"
            description="Spin the wheel and win up to 36x! Bet on colors, numbers, or ranges."
            icon="🎰"
            href="/roulette"
            gradient="from-red-600 via-purple-600 to-pink-600"
          />

          {/* Magic Swap - Disabled */}
          <GameCard
            title="Magic Swap"
            description="Swap tokens with magical multipliers. Risk it all for huge rewards!"
            icon="✨"
            href="/magic-swap"
            disabled
            gradient="from-blue-600 via-cyan-600 to-teal-600"
          />

          {/* Flip Coin - Disabled */}
          <GameCard
            title="Flip Coin"
            description="Classic heads or tails with 2x payout. Simple and exciting!"
            icon="🪙"
            href="/flip-coin"
            disabled
            gradient="from-yellow-600 via-orange-600 to-red-600"
          />
        </div>
      </section>

      {/* Stats Section */}
      <section className="max-w-7xl mx-auto px-4 pb-16">
        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 text-center border border-gray-700">
            <p className="text-4xl font-bold text-purple-400 mb-2">1%</p>
            <p className="text-gray-400">Max Bet per Pool</p>
          </div>
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 text-center border border-gray-700">
            <p className="text-4xl font-bold text-pink-400 mb-2">2%</p>
            <p className="text-gray-400">House Edge</p>
          </div>
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 text-center border border-gray-700">
            <p className="text-4xl font-bold text-orange-400 mb-2">36x</p>
            <p className="text-gray-400">Max Multiplier</p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 py-6 text-center text-gray-500 text-sm">
          <p>Bahlil Games • Built on Sui Blockchain • Play responsibly 🎮</p>
        </div>
      </footer>
    </div>
  );
}
