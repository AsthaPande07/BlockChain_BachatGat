// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";

contract EmergencyPool is Ownable, ReentrancyGuard {
    using SafeERC20 for IERC20;

    IERC20 public immutable token; // set to mock stablecoin or IERC20(address(0)) if unused
    uint256 public insuranceBalance; // tokens held (if using token)

    enum ClaimStatus { NONE, SUBMITTED, VERIFIED, REJECTED, PAID }
    struct Claim {
        address claimant;
        uint256 round;
        bytes32 eventId;
        string evidenceURI;
        ClaimStatus status;
        uint256 submittedAt;
        uint256 verifiedAt;
    }

    uint256 public nextClaimId;
    mapping(uint256 => Claim) public claims;
    mapping(uint256 => uint256[]) public claimsByRound;
    mapping(address => uint256[]) public claimsByUser;

    event ClaimSubmitted(uint256 indexed claimId, address indexed who, uint256 round, bytes32 eventId);
    event ClaimVerified(uint256 indexed claimId, bool approved);
    event InsuranceReceived(address indexed from, uint256 amount);
    event InsuranceWithdrawn(address indexed to, uint256 amount);

    constructor(IERC20 _token) {
        token = _token;
    }

    // Submit a claim (called by member via SavingsPool helper or directly)
    function submitClaim(bytes32 eventId, string calldata evidenceURI, uint256 round) external returns (uint256) {
        uint256 id = ++nextClaimId;
        claims[id] = Claim({
            claimant: msg.sender,
            round: round,
            eventId: eventId,
            evidenceURI: evidenceURI,
            status: ClaimStatus.SUBMITTED,
            submittedAt: block.timestamp,
            verifiedAt: 0
        });
        claimsByRound[round].push(id);
        claimsByUser[msg.sender].push(id);
        emit ClaimSubmitted(id, msg.sender, round, eventId);
        return id;
    }

    // Owner/verifier approves or rejects (for hackathon use onlyOwner; replace with oracle/multisig later)
    function verifyClaim(uint256 claimId, bool approved) external onlyOwner {
        Claim storage c = claims[claimId];
        require(c.status == ClaimStatus.SUBMITTED, "bad state");
        c.status = approved ? ClaimStatus.VERIFIED : ClaimStatus.REJECTED;
        c.verifiedAt = block.timestamp;
        emit ClaimVerified(claimId, approved);
    }

    // Receive insurance token contributions (SavingsPool forwards insurance share here)
    function receiveInsuranceContribution(uint256 amount) external {
        // token must already be transferred to this contract by caller
        insuranceBalance += amount;
        emit InsuranceReceived(msg.sender, amount);
    }

    // Owner admin withdraw (demo only)
    function adminWithdrawInsurance(uint256 amount, address to) external onlyOwner nonReentrant {
        require(amount <= insuranceBalance, "insufficient");
        insuranceBalance -= amount;
        token.safeTransfer(to, amount);
        emit InsuranceWithdrawn(to, amount);
    }

    // Public getters
    function getClaimsForRound(uint256 round) external view returns (uint256[] memory) {
        return claimsByRound[round];
    }
    function getClaim(uint256 claimId) external view returns (Claim memory) {
        return claims[claimId];
    }
    function getClaimsOfUser(address who) external view returns (uint256[] memory) {
        return claimsByUser[who];
    }
}
