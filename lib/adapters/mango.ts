import { Bank, MANGO_V4_ID, MangoClient } from "@blockworks-foundation/mango-v4";
import { AnchorProvider, Wallet } from "@coral-xyz/anchor";
import { Cluster, Keypair, PublicKey } from "@solana/web3.js";
import { fetchHandler } from "../utils/fetch-fns";
import { findTokenByMint } from "../utils/token-info-fns";
import { buildAssetRate } from "../utils/rate-fns";
import Decimal from "decimal.js";

// Easy swithing for mainnet and devnet. Default is mainet 
// Must have MB_CLUSTER_URL & MANGO_ACCOUNT_PK set up with dotenv
const CLUSTER: Cluster = (process.env.CLUSTER_OVERRIDE as Cluster) || 'mainnet-beta';
// const CLUSTER_URL = process.env.CLUSTER_URL_OVERRIDE || process.env.MB_CLUSTER_URL;
const MANGO_ACCOUNT_PK = process.env.MANGO_ACCOUNT_PK || '';

export const fetch = fetchHandler(
    "mango",
    async ({ connection, isDesiredToken }) => {
        // Likely want to set up a connection function for mango 
        const options = AnchorProvider.defaultOptions();
        // const connection = new Connection(CLUSTER_URL!, options);

        const user = new Keypair();  // throwaway
        const userWallet = new Wallet(user);
        const userProvider = new AnchorProvider(connection, userWallet, options);
        const client = MangoClient.connect(
            userProvider,
            CLUSTER,
            MANGO_V4_ID[CLUSTER],
            {
                idsSource: 'get-program-accounts',  // copied, look this up
            },
        );

        // Get account 
        let mangoAccount = await client.getMangoAccount(
            new PublicKey(MANGO_ACCOUNT_PK),
        );
        await mangoAccount.reload(client);

        // Load group for mango account
        const group = await client.getGroup(mangoAccount.group);
        await group.reloadAll(client);
        
        // Digest group and get rates from banks
        const tokensAndBanks = group.banksMapByMint;

        const rates = Array.from(tokensAndBanks.entries()).map(([token, banks]: [string, Bank[]]) => {
            // console.log(token)
            // console.log(banks)
            const tokenMint = findTokenByMint(token);

            if (!tokenMint) {
                return
            } 
            
            if (isDesiredToken(tokenMint) && banks.length > 0) {
                const bank = banks[0];
;
                const tokenName = bank.name;
                const borrowRate = bank.getBorrowRate();
                const depositRate = bank.getDepositRate();

                // console.log(`token: ${tokenName}\nborrow: ${borrowRate.toString()}\ndeposit: ${depositRate.toString()}`)

                return buildAssetRate({
                    token: tokenMint,
                    deposit: depositRate.toString(),
                    borrow:borrowRate.toString()
                })
            }
        })

        return rates
    }
)
