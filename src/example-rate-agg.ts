import { fetch } from "../lib/adapters/index";

async function main() {
    console.log("working...")
    const mango = await fetch("mango");
    // console.log(`${mango.rates.map((r) => {r})}`);
    console.log(`${JSON.stringify(mango.rates, null, 2)}`);
}

// invoke 
main();
