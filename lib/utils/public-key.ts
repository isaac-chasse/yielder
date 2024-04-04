import { PublicKey, PublicKeyInitData } from "@solana/web3.js";

/* 
    * Public key matcher 
*/ 
export type PublicKeyLike = PublicKey | PublicKeyInitData

/* 
    * Conforms into a PublicKey given a key 
*/
export const asPublicKey = (key: PublicKeyLike): PublicKey => {
    if (key instanceof PublicKey) {
        return key
    }

    return new PublicKey(key)
}
