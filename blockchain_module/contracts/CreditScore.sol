// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";

/// @notice Simple credit score registry. Trusted callers (SavingsPool/EmergencyPool) can update.
contract CreditScore is Ownable {
    mapping(address => uint256) private scores;
    mapping(address => bool) public trustedCaller;

    event TrustedCallerUpdated(address indexed who, bool allowed);
    event CreditScoreSet(address indexed user, uint256 score);
    event CreditScoreUpdated(address indexed user, uint256 newScore);
    event CreditScoreDecreased(address indexed user, uint256 newScore);

    modifier onlyTrusted() {
        require(trustedCaller[msg.sender] || msg.sender == owner(), "Not trusted");
        _;
    }

    function setTrustedCaller(address who, bool allowed) external onlyOwner {
        trustedCaller[who] = allowed;
        emit TrustedCallerUpdated(who, allowed);
    }

    function setInitial(address user, uint256 score) external onlyTrusted {
        require(scores[user] == 0, "Already set (use update)");
        scores[user] = score;
        emit CreditScoreSet(user, score);
    }

    function increaseCreditScore(address user, uint256 pts) external onlyTrusted {
        scores[user] += pts;
        emit CreditScoreUpdated(user, scores[user]);
    }

    function decreaseCreditScore(address user, uint256 pts) external onlyTrusted {
        uint256 cur = scores[user];
        if (pts >= cur) scores[user] = 0;
        else scores[user] = cur - pts;
        emit CreditScoreDecreased(user, scores[user]);
    }

    function getCreditScore(address user) external view returns (uint256) {
        return scores[user];
    }
}
