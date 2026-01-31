/// Module: idrx
module idrx::idrx;

use sui::coin::Coin;
use sui::coin_registry::{Self, CoinRegistry, Currency};

use sui::coin::{Self, TreasuryCap};

// The type identifier of coin. The coin will have a type
// tag of kind: `Coin<package_object::currency::MyCoin>`
public struct Idrx has key { id: UID }

// Address authorized to mint and burn tokens
const ADMIN_ADDRESS: address = @0x695d89812bb4713409e3e78c3dafd8c0c44007edf6cc2f0a0f270f98a0fb95b9;

// Error codes
const E_NOT_AUTHORIZED: u64 = 0;


#[allow(lint(self_transfer))]
/// Creates a new currency with a non-OTW proof of uniqueness.
public fun new_currency(registry: &mut CoinRegistry, ctx: &mut TxContext) {
    let ( currency,  treasury_cap) = coin_registry::new_currency<Idrx>(
        registry,
        6, // Decimals
        b"IDRX".to_string(), // Symbol
        b"Mocked IDRX".to_string(), // Name
        b"IDRX is a regulated digital asset pegged 1:1 to the Indonesian Rupiah (IDR), offering rapid global transactions and 24/7 access to financial markets.".to_string(), // Description
        b"https://home.idrx.co/favicon.svg".to_string(), // Icon URL
        ctx,
    );

    let metadata_cap = currency.finalize(ctx);
    transfer::public_transfer(metadata_cap, ctx.sender());
    transfer::public_transfer(treasury_cap, ctx.sender());
}

public fun mint(
    treasury_cap: &mut TreasuryCap<Idrx>,
    amount: u64,
    recipient: address,
    ctx: &mut TxContext,
) {
    // Only the admin address can mint tokens
    assert!(tx_context::sender(ctx) == ADMIN_ADDRESS, E_NOT_AUTHORIZED);

    let coin = coin::mint(treasury_cap, amount, ctx);
    transfer::public_transfer(coin, recipient);
}

/// Only the admin address can burn tokens
public fun burn(currency: &mut Currency<Idrx>, coin: Coin<Idrx>, ctx: &TxContext) {
    // Only the admin address can burn tokens
    assert!(tx_context::sender(ctx) == ADMIN_ADDRESS, E_NOT_AUTHORIZED);

    currency.burn(coin);
}