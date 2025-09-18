// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";

/// @notice Reputation registry. Trusted callers (SavingsPool / EmergencyPool) can update reputations.
contract Reputation is Ownable {
    struct User {
        uint256 score;            // 0..100 (or more if you want)
        uint256 lastContribution; // timestamp
        bool initialized;
    }

    mapping(address => User) private users;
    mapping(address => bool) public trustedCaller;

    uint256 public defaultInitial = 50;

    event TrustedCallerUpdated(address indexed who, bool allowed);
    event ReputationSet(address indexed user, uint256 score);
    event ReputationIncreased(address indexed user, uint256 newScore);
    event ReputationDecreased(address indexed user, uint256 newScore);
    event ContributionRecorded(address indexed user, uint256 timestamp);

    modifier onlyTrusted() {
        require(trustedCaller[msg.sender] || msg.sender == owner(), "Not trusted");
        _;
    }

    function setTrustedCaller(address who, bool allowed) external onlyOwner {
        trustedCaller[who] = allowed;
        emit TrustedCallerUpdated(who, allowed);
    }

    function setInitial(address user, uint256 score) external onlyTrusted {
        require(!users[user].initialized, "Already initialized");
        users[user] = User({score: score, lastContribution: block.timestamp, initialized: true});
        emit ReputationSet(user, score);
    }

    /// record that user made a contribution now; keeps on-chain history for grace checks
    function recordContribution(address user) external onlyTrusted {
        require(users[user].initialized, "Not initialized");
        users[user].lastContribution = block.timestamp;
        emit ContributionRecorded(user, block.timestamp);
    }

    function increaseReputation(address user, uint256 pts) external onlyTrusted {
        require(users[user].initialized, "Not initialized");
        uint256 s = users[user].score + pts;
        users[user].score = s;
        emit ReputationIncreased(user, s);
    }

    function decreaseReputation(address user, uint256 pts) external onlyTrusted {
        require(users[user].initialized, "Not initialized");
        uint256 current = users[user].score;
        uint256 s = pts >= current ? 0 : current - pts;
        users[user].score = s;
        emit ReputationDecreased(user, s);
    }

    // read-only helpers
    function getReputation(address user) external view returns (uint256) {
        if (!users[user].initialized) return 0;
        return users[user].score;
    }

    function getLastContribution(address user) external view returns (uint256) {
        if (!users[user].initialized) return 0;
        return users[user].lastContribution;
    }

    function isInitialized(address user) external view returns (bool) {
        return users[user].initialized;
    }

    // admin convenience
    function setDefaultInitial(uint256 v) external onlyOwner {
        defaultInitial = v;
    }
}
