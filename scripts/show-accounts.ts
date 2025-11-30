import { ethers } from "ethers";
import fs from "fs";

async function main() {
  const infuraProjectId = fs.readFileSync(".infura", "utf8").trim();
  const PRIVATE_KEY = fs.readFileSync(".private_key", "utf8").trim();

  const provider = new ethers.JsonRpcProvider(`https://sepolia.infura.io/v3/${infuraProjectId}`);

  const deployer = new ethers.Wallet(PRIVATE_KEY, provider);

  console.log("Deployer:", deployer.address);

  const bal = await provider.getBalance(deployer.address);
  console.log("Balance:", ethers.formatEther(bal));
}

main().catch(console.error);
