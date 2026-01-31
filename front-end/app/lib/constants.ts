// Contract addresses for Roulette on Sui Testnet
export const ROULETTE_PACKAGE_ID =
  "0xfe04e138fdcc99e5773e04742105c90274fae2e1d00574538c1e265afc550d5a";
export const GAME_CONFIG_ID =
  "0x22f60554c2cc1bcd6d61d6b1cc759aea8bb4a4a23274cf839128aa2452d843df";
export const HOUSE_POOL_IDRX_ID =
  "0xce146179b72461fbcfd9ed12ca2619de04bc7221eebaec79f6147252eed98254";
export const TREASURY_IDRX_ID =
  "0x700b443c9556466b527aa5279ac48b2b196aa5d399e186d62474cf4e16ead2cb";

// IDRX Token
export const IDRX_PACKAGE_ID =
  "0xe341a2e605b65d6541540bb09571e95f739c567e208163ceec2f829457325e41";
export const IDRX_TYPE = `${IDRX_PACKAGE_ID}::idrx::Idrx`;

// Random object (Sui system)
export const RANDOM_OBJECT_ID =
  "0x0000000000000000000000000000000000000000000000000000000000000008";

// IDRX has 6 decimals
export const IDRX_DECIMALS = 6;

// Bet types
export const BET_TYPES = {
  // Single numbers 0-36
  SINGLE_0: 0,
  SINGLE_1: 1,
  SINGLE_2: 2,
  SINGLE_3: 3,
  SINGLE_4: 4,
  SINGLE_5: 5,
  SINGLE_6: 6,
  SINGLE_7: 7,
  SINGLE_8: 8,
  SINGLE_9: 9,
  SINGLE_10: 10,
  SINGLE_11: 11,
  SINGLE_12: 12,
  SINGLE_13: 13,
  SINGLE_14: 14,
  SINGLE_15: 15,
  SINGLE_16: 16,
  SINGLE_17: 17,
  SINGLE_18: 18,
  SINGLE_19: 19,
  SINGLE_20: 20,
  SINGLE_21: 21,
  SINGLE_22: 22,
  SINGLE_23: 23,
  SINGLE_24: 24,
  SINGLE_25: 25,
  SINGLE_26: 26,
  SINGLE_27: 27,
  SINGLE_28: 28,
  SINGLE_29: 29,
  SINGLE_30: 30,
  SINGLE_31: 31,
  SINGLE_32: 32,
  SINGLE_33: 33,
  SINGLE_34: 34,
  SINGLE_35: 35,
  SINGLE_36: 36,
  // Outside bets
  LOW: 37, // 1-18
  HIGH: 38, // 19-36
  EVEN: 39,
  ODD: 40,
  RED: 41,
  BLACK: 42,
} as const;

export type BetType = (typeof BET_TYPES)[keyof typeof BET_TYPES];

// Bet type labels
export const BET_TYPE_LABELS: Record<BetType, string> = {
  [BET_TYPES.SINGLE_0]: "0",
  [BET_TYPES.SINGLE_1]: "1",
  [BET_TYPES.SINGLE_2]: "2",
  [BET_TYPES.SINGLE_3]: "3",
  [BET_TYPES.SINGLE_4]: "4",
  [BET_TYPES.SINGLE_5]: "5",
  [BET_TYPES.SINGLE_6]: "6",
  [BET_TYPES.SINGLE_7]: "7",
  [BET_TYPES.SINGLE_8]: "8",
  [BET_TYPES.SINGLE_9]: "9",
  [BET_TYPES.SINGLE_10]: "10",
  [BET_TYPES.SINGLE_11]: "11",
  [BET_TYPES.SINGLE_12]: "12",
  [BET_TYPES.SINGLE_13]: "13",
  [BET_TYPES.SINGLE_14]: "14",
  [BET_TYPES.SINGLE_15]: "15",
  [BET_TYPES.SINGLE_16]: "16",
  [BET_TYPES.SINGLE_17]: "17",
  [BET_TYPES.SINGLE_18]: "18",
  [BET_TYPES.SINGLE_19]: "19",
  [BET_TYPES.SINGLE_20]: "20",
  [BET_TYPES.SINGLE_21]: "21",
  [BET_TYPES.SINGLE_22]: "22",
  [BET_TYPES.SINGLE_23]: "23",
  [BET_TYPES.SINGLE_24]: "24",
  [BET_TYPES.SINGLE_25]: "25",
  [BET_TYPES.SINGLE_26]: "26",
  [BET_TYPES.SINGLE_27]: "27",
  [BET_TYPES.SINGLE_28]: "28",
  [BET_TYPES.SINGLE_29]: "29",
  [BET_TYPES.SINGLE_30]: "30",
  [BET_TYPES.SINGLE_31]: "31",
  [BET_TYPES.SINGLE_32]: "32",
  [BET_TYPES.SINGLE_33]: "33",
  [BET_TYPES.SINGLE_34]: "34",
  [BET_TYPES.SINGLE_35]: "35",
  [BET_TYPES.SINGLE_36]: "36",
  [BET_TYPES.LOW]: "Low (1-18)",
  [BET_TYPES.HIGH]: "High (19-36)",
  [BET_TYPES.EVEN]: "Even",
  [BET_TYPES.ODD]: "Odd",
  [BET_TYPES.RED]: "Red",
  [BET_TYPES.BLACK]: "Black",
};

// Multipliers (as fraction num/denom)
export const BET_MULTIPLIERS: Record<BetType, { num: number; denom: number }> =
  {
    // Single numbers: 36x
    ...Object.fromEntries(
      Array.from({ length: 37 }, (_, i) => [i, { num: 360, denom: 10 }]),
    ),
    // Outside bets: 2x
    [BET_TYPES.LOW]: { num: 20, denom: 10 },
    [BET_TYPES.HIGH]: { num: 20, denom: 10 },
    [BET_TYPES.EVEN]: { num: 20, denom: 10 },
    [BET_TYPES.ODD]: { num: 20, denom: 10 },
    [BET_TYPES.RED]: { num: 20, denom: 10 },
    [BET_TYPES.BLACK]: { num: 20, denom: 10 },
  } as Record<BetType, { num: number; denom: number }>;

// Red numbers on a roulette wheel
export const RED_NUMBERS = [
  1, 3, 5, 7, 9, 12, 14, 16, 18, 19, 21, 23, 25, 27, 30, 32, 34, 36,
];
export const BLACK_NUMBERS = [
  2, 4, 6, 8, 10, 11, 13, 15, 17, 20, 22, 24, 26, 28, 29, 31, 33, 35,
];

export function getNumberColor(num: number): "red" | "black" | "green" {
  if (num === 0) return "green";
  if (RED_NUMBERS.includes(num)) return "red";
  return "black";
}
