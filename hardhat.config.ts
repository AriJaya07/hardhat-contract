import hardhatToolboxMochaEthersPlugin from "@nomicfoundation/hardhat-toolbox-mocha-ethers";
import "@nomicfoundation/hardhat-verify";
import "@nomicfoundation/hardhat-viem";  
import { configVariable, defineConfig } from "hardhat/config";
import fs from "fs";

const mnemonic = fs.readFileSync(".secret", "utf8").trim();
const infuraProjectId = fs.readFileSync(".infura", "utf8").trim();
const etherscanKey = fs.readFileSync(".etherscan", "utf8").trim();

export default defineConfig({
  plugins: [hardhatToolboxMochaEthersPlugin],
  solidity: {
      version: "0.8.28",
      settings: {
        optimizer: {
          enabled: true,
          runs: 200,
        },
      },
  },
  networks: {
    hardhatMainnet: {
      type: "edr-simulated",
      chainType: "l1",
    },
    hardhatOp: {
      type: "edr-simulated",
      chainType: "op",
    },
    sepolia: {
      type: "http",
      chainType: "l1",
      url: `https://sepolia.infura.io/v3/${infuraProjectId}`,
      accounts: {
        mnemonic: mnemonic,
        path: "m/44'/60'/0/0",
        initialIndex: 0,
        count: 10
      }
    },
  },
  verify: {
    etherscan: {
      apiKey: etherscanKey
    }
  }
});
