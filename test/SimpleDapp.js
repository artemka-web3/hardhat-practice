const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("SimpleDapp", function () {
  let simpleDapp;

  beforeEach(async function () {
    const SimpleDapp = await ethers.getContractFactory("SimpleDapp");
    simpleDapp = await SimpleDapp.deploy();
    await simpleDapp.deployed();
  });

  it("should deposit and withdraw successfully", async function () {
    const amount = ethers.utils.parseEther("1");
    await simpleDapp.deposit({ value: amount });
    const balanceBefore = await ethers.provider.getBalance(simpleDapp.address);

    await simpleDapp.withdraw(amount);

    const balanceAfter = await ethers.provider.getBalance(simpleDapp.address);
    expect(balanceAfter).to.equal(balanceBefore.sub(amount));
  });

  it("should revert if trying to withdraw more than balance", async function () {
    const amount = ethers.utils.parseEther("1");
    await simpleDapp.deposit({ value: amount });

    await expect(simpleDapp.withdraw(amount.add(1))).to.be.revertedWith(
      "Insufficient balance"
    );
  });

  it("should return correct balance", async function () {
    const amount = ethers.utils.parseEther("1");
    await simpleDapp.deposit({ value: amount });

    const balance = await simpleDapp.getBalance(await ethers.provider.getSigner(0).getAddress());
    expect(balance).to.equal(amount);
  });
});
