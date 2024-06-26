import { Port, ReserveInfo } from "@port.finance/port-sdk";
import { fetchHandler } from "../utils/fetch-fns";
import { findTokenByMint } from "../utils/token-info-fns";
import { buildAssetRate } from "../utils/rate-fns";

export const fetch = fetchHandler(
    "port",
    async ({ connection, isDesiredToken }) => {
        const port = Port.forMainNet({ connection })
        const context = await port.getReserveContext()
        const reserves: ReserveInfo[] = context.getAllReserves()

        // get rates 
        const rates = reserves.map((reserve) =>{
            const token = findTokenByMint(reserve.getAssetMintId())  

            if (!token) {
                return 
            }

            if (isDesiredToken(token)) {
                return buildAssetRate({  
                    token,
                    deposit: reserve.getSupplyApy().getUnchecked().toNumber(),
                    borrow: reserve.getBorrowApy().getUnchecked().toNumber()
                })
            }
        })

        return rates
    }
)
