// scripts/deploy.ts
import { ethers } from "hardhat";

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("🚀 Deploying contracts with:", deployer.address);

  // ----------------------------
  // 1. Deploy Mock ERC20 Token
  // ----------------------------
  const Token = await ethers.getContractFactory("MockERC20");
  const token = await Token.deploy("DemoToken", "DMT");
  await token.waitForDeployment();
  const tokenAddress = await token.getAddress();
  console.log("✅ MockERC20 deployed at:", tokenAddress);

  // Mint initial supply to deployer
  const mintAmount = ethers.parseUnits("100000", 18); // 100k tokens
  const mintTx = await token.mint(deployer.address, mintAmount);
  await mintTx.wait();
  console.log(`✅ Minted ${mintAmount} tokens to deployer (${deployer.address})`);

  // ----------------------------
  // 2. Deploy CreditScore
  // ----------------------------
  const CreditScore = await ethers.getContractFactory("CreditScore");
  const creditScore = await CreditScore.deploy();
  await creditScore.waitForDeployment();
  const creditScoreAddress = await creditScore.getAddress();
  console.log("✅ CreditScore deployed at:", creditScoreAddress);

  // ----------------------------
  // 3. Deploy Reputation
  // ----------------------------
  const Reputation = await ethers.getContractFactory("Reputation");
  const reputation = await Reputation.deploy();
  await reputation.waitForDeployment();
  const reputationAddress = await reputation.getAddress();
  console.log("✅ Reputation deployed at:", reputationAddress);

  // ----------------------------
  // 4. Deploy EmergencyPool
  // ----------------------------
  const EmergencyPool = await ethers.getContractFactory("EmergencyPool");
  const emergencyPool = await EmergencyPool.deploy(tokenAddress);
  await emergencyPool.waitForDeployment();
  const emergencyPoolAddress = await emergencyPool.getAddress();
  console.log("✅ EmergencyPool deployed at:", emergencyPoolAddress);

  // ----------------------------
  // 5. Deploy SavingsPool
  // ----------------------------
  const SavingsPool = await ethers.getContractFactory("SavingsPool");
  const contributionAmount = ethers.parseUnits("100", 18); // each contribution = 100 tokens
  const chitShareBps = 9000; // 90% chit, 10% insurance
  const minPenaltyDeposit = ethers.parseUnits("10", 18); // required penalty deposit
  const penaltyAmount = ethers.parseUnits("2", 18); // amount deducted on default

const savingsPool = await SavingsPool.deploy(
    tokenAddress,
    contributionAmount,
    chitShareBps
);

  await savingsPool.waitForDeployment();
  const savingsPoolAddress = await savingsPool.getAddress();
  console.log("✅ SavingsPool deployed at:", savingsPoolAddress);

  // ----------------------------
  // 6. Wire Contracts Together
  // ----------------------------
  await (await savingsPool.setEmergencyPool(emergencyPoolAddress)).wait();
  await (await savingsPool.setReputation(reputationAddress)).wait();
  await (await savingsPool.setCreditScore(creditScoreAddress)).wait();

  await (await reputation.setTrustedCaller(savingsPoolAddress, true)).wait();
  await (await creditScore.setTrustedCaller(savingsPoolAddress, true)).wait();
  console.log("🔗 Contracts linked & trusted callers set");

  // ----------------------------
  // 7. Fund SavingsPool chit pool
  // ----------------------------
  const fundChit = ethers.parseUnits("1000", 18);

  // Approve SavingsPool to spend tokens
  const approveTx = await token.approve(savingsPoolAddress, fundChit);
  await approveTx.wait();

  // Call fundChitPool as deployer
  const fundTx = await savingsPool.connect(deployer).fundChitPool(fundChit);
  await fundTx.wait();
  console.log("💰 SavingsPool chit pool funded with:", fundChit.toString());

  // ----------------------------
  // 8. Fund EmergencyPool insurance
  // ----------------------------
  const fundEmergency = ethers.parseUnits("2000", 18);

  // Approve EmergencyPool to spend tokens
  const approveEmergencyTx = await token.approve(emergencyPoolAddress, fundEmergency);
  await approveEmergencyTx.wait();

  // Send insurance contribution
  const insuranceTx = await emergencyPool.connect(deployer).receiveInsuranceContribution(fundEmergency);
  await insuranceTx.wait();
  console.log("💰 EmergencyPool insuranceBalance credited with:", fundEmergency.toString());

  // ----------------------------
  // 9. Final Summary
  // ----------------------------
  console.log("\n🎉 Deployment Completed Successfully!\n");
  console.log("👉 Contract Addresses:");
  console.log(`   Token:         ${tokenAddress}`);
  console.log(`   CreditScore:   ${creditScoreAddress}`);
  console.log(`   Reputation:    ${reputationAddress}`);
  console.log(`   EmergencyPool: ${emergencyPoolAddress}`);
  console.log(`   SavingsPool:   ${savingsPoolAddress}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
