module mbtc_token::mbtc {

    use sui::coin;
    use sui::transfer;
    use sui::tx_context::TxContext;

    /// Mock BTC type
    public struct MBTC has drop {}

    /// Create currency saat publish
    fun init(witness: MBTC, ctx: &mut TxContext) {
        let (treasury_cap, metadata) = coin::create_currency<MBTC>(
            witness,
            8,                              // decimals (BTC-style biasanya 8)
            b"mBTC",                        // symbol (AMAN)
            b"Mock BTC",                    // name
            b"Demo-only token, not real BTC",
            option::none(),
            ctx
        );

        transfer::public_transfer(treasury_cap, tx_context::sender(ctx));
        transfer::public_transfer(metadata, tx_context::sender(ctx));
    }

    /// Mint ke address tertentu (amount dalam base units)
    public fun mint_to(
        cap: &mut coin::TreasuryCap<MBTC>,
        amount: u64,
        recipient: address,
        ctx: &mut TxContext
    ) {
        let minted = coin::mint<MBTC>(cap, amount, ctx);
        transfer::public_transfer(minted, recipient);
    }

    /// Faucet: mint 1 mBTC ke pemanggil
    public fun faucet_1(
        cap: &mut coin::TreasuryCap<MBTC>,
        ctx: &mut TxContext
    ) {
        // 1 mBTC dengan decimals=8 => 1 * 10^8
        let amount = 100_000_000;
        let minted = coin::mint<MBTC>(cap, amount, ctx);
        transfer::public_transfer(minted, tx_context::sender(ctx));
    }
}
