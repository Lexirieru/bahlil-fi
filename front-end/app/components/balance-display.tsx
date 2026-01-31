"use client";

import { useSuiClientQuery } from "@mysten/dapp-kit";
import { useCurrentAccount } from "@mysten/dapp-kit";
import { IDRX_TYPE, IDRX_DECIMALS } from "../lib/constants";

export function BalanceDisplay() {
  const account = useCurrentAccount();

  const { data: coins, isLoading } = useSuiClientQuery(
    "getCoins",
    {
      owner: account?.address ?? "",
      coinType: IDRX_TYPE,
    },
    {
      enabled: !!account?.address,
    }
  );

  if (!account) {
    return null;
  }

  const totalBalance = coins?.data?.reduce((acc, coin) => {
    return acc + BigInt(coin.balance);
  }, BigInt(0)) ?? BigInt(0);

  const formattedBalance = (Number(totalBalance) / Math.pow(10, IDRX_DECIMALS)).toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  return (
    <div className="bg-gradient-to-r from-emerald-500/20 to-teal-500/20 backdrop-blur-sm border border-emerald-500/30 rounded-2xl p-4 flex items-center gap-3">
      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center text-white font-bold text-sm">
        IDR
      </div>
      <div>
        <p className="text-sm text-gray-400">Balance</p>
        <p className="text-xl font-bold text-white">
          {isLoading ? "Loading..." : `${formattedBalance} IDRX`}
        </p>
      </div>
    </div>
  );
}
