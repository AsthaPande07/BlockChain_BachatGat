// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "@openzeppelin/contracts/access/Ownable.sol";

contract EmergencyHandling is Ownable {

    // Structure to store emergency claim details
    struct EmergencyClaim {
        uint id;
        address claimant;
        string emergencyType;
        string description;
        string documentURI;
        bool isVerified;
        bool isRejected;
        string rejectionReason;
    }

    uint public claimCounter = 0; // Counter for claims
    mapping(uint => EmergencyClaim) public claims; // Mapping to store claims by ID
    mapping(address => uint[]) public userClaims; // Mapping to store user’s claim IDs

    // Events for logging actions
    event ClaimSubmitted(uint id, address claimant);
    event ClaimVerified(uint id);
    event ClaimRejected(uint id, string reason);

    // Function to submit a new emergency claim
    function submitClaim(
        string memory _type, 
        string memory _description, 
        string memory _documentURI
    ) external {
        claimCounter++;
        EmergencyClaim storage newClaim = claims[claimCounter];
        newClaim.id = claimCounter;
        newClaim.claimant = msg.sender;
        newClaim.emergencyType = _type;
        newClaim.description = _description;
        newClaim.documentURI = _documentURI;
        newClaim.isVerified = false;
        newClaim.isRejected = false;

        userClaims[msg.sender].push(claimCounter);

        emit ClaimSubmitted(claimCounter, msg.sender);
    }

    // Function to verify a claim — only callable by the owner
    function verifyClaim(uint _id) external onlyOwner {
        EmergencyClaim storage claim = claims[_id];
        require(!claim.isVerified && !claim.isRejected, "Already processed");

        claim.isVerified = true;
        emit ClaimVerified(_id);
    }

    // Function to reject a claim with a reason — only callable by the owner
    function rejectClaim(uint _id, string memory _reason) external onlyOwner {
        EmergencyClaim storage claim = claims[_id];
        require(!claim.isVerified && !claim.isRejected, "Already processed");

        claim.isRejected = true;
        claim.rejectionReason = _reason;
        emit ClaimRejected(_id, _reason);
    }

    // Function to retrieve claim IDs submitted by a specific user
    function getUserClaims(address _user) external view returns (uint[] memory) {
        return userClaims[_user];
    }
}