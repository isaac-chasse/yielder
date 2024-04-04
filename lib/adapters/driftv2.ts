// set up fetch 
//
import { DriftClient,loadKeypair, Wallet } from "@drift-labs/sdk";
import { fetchHandler } from "../utils/fetch-fns";
import { Keypair, PublicKey } from "@solana/web3.js";
// import { TokenInfo } from "@solana/spl-token-registry";
import nodeDebug from "debug";

const debug = nodeDebug("adapters:driftv2");

export const fetch = fetchHandler(
    "driftv2",
    async ({ connection, isDesiredToken }) => {
        // const driftConfig = new configs["mainnet-beta"];
        const keyPairFile = '...' // keypair locale 
        const wallet = new Wallet(loadKeypair(keyPairFile))

        console.log("here!");
        const driftClient = new DriftClient({
            connection: connection,
            wallet: wallet,
            programID: new PublicKey("..."), // add drift PK
            env: 'mainnet-beta',
        });

        await driftClient.subscribe();

        console.log(`-> drift client subscribed!`);
        console.log(`-> drift client authority address: ${driftClient.authority}`);

        const token = driftClient.getMarketIndexAndType("SOL");

        if (!token) {
            return 
        }

        if (isDesiredToken()) {
            console.log(`I am here ${token}`);
        }

        // get rates from DriftV2 
        const rates = driftClient.getTokenAmount(token?.marketIndex);
        debug("rates", rates);
        return rates
    }
)








// export const fetch = fetchHandler(
//     "port",
//     async ({ connection, isDesiredToken }) => {
//         const port = Port.forMainNet({ connection })
//         const context = await port.getReserveContext()
//         const reserves: ReserveInfo[] = context.getAllReserves()
//
//         // get rates 
//         const rates = reserves.map((reserve) =>{
//             const token = findTokenByMint(reserve.getAssetMintId())  
//
//             if (!token) {
//                 return 
//             }
//
//             if (isDesiredToken(token)) {
//                 return buildAssetRate({  
//                     token,
//                     deposit: reserve.getSupplyApy().getUnchecked().toNumber(),
//                     borrow: reserve.getBorrowApy().getUnchecked().toNumber()
//                 })
//             }
//         })
//
//         return rates
//     }
// )
