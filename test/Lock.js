const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Lock", function () {
    let TimeLock;
    let timeLock;
    let owner;
    let recipient;
    let unlockTime;

    beforeEach(async function () {
        [owner, recipient] = await ethers.getSigners();
        TimeLock = await ethers.getContractFactory("TimeLock");
        
        unlockTime = Math.floor(Date.now() / 1000) + 3600; // unlockTime set to 1 hour from now
        timeLock = await TimeLock.deploy(unlockTime);
    });

    it("should set the correct owner and unlock time", async function () {
        expect(await timeLock.owner()).to.equal(owner.address);
        expect(await timeLock.unlockTime()).to.equal(unlockTime);
    });

    it("should deposit and withdraw funds after unlock time", async function () {
        const depositAmount = ethers.utils.parseEther("1");
        await timeLock.connect(owner).deposit({ value: depositAmount });
        expect(await timeLock.getBalance()).to.equal(depositAmount);
        await timeLock.setUnlockTime(Math.floor(Date.now() / 1000)); // set unlockTime to current time
        await timeLock.connect(owner).withdraw(recipient.address, depositAmount);
        expect(await timeLock.getBalance()).to.equal(0);
    });

    it("should not withdraw funds before unlock time", async function () {
        const depositAmount = ethers.utils.parseEther("1");
        await timeLock.connect(owner).deposit({ value: depositAmount });
        expect(await timeLock.getBalance()).to.equal(depositAmount);
        await expect(
            timeLock.connect(owner).withdraw(recipient.address, depositAmount)
        ).to.be.revertedWith("Funds are still locked");
        expect(await timeLock.getBalance()).to.equal(depositAmount);
    });
});