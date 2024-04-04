import { FetchOptions, Protocol, ProtocolRates } from "../types";
import { fetch as port } from "./port";
import { fetch as driftv2 } from "./driftv2";
import { fetch as mango } from "./mango";

/*
    * Generalized fetch for all adapters
*/
export const fetch = async (
    protocol: Protocol,
    opts?: FetchOptions
): Promise<ProtocolRates> => {
    try {
        console.log("Initialize fetch delay...")
        const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

        switch (protocol) {
            case "port":
                const portRates = await port(opts);
                await delay(1000); // Introduce a 1-second delay
                return portRates;

            case "driftv2":
                const driftv2Rates = await driftv2(opts);
                await delay(1000); // Introduce a 1-second delay
                return driftv2Rates;

            case "mango":
                const mangoRates = await mango(opts);
                await delay(1000); // Introduce a 1-second delay
                return mangoRates;

            default:
                throw new Error(`Unsupported protocol specified: ${protocol}`);
        }
    } catch (e) {
        console.error(
            `Error fetching ${protocol} ${opts?.connection?.rpcEndpoint}`,
            e 
        );
        throw e;
    }
};

