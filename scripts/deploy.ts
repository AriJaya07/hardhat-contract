import { ethers } from "ethers";
import fs from "fs";

(async () => {
  try {
    const PRIVATE_KEY = fs.readFileSync(".private_key", "utf8").trim();
    const INFURA_KEY = fs.readFileSync(".infura", "utf8").trim();

    // Connect to Sepolia, NOT localhost
    const provider = new ethers.JsonRpcProvider(
      `https://sepolia.infura.io/v3/${INFURA_KEY}`
    );

    const signer = new ethers.Wallet(PRIVATE_KEY, provider);

    console.log("Signer:", signer.address);

    const bal = await provider.getBalance(signer.address);
    console.log("Balance:", ethers.formatEther(bal));

    if (bal === 0n) {
      throw new Error("❌ ERROR: Signer has 0 ETH — cannot deploy.");
    }

    const artifact = JSON.parse(
      fs.readFileSync("./artifacts/contracts/Spacebear.sol/Spacebear.json", "utf8")
    );

    const Spacebear = new ethers.ContractFactory(
      artifact.abi,
      artifact.bytecode,
      signer
    );

    const contract = await Spacebear.deploy();
    await contract.waitForDeployment();

    console.log("Deploy contract at:", await contract.getAddress());
  } catch (e) {
    console.error(e);
    process.exitCode = 1;
  }
})();
