import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import dotenv from "dotenv";

dotenv.config();

if (!process.env.PRIVATE_KEY || !process.env.GANACHE_URL) {
  console.error("Please set PRIVATE_KEY and GANACHE_URL in your .env file");
  process.exit(1);
}

const config: HardhatUserConfig = {
  solidity: "0.8.20",
  networks: {
    hardhat: {},
    ganache: {
      url: process.env.GANACHE_URL, // Local Ganache RPC
      accounts: [process.env.PRIVATE_KEY], // Ganache private key
      timeout: 20000,
    },
  },
};

export default config;
