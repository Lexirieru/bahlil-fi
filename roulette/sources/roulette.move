/// Module: roulette
/// A Multiplier Roulette gambling game on Sui blockchain.
/// Users deposit tokens, receive a random multiplier, and get back deposit × multiplier.
/// Supports any coin type (mock tokens, custom tokens, etc.)
#[allow(lint(public_entry, public_random))]
module roulette::roulette;

use sui::coin::{Self, Coin};
use sui::balance::{Self, Balance};
use sui::random::{Self, Random};
use sui::event;

// ==================== Error Codes ====================

/// Pool cannot cover the potential maximum payout (100x)
const EInsufficientPool: u64 = 0;
/// Deposit amount exceeds maximum (1% of pool)
const EDepositAboveMaximum: u64 = 2;
/// Game is currently paused
const EGamePaused: u64 = 3;
/// Insufficient balance for withdrawal
const EInsufficientBalance: u64 = 4;

// ==================== Constants ====================

/// Platform fee: 2% (represented as 2/100)
const FEE_NUMERATOR: u64 = 2;
const FEE_DENOMINATOR: u64 = 100;
/// Maximum multiplier for payout coverage check (100x)
const MAX_MULTIPLIER: u64 = 100;

// ==================== Data Structures ====================

/// Admin capability for privileged operations
public struct AdminCap has key, store {
    id: UID,
}

/// Game configuration - owned by admin
public struct GameConfig has key {
    id: UID,
    /// Whether the game is paused
    is_paused: bool,
    /// Fee numerator (2 = 2%)
    fee_numerator: u64,
    /// Fee denominator (100 = percentage base)
    fee_denominator: u64,
}

/// House liquidity pool - shared object holding tokens for payouts
/// Generic over token type T
public struct HousePool<phantom T> has key {
    id: UID,
    /// Balance of tokens in the pool
    balance: Balance<T>,
}

/// Treasury for collecting platform fees
/// Generic over token type T
public struct Treasury<phantom T> has key {
    id: UID,
    /// Accumulated fees
    balance: Balance<T>,
}

// ==================== Events ====================

/// Emitted when a player spins the roulette
public struct SpinResult has copy, drop {
    player: address,
    deposit: u64,
    /// Multiplier numerator (e.g., 5 for 0.5x, 10 for 1x, 20 for 2x)
    multiplier_num: u64,
    /// Multiplier denominator (always 10 for precision)
    multiplier_denom: u64,
    payout: u64,
}

/// Emitted when liquidity is added to the pool
public struct LiquidityAdded has copy, drop {
    amount: u64,
}

/// Emitted when liquidity is withdrawn from the pool
public struct LiquidityWithdrawn has copy, drop {
    amount: u64,
}

// ==================== Init Function ====================

/// Initialize the game: create GameConfig and AdminCap
/// HousePool and Treasury must be created separately for each token type
fun init(ctx: &mut TxContext) {
    // Create admin capability
    let admin_cap = AdminCap {
        id: object::new(ctx),
    };
    
    // Create game configuration
    let game_config = GameConfig {
        id: object::new(ctx),
        is_paused: false,
        fee_numerator: FEE_NUMERATOR,
        fee_denominator: FEE_DENOMINATOR,
    };
    
    // Transfer admin cap to deployer
    transfer::transfer(admin_cap, ctx.sender());
    // Share game config
    transfer::share_object(game_config);
}

// ==================== Pool Initialization ====================

/// Create a new HousePool for a specific token type (admin only)
/// Call this after deployment to create pools for your mock tokens
public entry fun create_house_pool<T>(
    _admin: &AdminCap,
    ctx: &mut TxContext,
) {
    let house_pool = HousePool<T> {
        id: object::new(ctx),
        balance: balance::zero(),
    };
    transfer::share_object(house_pool);
}

/// Create a new Treasury for a specific token type (admin only)
public entry fun create_treasury<T>(
    _admin: &AdminCap,
    ctx: &mut TxContext,
) {
    let treasury = Treasury<T> {
        id: object::new(ctx),
        balance: balance::zero(),
    };
    transfer::share_object(treasury);
}

// ==================== Admin Functions ====================

/// Add liquidity to the house pool (admin only)
public entry fun add_liquidity<T>(
    _admin: &AdminCap,
    pool: &mut HousePool<T>,
    payment: Coin<T>,
    _ctx: &mut TxContext,
) {
    let amount = coin::value(&payment);
    let payment_balance = coin::into_balance(payment);
    balance::join(&mut pool.balance, payment_balance);
    
    event::emit(LiquidityAdded { amount });
}

/// Withdraw liquidity from the house pool (admin only)
public entry fun withdraw_liquidity<T>(
    _admin: &AdminCap,
    pool: &mut HousePool<T>,
    amount: u64,
    ctx: &mut TxContext,
) {
    assert!(balance::value(&pool.balance) >= amount, EInsufficientBalance);
    
    let withdrawn = coin::take(&mut pool.balance, amount, ctx);
    transfer::public_transfer(withdrawn, ctx.sender());
    
    event::emit(LiquidityWithdrawn { amount });
}

/// Pause the game (admin only)
public entry fun pause_game(
    _admin: &AdminCap,
    config: &mut GameConfig,
    _ctx: &mut TxContext,
) {
    config.is_paused = true;
}

/// Unpause the game (admin only)
public entry fun unpause_game(
    _admin: &AdminCap,
    config: &mut GameConfig,
    _ctx: &mut TxContext,
) {
    config.is_paused = false;
}

/// Withdraw accumulated fees from treasury (admin only)
public entry fun withdraw_treasury<T>(
    _admin: &AdminCap,
    treasury: &mut Treasury<T>,
    amount: u64,
    ctx: &mut TxContext,
) {
    assert!(balance::value(&treasury.balance) >= amount, EInsufficientBalance);
    
    let withdrawn = coin::take(&mut treasury.balance, amount, ctx);
    transfer::public_transfer(withdrawn, ctx.sender());
}



// ==================== Main Game Function ====================

/// Main game function: spin the roulette
/// Uses Sui's native randomness for verifiable on-chain random multiplier
/// Generic over token type T - works with any coin type
public entry fun spin<T>(
    config: &GameConfig,
    pool: &mut HousePool<T>,
    treasury: &mut Treasury<T>,
    r: &Random,
    payment: Coin<T>,
    ctx: &mut TxContext,
) {
    // Check game is not paused
    assert!(!config.is_paused, EGamePaused);
    
    let deposit = coin::value(&payment);
    let pool_balance = balance::value(&pool.balance);
    
    // Check maximum deposit (1% of pool)
    let max_deposit = pool_balance / 100;
    assert!(deposit <= max_deposit, EDepositAboveMaximum);
    
    // Check pool can cover maximum potential payout (100x)
    let max_potential_payout = deposit * MAX_MULTIPLIER;
    assert!(pool_balance >= max_potential_payout, EInsufficientPool);
    
    // Deduct 2% platform fee
    let fee_amount = (deposit * config.fee_numerator) / config.fee_denominator;
    let net_deposit = deposit - fee_amount;
    
    // Split payment into fee and net deposit
    let mut payment_balance = coin::into_balance(payment);
    let fee_balance = balance::split(&mut payment_balance, fee_amount);
    
    // Add fee to treasury
    balance::join(&mut treasury.balance, fee_balance);
    
    // Add net deposit to pool
    balance::join(&mut pool.balance, payment_balance);
    
    // Generate random number 0-999
    let mut generator = random::new_generator(r, ctx);
    let roll = random::generate_u64_in_range(&mut generator, 0, 1000);
    
    // Determine multiplier based on roll
    // multiplier_num / multiplier_denom = actual multiplier
    // Using denom=10 for 0.5x precision
    let (multiplier_num, multiplier_denom) = get_multiplier(roll);
    
    // Calculate payout: net_deposit * multiplier_num / multiplier_denom
    let payout = (net_deposit * multiplier_num) / multiplier_denom;
    
    // Process payout
    if (payout > 0) {
        // Take payout from pool and send to player
        let payout_coin = coin::take(&mut pool.balance, payout, ctx);
        transfer::public_transfer(payout_coin, ctx.sender());
    };
    
    // Emit spin result event
    event::emit(SpinResult {
        player: ctx.sender(),
        deposit,
        multiplier_num,
        multiplier_denom,
        payout,
    });
}

// ==================== Helper Functions ====================

/// Get multiplier based on random roll (0-999)
/// Returns (numerator, denominator) where actual multiplier = num/denom
/// 
/// Multiplier odds (HOUSE EDGE - sering rungkat!):
/// | Roll Range | Probability | Multiplier |
/// |------------|-------------|------------|
/// | 0-249      | 25%         | 0x         |
/// | 250-599    | 35%         | 0.5x       |
/// | 600-849    | 25%         | 1x         |
/// | 850-949    | 10%         | 2x         |
/// | 950-984    | 3.5%        | 5x         |
/// | 985-998    | 1.45%       | 10x        |
/// | 999        | 0.05%       | 100x       |
fun get_multiplier(roll: u64): (u64, u64) {
    if (roll < 250) {
        // 0x - player loses everything (25%)
        (0, 10)
    } else if (roll < 600) {
        // 0.5x - player gets half back (35%)
        (5, 10)
    } else if (roll < 850) {
        // 1x - player breaks even (25%)
        (10, 10)
    } else if (roll < 950) {
        // 2x - player doubles (10%)
        (20, 10)
    } else if (roll < 985) {
        // 5x - player 5x (3.5%)
        (50, 10)
    } else if (roll < 999) {
        // 10x - player 10x (1.45%)
        (100, 10)
    } else {
        // 100x - jackpot! (0.05% - super rare!)
        (1000, 10)
    }
}

// ==================== View Functions ====================

/// Get current pool balance
public fun get_pool_balance<T>(pool: &HousePool<T>): u64 {
    balance::value(&pool.balance)
}

/// Get current treasury balance
public fun get_treasury_balance<T>(treasury: &Treasury<T>): u64 {
    balance::value(&treasury.balance)
}

/// Check if game is paused
public fun is_game_paused(config: &GameConfig): bool {
    config.is_paused
}

/// Get maximum deposit based on pool size
public fun get_max_deposit<T>(pool: &HousePool<T>): u64 {
    balance::value(&pool.balance) / 100
}
