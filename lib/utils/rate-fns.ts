import { TokenInfo } from "@solana/spl-token-registry"
import { DecimalLike, asDecimal } from "./decimal-fns"
import { AssetRate, Protocol, ProtocolRates } from "../types"
import { asPublicKey } from "./public-key"
import { compact } from "./array-fns"

/* 
    * Type describing asset rates from tokens and decimals 
*/
type BuildAssetRate = (arg0: {
    token: TokenInfo
    deposit?: DecimalLike
    borrow?: DecimalLike
}) => AssetRate

/*
    * AssetRate builder 
*/
export const buildAssetRate: BuildAssetRate = ({ token, deposit, borrow }) => {
    const symbol = token.symbol
    const mint = asPublicKey(token.address)

    return {
        symbol, 
        token,
        deposit: deposit !== undefined ? asDecimal(deposit) : undefined, 
        borrow: borrow !== undefined ? asDecimal(borrow) : undefined, 
        asset: symbol,
        mint
    }
}

/* 
    * Type describing protocol rates 
*/
type BuildProtocolRates = (
    protocol: Protocol,
    rates: (AssetRate | undefined | null)[]
) => ProtocolRates

/*
    * Builder for protocol rates 
*/
export const buildProtocolRates: BuildProtocolRates = (protocol, rates) => ({
    protocol,
    rates: compact(rates)
})
