# 🎰 Multiplier Roulette - Sui Smart Contract

A gambling game on Sui blockchain where players deposit tokens and receive back their deposit multiplied by a random multiplier (0x to 100x).

## 📋 Contract Information

| Item           | Value                                                                |
| -------------- | -------------------------------------------------------------------- |
| **Package ID** | `0xfe04e138fdcc99e5773e04742105c90274fae2e1d00574538c1e265afc550d5a` |
| **GameConfig** | `0x22f60554c2cc1bcd6d61d6b1cc759aea8bb4a4a23274cf839128aa2452d843df` |
| **AdminCap**   | `0xc068cbe2cfcdea4ad96795546ee4375e460ca6124a5f65d7ca1571e18c89a82f` |
| **UpgradeCap** | `0x894025d0aff7ffc4d6232cdaf19245faafe3c8c098f782063a327dd24bbeb709` |

---

## 🎲 Multiplier Odds

| Multiplier | Probability | Result     |
| ---------- | ----------- | ---------- |
| **0x**     | 25%         | Lose all   |
| **0.5x**   | 35%         | Lose half  |
| **1x**     | 25%         | Break even |
| **2x**     | 10%         | Double     |
| **5x**     | 3.5%        | 5x payout  |
| **10x**    | 1.45%       | 10x payout |
| **100x**   | 0.05%       | JACKPOT!   |

---

## 🚀 Deployment Steps

### 1. Build & Publish Contract

```bash
cd roulette
sui client publish
```

After publishing, note down these object IDs from the output:

- **Package ID** - The published package address
- **GameConfig** - Shared object for game configuration
- **AdminCap** - Admin capability (owned by deployer)

### 2. Create HousePool for Token

```bash
sui client call \
  --package 0xfe04e138fdcc99e5773e04742105c90274fae2e1d00574538c1e265afc550d5a \
  --module roulette \
  --function create_house_pool \
  --type-args <TOKEN_TYPE> \
  --args 0xc068cbe2cfcdea4ad96795546ee4375e460ca6124a5f65d7ca1571e18c89a82f
```

**Example (SUI):**

```bash
sui client call \
  --package 0xfe04e138fdcc99e5773e04742105c90274fae2e1d00574538c1e265afc550d5a \
  --module roulette \
  --function create_house_pool \
  --type-args 0x2::sui::SUI \
  --args 0xc068cbe2cfcdea4ad96795546ee4375e460ca6124a5f65d7ca1571e18c89a82f
```

### 3. Create Treasury for Token

```bash
sui client call \
  --package 0xfe04e138fdcc99e5773e04742105c90274fae2e1d00574538c1e265afc550d5a \
  --module roulette \
  --function create_treasury \
  --type-args <TOKEN_TYPE> \
  --args 0xc068cbe2cfcdea4ad96795546ee4375e460ca6124a5f65d7ca1571e18c89a82f
```

### 4. Add Liquidity to HousePool

```bash
sui client call \
  --package 0xfe04e138fdcc99e5773e04742105c90274fae2e1d00574538c1e265afc550d5a \
  --module roulette \
  --function add_liquidity \
  --type-args <TOKEN_TYPE> \
  --args 0xc068cbe2cfcdea4ad96795546ee4375e460ca6124a5f65d7ca1571e18c89a82f \
         <HOUSE_POOL_ID> \
         <COIN_OBJECT_ID>
```

---

## 🎮 Playing the Game

### Spin (Play)

```bash
sui client call \
  --package 0xfe04e138fdcc99e5773e04742105c90274fae2e1d00574538c1e265afc550d5a \
  --module roulette \
  --function spin \
  --type-args <TOKEN_TYPE> \
  --args 0x22f60554c2cc1bcd6d61d6b1cc759aea8bb4a4a23274cf839128aa2452d843df \
         <HOUSE_POOL_ID> \
         <TREASURY_ID> \
         0x8 \
         <YOUR_COIN_OBJECT_ID>
```

**Arguments:**

1. `GameConfig` - Shared game configuration
2. `HousePool<T>` - Pool containing liquidity
3. `Treasury<T>` - Treasury for fees
4. `Random` - Sui random object (`0x8`)
5. `Coin<T>` - Your token coin to bet

---

## 🔧 Admin Functions

### Pause Game

```bash
sui client call \
  --package 0xfe04e138fdcc99e5773e04742105c90274fae2e1d00574538c1e265afc550d5a \
  --module roulette \
  --function pause_game \
  --args 0xc068cbe2cfcdea4ad96795546ee4375e460ca6124a5f65d7ca1571e18c89a82f \
         0x22f60554c2cc1bcd6d61d6b1cc759aea8bb4a4a23274cf839128aa2452d843df
```

### Unpause Game

```bash
sui client call \
  --package 0xfe04e138fdcc99e5773e04742105c90274fae2e1d00574538c1e265afc550d5a \
  --module roulette \
  --function unpause_game \
  --args 0xc068cbe2cfcdea4ad96795546ee4375e460ca6124a5f65d7ca1571e18c89a82f \
         0x22f60554c2cc1bcd6d61d6b1cc759aea8bb4a4a23274cf839128aa2452d843df
```

### Withdraw Liquidity

```bash
sui client call \
  --package 0xfe04e138fdcc99e5773e04742105c90274fae2e1d00574538c1e265afc550d5a \
  --module roulette \
  --function withdraw_liquidity \
  --type-args <TOKEN_TYPE> \
  --args 0xc068cbe2cfcdea4ad96795546ee4375e460ca6124a5f65d7ca1571e18c89a82f \
         <HOUSE_POOL_ID> \
         <AMOUNT>
```

### Withdraw Treasury (Fees)

```bash
sui client call \
  --package 0xfe04e138fdcc99e5773e04742105c90274fae2e1d00574538c1e265afc550d5a \
  --module roulette \
  --function withdraw_treasury \
  --type-args <TOKEN_TYPE> \
  --args 0xc068cbe2cfcdea4ad96795546ee4375e460ca6124a5f65d7ca1571e18c89a82f \
         <TREASURY_ID> \
         <AMOUNT>
```

---

## 📊 Utility Commands

### Check Balance

```bash
sui client balance
```

### List All Objects

```bash
sui client objects
```

### Check Specific Object

```bash
sui client object <OBJECT_ID>
```

---

## 📁 Project Structure

```
roulette/
├── Move.toml           # Package configuration
├── sources/
│   └── roulette.move   # Main contract
├── tests/
│   └── roulette_tests.move
└── README.md
```

---

## ⚙️ Game Rules

1. **No Minimum Deposit** - Any amount can be wagered
2. **Maximum Deposit** - 1% of pool balance (to ensure solvency)
3. **Fee** - 2% platform fee on deposits
4. **Randomness** - Uses Sui's native `sui::random` module

---

## 🔐 Security Features

- ✅ Solvency check before each spin
- ✅ Pool pausing capability
- ✅ Admin-only liquidity management
- ✅ Verifiable on-chain randomness
- ✅ Generic token support (any coin type)

---

## 🔄 Supported Token Types

This contract supports **any token type** on Sui. Common examples:

- Native SUI: `0x2::sui::SUI`
- Custom tokens: `<PACKAGE>::<MODULE>::<TYPE>`

To use a different token, simply replace `<TOKEN_TYPE>` with the full token type path.

---

## 📜 License

MIT License
