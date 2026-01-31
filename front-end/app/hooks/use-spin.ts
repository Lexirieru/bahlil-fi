"use client";

import { useState, useCallback } from "react";
import {
  useSignAndExecuteTransaction,
  useSuiClient,
  useCurrentAccount,
  useSuiClientQuery,
} from "@mysten/dapp-kit";
import { Transaction } from "@mysten/sui/transactions";
import {
  ROULETTE_PACKAGE_ID,
  GAME_CONFIG_ID,
  HOUSE_POOL_IDRX_ID,
  TREASURY_IDRX_ID,
  RANDOM_OBJECT_ID,
  IDRX_TYPE,
  IDRX_DECIMALS,
  BetType,
} from "../lib/constants";

interface SpinResult {
  payout: bigint;
  deposit: bigint;
  multiplierNum: number;
  multiplierDenom: number;
  won: boolean;
}

export function useSpin() {
  const [isSpinning, setIsSpinning] = useState(false);
  const [result, setResult] = useState<SpinResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const suiClient = useSuiClient();
  const account = useCurrentAccount();
  const { mutateAsync: signAndExecute } = useSignAndExecuteTransaction();

  // Get user's IDRX coins
  const { data: coins, refetch: refetchCoins } = useSuiClientQuery(
    "getCoins",
    {
      owner: account?.address ?? "",
      coinType: IDRX_TYPE,
    },
    {
      enabled: !!account?.address,
    },
  );

  const spin = useCallback(
    async (betType: BetType, betAmount: number) => {
      if (!account?.address) {
        setError("Please connect your wallet");
        return null;
      }

      if (!coins?.data?.length) {
        setError("No IDRX coins found. Please get some IDRX first.");
        return null;
      }

      setIsSpinning(true);
      setError(null);
      setResult(null);

      try {
        const betAmountRaw = BigInt(
          Math.floor(betAmount * Math.pow(10, IDRX_DECIMALS)),
        );

        // Find a coin with enough balance or merge coins
        const tx = new Transaction();

        // Get all coin object IDs
        const coinIds = coins.data.map((c) => c.coinObjectId);

        let betCoin;
        if (coinIds.length === 1) {
          // Single coin - split if needed
          const [splitCoin] = tx.splitCoins(tx.object(coinIds[0]), [
            tx.pure.u64(betAmountRaw),
          ]);
          betCoin = splitCoin;
        } else {
          // Multiple coins - merge first then split
          const [primaryCoin, ...restCoins] = coinIds;
          if (restCoins.length > 0) {
            tx.mergeCoins(
              tx.object(primaryCoin),
              restCoins.map((id) => tx.object(id)),
            );
          }
          const [splitCoin] = tx.splitCoins(tx.object(primaryCoin), [
            tx.pure.u64(betAmountRaw),
          ]);
          betCoin = splitCoin;
        }

        // Call spin function
        tx.moveCall({
          target: `${ROULETTE_PACKAGE_ID}::roulette::spin`,
          typeArguments: [IDRX_TYPE],
          arguments: [
            tx.object(GAME_CONFIG_ID),
            tx.object(HOUSE_POOL_IDRX_ID),
            tx.object(TREASURY_IDRX_ID),
            tx.object(RANDOM_OBJECT_ID),
            betCoin,
          ],
        });

        const response = await signAndExecute({
          transaction: tx,
        });

        // Wait for transaction to complete
        const txResult = await suiClient.waitForTransaction({
          digest: response.digest,
          options: {
            showEvents: true,
            showEffects: true,
          },
        });

        // Parse SpinResult event
        const spinEvent = txResult.events?.find((e) =>
          e.type.includes("::roulette::SpinResult"),
        );

        if (spinEvent && spinEvent.parsedJson) {
          const eventData = spinEvent.parsedJson as {
            payout: string;
            deposit: string;
            multiplier_num: number;
            multiplier_denom: number;
          };

          const payout = BigInt(eventData.payout);
          const deposit = BigInt(eventData.deposit);
          const won = payout > BigInt(0);

          const spinResult: SpinResult = {
            payout,
            deposit,
            multiplierNum: eventData.multiplier_num,
            multiplierDenom: eventData.multiplier_denom,
            won,
          };

          setResult(spinResult);

          // Refetch coins after spin
          setTimeout(() => refetchCoins(), 1000);

          return spinResult;
        }

        setError("Could not parse spin result");
        return null;
      } catch (err) {
        console.error("Spin error:", err);
        setError(err instanceof Error ? err.message : "Transaction failed");
        return null;
      } finally {
        setIsSpinning(false);
      }
    },
    [account, coins, signAndExecute, suiClient, refetchCoins],
  );

  return {
    spin,
    isSpinning,
    result,
    error,
    clearError: () => setError(null),
    clearResult: () => setResult(null),
  };
}
