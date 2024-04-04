// Working with Decimals and wrapper for js Decimal to make it easier
import BN from "bn.js";
import Decimal from "decimal.js";

/*
    * Either a `Decimal`, `string`, `number`, or `BN`
*/
export type DecimalLike = Decimal | string |number | BN

/* 
    * Method to get a DecimalLike as a Decimal 
*/
export const asDecimal = (
    number?: DecimalLike | null, 
    fallback?: DecimalLike
): Decimal => {
    if (number === null || number === undefined) {
        return asDecimal(fallback)
    }

    try {
        const decimal = new Decimal(
            number instanceof BN ? number.toString() : number 
        )

        return decimal 
    } catch (e) {
        if (fallback !== undefined && fallback !== null) {
            return asDecimal(fallback)
        }

        throw e 
    }
}
