// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.18;

contract TimeLock {
    address public owner;
    uint256 public unlockTime;

    event Deposit(address indexed sender, uint256 amount);
    event Withdraw(address indexed recipient, uint256 amount);

    constructor(uint256 _unlockTime) {
        owner = msg.sender;
        unlockTime = _unlockTime;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can call this function");
        _;
    }

    modifier onlyAfterUnlockTime() {
        require(block.timestamp >= unlockTime, "Funds are still locked");
        _;
    }

    function deposit() external payable {
        emit Deposit(msg.sender, msg.value);
    }

    function withdraw(address payable recipient, uint256 amount) external onlyOwner onlyAfterUnlockTime {
        require(address(this).balance >= amount, "Insufficient balance");
        recipient.transfer(amount);
        emit Withdraw(recipient, amount);
    }

    function setUnlockTime(uint256 _unlockTime) external onlyOwner {
        unlockTime = _unlockTime;
    }

    function getBalance() external view returns (uint256) {
        return address(this).balance;
    }

    function getCurrentTime() external view returns (uint256) {
        return block.timestamp;
    }
}