"use client";

import { ConnectButton } from "@mysten/dapp-kit";

export function WalletConnectButton() {
  return (
    <ConnectButton 
      className="!bg-gradient-to-r !from-purple-600 !to-pink-600 !text-white !font-bold !py-3 !px-6 !rounded-xl hover:!from-purple-700 hover:!to-pink-700 !transition-all !duration-300 !shadow-lg hover:!shadow-purple-500/25"
    />
  );
}
