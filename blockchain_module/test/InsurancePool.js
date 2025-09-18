const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("InsurancePool", function () {
  let insurancePool;
  let owner, addr1, addr2;

  beforeEach(async function () {
    [owner, addr1, addr2] = await ethers.getSigners();
    const InsurancePool = await ethers.getContractFactory("InsurancePool");
    insurancePool = await InsurancePool.deploy();
    await insurancePool.waitForDeployment();
  });

  it("Should accept contributions", async function () {
    await insurancePool.connect(addr1).contribute({ value: ethers.parseEther("1") });
    expect(await insurancePool.balances(addr1.address)).to.equal(ethers.parseEther("1"));
    expect(await insurancePool.totalPool()).to.equal(ethers.parseEther("1"));
  });

  it("Should allow owner to trigger emergency payout", async function () {
    await insurancePool.connect(addr1).contribute({ value: ethers.parseEther("1") });
    await insurancePool.connect(addr2).contribute({ value: ethers.parseEther("1") });

    const members = [addr1.address, addr2.address];
    await expect(
      insurancePool.triggerEmergencyPayout(members, ethers.parseEther("1"))
    ).to.emit(insurancePool, "Payout").withArgs(addr1.address, ethers.parseEther("1"));
  });
});