// src/blockchain/contractService.js
import { ethers } from "ethers";
import SavingsABI from "./ABIS/SavingsPool.json";
import EmergencyABI from "./ABIS/EmergencyPool.json";
import ReputationABI from "./ABIS/Reputation.json";
import CreditABI from "./ABIS/CreditScore.json";
import TokenABI from "./ABIS/MockERC20.json";


// Replace these with deployed addresses
const CONTRACTS = {
  SAVINGS_POOL: "0xA9dFA10bD2f9448Dcde6802F51186f32c9A108Ae",
  EMERGENCY_POOL: "0x727Bd6EF694FD00Bf26a369F8dBf6C716Afaf267",
  REPUTATION: "0x85D251EeDd99928355bd441181549bebFf635748",
  CREDIT_SCORE: "0x6a3061c351aF5E8DdE37f4a69c944b6Cd5E8eE2A",
  TOKEN: "0x35FF39fc4f7aD59fC16C71E3ddC356dF795beeA7",
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

/* ------------------- SAVINGS POOL ------------------- */
export async function getPoolBalance() {
  const { savingsPool } = getContracts();
  const balance = await savingsPool.chitPoolBalance();
  return ethers.formatUnits(balance, 18);
}

export async function drawWinner(seed) {
  const { savingsPool } = getContracts();
  const tx = await savingsPool.drawWinner(seed);
  return await tx.wait();
}

// export async function signCommitment(amount) {
//   const { savingsPool } = getContracts();
//   const tx = await savingsPool.signCommitment(ethers.parseUnits(amount.toString(), 18));
//   return await tx.wait();
// }

export async function registerMember() {
  const { savingsPool } = getContracts();
  const tx = await savingsPool.registerMember(); // ✅ correct name
  return await tx.wait();
}

export async function signCommitment() {
  const { savingsPool } = getContracts();
  const tx = await savingsPool.signCommitment(); // ✅ no args
  return await tx.wait();
}



export async function approveContribution(amount) {
   const { token } = getContracts();
  const tx = await token.approve(CONTRACTS.SAVINGS_POOL, amount);
   return tx.wait();
 }

// ✅ New helper: Sign commitment (user agrees to auto-debit)


// // ✅ New helper: Register as pool member
// export async function registerMember() {
//   const { savingsPool } = getContracts();
//   const tx = await savingsPool.register();
//   return tx.wait();
// }

/* ------------------- EMERGENCY POOL ------------------- */
export async function raiseEmergencyClaim(reason, amount) {
  const { emergencyPool } = getContracts();
  const tx = await emergencyPool.raiseClaim(reason, ethers.parseUnits(amount.toString(), 18));
  return await tx.wait();
}

export async function getClaims(round) {
  const { emergencyPool } = getContracts();
  return await emergencyPool.getClaimsForRound(round);
}

/* ------------------- REPUTATION / CREDIT ------------------- */
export async function getReputation(addr) {
  const { reputation } = getContracts();
  return await reputation.getReputation(addr);
}

export async function getCreditScore(addr) {
  const { creditScore } = getContracts();
  return await creditScore.getCreditScore(addr);
}

/* ------------------- EVENTS ------------------- */
export function subscribeWinnerSelected(callback) {
  const { savingsPool } = getContracts();
  savingsPool.on("WinnerSelected", (who, payout, round, event) => {
    callback({
      who,
      payout: ethers.formatUnits(payout, 18),
      round: Number(round),
      txHash: event?.transactionHash,
    });
  });
}

export function subscribeContribution(callback) {
  const { savingsPool } = getContracts();
  savingsPool.on("ContributionReceived", (who, amount, chitShare, insuranceShare, round, event) => {
    callback({
      who,
      amount: ethers.formatUnits(amount, 18),
      chitShare: ethers.formatUnits(chitShare, 18),
      insuranceShare: ethers.formatUnits(insuranceShare, 18),
      round: Number(round),
      txHash: event?.transactionHash,
    });
  });
}

export function subscribeMemberRegistered(callback) {
  const { savingsPool } = getContracts();
  savingsPool.on("MemberRegistered", (who, event) => {
    callback({
      who,
      txHash: event?.transactionHash,
    });
  });
}

