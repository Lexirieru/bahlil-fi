module musdc_token::musdc {

    use sui::coin;
    use sui::transfer;
    use sui::tx_context::TxContext;

    /// Mock USDC type
    public struct MUSDC has drop {}

    /// Init dipanggil saat publish
    fun init(witness: MUSDC, ctx: &mut TxContext) {
        let (treasury_cap, metadata) = coin::create_currency<MUSDC>(
            witness,
            6,                              // decimals (USDC-style)
            b"mUSDC",                       // symbol
            b"Mock USDC",                   // name
            b"Demo-only token, not real USDC",
            option::none(),
            ctx
        );

        transfer::public_transfer(treasury_cap, tx_context::sender(ctx));
        transfer::public_transfer(metadata, tx_context::sender(ctx));
    }

    /// Mint ke address tertentu
    public fun mint_to(
        cap: &mut coin::TreasuryCap<MUSDC>,
        amount: u64,
        recipient: address,
        ctx: &mut TxContext
    ) {
        let minted = coin::mint<MUSDC>(cap, amount, ctx);
        transfer::public_transfer(minted, recipient);
    }

    /// Faucet: mint 1000 mUSDC ke pemanggil
    public fun faucet_1000(
        cap: &mut coin::TreasuryCap<MUSDC>,
        ctx: &mut TxContext
    ) {
        let amount = 1_000_000_000; // 1000 * 10^6
        let minted = coin::mint<MUSDC>(cap, amount, ctx);
        transfer::public_transfer(minted, tx_context::sender(ctx));
    }
}
