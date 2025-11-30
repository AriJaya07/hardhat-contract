import { Wallet } from "ethers";
import fs from "fs";

const pk = fs.readFileSync(".private_key", "utf8").trim();
const wallet = new Wallet(pk);

console.log("WALLET ADDRESS FROM PRIVATE KEY:", wallet.address);
