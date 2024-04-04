// Fetch, FetchOptions, Protocol
//
// Todo
import { TokenInfo } from "@solana/spl-token-registry"
import { DefaultOptions } from "./utils/connection"
import { TokenInfoLike } from "./utils/token-info-fns"
import { Connection } from "@solana/web3.js"
import Decimal from "decimal.js"


/*
    * Type that references the available protocols (exchanges)
    * from which we can query.
*/
export type Protocol = 
    | "mango"  // incomplete
    | "port"
    | "driftv2"

/* 
    * Type that describes the available protocol features 
*/ 
export type ProtocolFeature = 
    | "fetch"  // incomplete

/*
    * Type for Protocol rates
*/
export type ProtocolRates = {
    protocol: Protocol
    rates: AssetRate[]
}

/*
    * Type describing a mutual asset rate. Compatible across protocols.
    *
    * NOTE: there are some deprecated mentions here in source code.
*/ 
export type AssetRate = {
    symbol: string
    token: TokenInfo
    deposit?: Decimal 
    borrow?: Decimal 
}

/*
    * Options available for a Fetch 
*/ 
export type FetchOptions = {
    connection?: Connection
    tokens?: TokenInfoLike[]
}

/* 
    * Standard fetch. We expect an AssetRate, undefined, or null.
*/
export type Fetch<T = void> = (
    opts: DefaultOptions,
    adapterOpts?: T
) => Promise<(AssetRate | undefined | null)[]>
