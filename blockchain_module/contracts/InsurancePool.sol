// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";

contract InsurancePool is Ownable {
    mapping(address => uint256) public balances;
    uint256 public totalPool;

    event Contribution(address member, uint256 amount);
    event Payout(address member, uint256 amount);

    constructor() Ownable() {}

    function contribute() external payable {
        balances[msg.sender] += msg.value;
        totalPool += msg.value;
        emit Contribution(msg.sender, msg.value);
    }

    // Simulated oracle trigger
    function triggerEmergencyPayout(address[] calldata members, uint256 amountPerMember) external onlyOwner {
        require(totalPool >= members.length * amountPerMember, "Not enough funds");

        for (uint256 i = 0; i < members.length; i++) {
            payable(members[i]).transfer(amountPerMember);
            emit Payout(members[i], amountPerMember);
        }

        totalPool -= members.length * amountPerMember;
    }
}