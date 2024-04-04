import { AnchorProvider, Wallet } from "@project-serum/anchor"
import { TokenInfo } from "@solana/spl-token-registry"
import { Connection, Keypair } from "@solana/web3.js"
import { FetchOptions, Protocol } from "../types"
import nodeDebug from "debug"
import { findToken } from "./token-info-fns"

const debug = nodeDebug("solana-protocol-streams:connection")

const RPCs = [
    "https://solana-mainnet.g.alchemy.com/v2/JHLUKKn9pM9HnYIqiaOll8xo7zWGfLhu",  // personal RPC from Alchemy
  // "https://api.mainnet-beta.solana.com",
  // "https://solana-api.projectserum.com",
  // "https://rpc.ankr.com/solana",
  // "https://solana.public-rpc.com"
]

/*
    * Builds a `Connection` object for the given protocol 
*/
export const defaultConnection = (protocol?: Protocol): Connection => {
    // const rpc = 
    //     protocol === "mango"
    //         ? IDS.cluster_urls.mainnet
    //         : protocol === "port"
    //         ? "https://solana-api.projectserum.com"
    //         : RPCs[Math.floor(Math.random() * RPCs.length)]
    //
    // This is my temporary implementation for RPC finding 
    const rpc = 
        protocol === "port"
            ? "https://solana-api.projectserum.com"
            : RPCs[Math.floor(Math.random() * RPCs.length)]

    debug("rpc", rpc)
    return new Connection(rpc, "confirmed")
}

/*
    * Uses a Connection to get an AnchorProvider
*/
const buildProvider = (connection: Connection): AnchorProvider => {
    return new AnchorProvider(connection, new Wallet(Keypair.generate()), {})  // look up fn args here
}

/*
    * Defines the default optios for a connection
*/
export type DefaultOptions = {
    connection: Connection
    provider: AnchorProvider
    desiredTokens?: TokenInfo[]  // This might be the wrong `TokenInfo` see token-fns
    isDesiredToken: (token?: TokenInfo) => boolean 
}

/*
    * Implements DefaultOptions
*/
export const defaultOptions = (
    protocol?: Protocol,
    opts: FetchOptions = {}
): DefaultOptions => {
    const connection = opts.connection ?? defaultConnection(protocol)

    const provider = buildProvider(connection)

    const desiredTokens = opts.tokens?.length
        ? (opts.tokens.map(findToken).filter(Boolean) as TokenInfo[])  // TODO: Implement findToken in /amounts & import 
        : undefined

    const isDesiredToken = (token?: TokenInfo) => {
        if (!token) {
            return false 
        }

        return !desiredTokens || desiredTokens.includes(token)
    }

    return {
        connection,
        provider,
        desiredTokens,
        isDesiredToken
    }
}
