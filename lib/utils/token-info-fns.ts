import { StaticTokenListResolutionStrategy, TokenInfo, TokenListContainer } from "@solana/spl-token-registry";
import { PublicKeyLike } from "./public-key";

/*
    * Token list from @solana/spl-token-registry
*/
const tokens = new TokenListContainer(
    new StaticTokenListResolutionStrategy().resolve()
)
const tokenList = tokens.filterByClusterSlug("mainnet-beta").getList()

/*
    * Type for TokenInfo from SPL token registry or a string with token data 
*/
export type TokenInfoLike = TokenInfo | string

/*
    * Finds token via symbol search
*/ 
export const findTokenBySymbol = (symbol?: string): TokenInfo | undefined => {
    if (!symbol) {
        return 
    }

    return tokenList.find((token) => token.symbol === symbol)
}

/*
    * Finds token via mint address search 
*/
export const findTokenByMint = (
    mint?: PublicKeyLike
): TokenInfo | undefined => {
    if (!mint) {
        return
    }

    return tokenList.find((token) => token.address === mint.toString())
}

/*
    * Generic finder for token accepts symbol or mint 
*/
export const findToken = (
    symbolOrMint?: PublicKeyLike | string 
): TokenInfo | undefined => {
    if (!symbolOrMint) {
        return 
    }

    return tokenList.find(
        (token) =>
            token.address === symbolOrMint.toString() || 
            token.symbol === symbolOrMint.toString()
    )
}

/* 
    * Builder for TokenInfo
*/
export const buildTokenInfo = (tokenInfo?: TokenInfoLike) => {
    const info = typeof tokenInfo === "string" ? findToken(tokenInfo) : tokenInfo

    if (!info) {
        throw new Error("Unknown token: ${tokenInfo}")
    }

    return info as TokenInfo
}
