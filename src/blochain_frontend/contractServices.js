import { ethers } from "ethers";
import SavingsABI from "./SavingsPool.json";
import EmergencyABI from "./EmergencyPool.json";
import ReputationABI from "./Reputation.json";
import CreditABI from "./CreditScore.json";
import TokenABI from "./MockERC20.json";

// Replace these with your deployed contract addresses
const CONTRACTS = {
  SAVINGS_POOL: "0xYourSavingsPoolAddress",
  EMERGENCY_POOL: "0xYourEmergencyPoolAddress",
  REPUTATION: "0xYourReputationAddress",
  CREDIT_SCORE: "0xYourCreditScoreAddress",
  TOKEN: "0xYourMockERC20Address",
};

let provider, signer;

export async function connectWallet() {
  if (!window.ethereum) throw new Error("MetaMask not detected");

  provider = new ethers.BrowserProvider(window.ethereum);
  await provider.send("eth_requestAccounts", []);
  signer = await provider.getSigner();
  return signer.getAddress();
}

export function getContracts() {
  if (!signer) throw new Error("Wallet not connected. Call connectWallet() first.");
  
  return {
    savingsPool: new ethers.Contract(CONTRACTS.SAVINGS_POOL, SavingsABI.abi, signer),
    emergencyPool: new ethers.Contract(CONTRACTS.EMERGENCY_POOL, EmergencyABI.abi, signer),
    reputation: new ethers.Contract(CONTRACTS.REPUTATION, ReputationABI.abi, signer),
    creditScore: new ethers.Contract(CONTRACTS.CREDIT_SCORE, CreditABI.abi, signer),
    token: new ethers.Contract(CONTRACTS.TOKEN, TokenABI.abi, signer),
  };
}
