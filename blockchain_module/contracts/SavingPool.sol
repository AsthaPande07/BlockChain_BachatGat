// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/utils/structs/EnumerableSet.sol";

import "./EmergencyPool.sol";
import "./Reputation.sol";
import "./CreditScore.sol";

contract SavingsPool is Ownable, ReentrancyGuard {
    using EnumerableSet for EnumerableSet.AddressSet;
    using SafeERC20 for IERC20;

    IERC20 public immutable token;
    EmergencyPool public emergencyPool;
    Reputation public reputation;
    CreditScore public creditScore;

    uint256 public contributionAmount;
    uint16 public chitShareBps; // e.g., 9000 = 90%
    uint256 public currentRound;
    uint256 public cycleNumber;
    uint256 public numPaidInCycle;
    uint256 public chitPoolBalance;

    EnumerableSet.AddressSet private members;
    mapping(address => uint256) public contributedRound;
    mapping(address => bool) public signedCommitment;
    mapping(address => uint256) public lastContributionTimestamp;
    mapping(address => uint256) public lastPaidCycle;

    // Grace & extra grace
    mapping(address => bool) public extraGraceUsed;
    mapping(address => uint256) public graceDeadline;
    uint256 public gracePeriod = 7 days;
    uint256 public extraGracePeriod = 3 days;
    uint256 public monthlyCycle = 30 days;
    uint256 public extraGraceReputationThreshold = 40;

    // ---------- events ----------
    event MemberRegistered(address indexed who);
    event CommitmentSigned(address indexed who);
    event ContributionReceived(address indexed who, uint256 amount, uint256 chitShare, uint256 insuranceShare, uint256 round);
    event AutoDebitFailed(address indexed who);
    event ExtraGraceRequested(address indexed who, uint256 newDeadline);
    event WinnerSelected(address indexed who, uint256 payout, uint256 round);

    constructor(
        IERC20 _token,
        uint256 _contributionAmount,
        uint16 _chitShareBps
    ) {
        require(_chitShareBps <= 10000, "bps>10000");
        token = _token;
        contributionAmount = _contributionAmount;
        chitShareBps = _chitShareBps;
        currentRound = 1;
        cycleNumber = 1;
    }

    // ---------- wires ----------
    function setEmergencyPool(address ep) external onlyOwner { emergencyPool = EmergencyPool(ep); }
    function setReputation(address rep) external onlyOwner { reputation = Reputation(rep); }
    function setCreditScore(address cs) external onlyOwner { creditScore = CreditScore(cs); }

    // ---------- registration ----------
    function registerMember() external {
        require(!members.contains(msg.sender), "already member");
        members.add(msg.sender);

        // initialize reputation
        if (address(reputation) != address(0)) {
            reputation.setInitial(msg.sender, 50);
            reputation.recordContribution(msg.sender);
        }

        emit MemberRegistered(msg.sender);
    }

    // ---------- commitment ----------
    function signCommitment() external {
        require(members.contains(msg.sender), "not member");
        signedCommitment[msg.sender] = true;
        emit CommitmentSigned(msg.sender);
    }



    // ---------- contribution ----------
    function contribute() external nonReentrant {
        require(members.contains(msg.sender), "not member");
        require(signedCommitment[msg.sender], "no commitment");
        require(contributedRound[msg.sender] != currentRound, "already contributed");

        token.safeTransferFrom(msg.sender, address(this), contributionAmount);

        uint256 chitShare = (contributionAmount * chitShareBps) / 10000;
        uint256 insuranceShare = contributionAmount - chitShare;

        chitPoolBalance += chitShare;
        if (address(emergencyPool) != address(0) && insuranceShare > 0) {
            token.safeTransfer(address(emergencyPool), insuranceShare);
            emergencyPool.receiveInsuranceContribution(insuranceShare);
        }

        contributedRound[msg.sender] = currentRound;
        lastContributionTimestamp[msg.sender] = block.timestamp;
        extraGraceUsed[msg.sender] = false;
        graceDeadline[msg.sender] = 0;

        if (address(reputation) != address(0)) {
            reputation.recordContribution(msg.sender);
            reputation.increaseReputation(msg.sender, 5);
        }

        emit ContributionReceived(msg.sender, contributionAmount, chitShare, insuranceShare, currentRound);
    }

    // ---------- auto-debit ----------
    function autoDebit(address member) external onlyOwner nonReentrant {
        require(members.contains(member), "not member");
        require(signedCommitment[member], "no commitment");
        if (contributedRound[member] == currentRound) return;

        try token.transferFrom(member, address(this), contributionAmount) {
            uint256 chitShare = (contributionAmount * chitShareBps) / 10000;
            uint256 insuranceShare = contributionAmount - chitShare;

            chitPoolBalance += chitShare;
            if (address(emergencyPool) != address(0) && insuranceShare > 0) {
                token.safeTransfer(address(emergencyPool), insuranceShare);
                emergencyPool.receiveInsuranceContribution(insuranceShare);
            }

            contributedRound[member] = currentRound;
            lastContributionTimestamp[member] = block.timestamp;
            extraGraceUsed[member] = false;
            graceDeadline[member] = 0;

            if (address(reputation) != address(0)) reputation.increaseReputation(member, 2);

            emit ContributionReceived(member, contributionAmount, chitShare, insuranceShare, currentRound);
        } catch {
            if (address(reputation) != address(0)) reputation.decreaseReputation(member, 2);
            emit AutoDebitFailed(member);
        }
    }
    

    // ---------- grace & extra grace ----------
    function markMissedAndStartGrace(address member) external onlyOwner {
        require(members.contains(member), "not member");
        require(contributedRound[member] != currentRound, "already contributed");
        graceDeadline[member] = block.timestamp + gracePeriod;
    }

    function requestExtraGrace() external {
        require(members.contains(msg.sender), "not member");
        require(graceDeadline[msg.sender] != 0, "grace not started");
        require(block.timestamp > graceDeadline[msg.sender], "still in normal grace");
        require(!extraGraceUsed[msg.sender], "already used extra grace");
        uint256 rep = address(reputation) != address(0) ? reputation.getReputation(msg.sender) : 0;
        require(rep >= extraGraceReputationThreshold, "reputation too low for extra grace");

        extraGraceUsed[msg.sender] = true;
        graceDeadline[msg.sender] = block.timestamp + extraGracePeriod;
        emit ExtraGraceRequested(msg.sender, graceDeadline[msg.sender]);
    }

    // ---------- winner selection ----------
    function drawWinner(uint256 externalRandom) external onlyOwner nonReentrant {
        address[] memory eligible = _getEligibleContributors();
        require(eligible.length > 0, "no eligible contributors");

        uint256[] memory claimIds = emergencyPool.getClaimsForRound(currentRound);
        address winner = address(0);
        uint256 verifiedCount = 0;

        for (uint i = 0; i < claimIds.length; i++) {
            EmergencyPool.Claim memory c = emergencyPool.getClaim(claimIds[i]);
            if (c.status == EmergencyPool.ClaimStatus.VERIFIED) {
                if (contributedRound[c.claimant] == currentRound && lastPaidCycle[c.claimant] != cycleNumber) {
                    if (winner == address(0) || creditScore.getCreditScore(c.claimant) > creditScore.getCreditScore(winner)) {
                        winner = c.claimant;
                    }
                    verifiedCount++;
                }
            }
        }

        if (verifiedCount == 0) {
            uint256 rand = uint256(keccak256(abi.encodePacked(externalRandom, block.timestamp, chitPoolBalance, currentRound)));
            winner = eligible[rand % eligible.length];
        }

        require(winner != address(0), "no winner");
        require(chitPoolBalance > 0, "no chit funds");

        uint256 payout = chitPoolBalance;
        chitPoolBalance = 0;
        token.safeTransfer(winner, payout);

        lastPaidCycle[winner] = cycleNumber;
        numPaidInCycle++;
        if (numPaidInCycle >= members.length()) {
            cycleNumber++;
            numPaidInCycle = 0;
        }

        currentRound++;

        if (address(reputation) != address(0)) reputation.increaseReputation(winner, 10);

        emit WinnerSelected(winner, payout, currentRound - 1);
    }

    // ---------- helpers ----------
    function _getEligibleContributors() internal view returns (address[] memory) {
        uint256 count = 0;
        for (uint i = 0; i < members.length(); i++) {
            address a = members.at(i);
            if (contributedRound[a] == currentRound && lastPaidCycle[a] != cycleNumber) count++;
        }
        address[] memory list = new address[](count);
        uint idx = 0;
        for (uint i = 0; i < members.length(); i++) {
            address a = members.at(i);
            if (contributedRound[a] == currentRound && lastPaidCycle[a] != cycleNumber) {
                list[idx++] = a;
            }
        }
        return list;
    }

    function raiseEmergency(bytes32 eventId, string calldata evidenceURI) external returns (uint256) {
        require(members.contains(msg.sender), "not member");
        return emergencyPool.submitClaim(eventId, evidenceURI, currentRound);
    }

    function fundChitPool(uint256 amount) external onlyOwner {
        token.safeTransferFrom(msg.sender, address(this), amount);
        chitPoolBalance += amount;
    }

    function getMembers() external view returns (address[] memory) {
        return members.values();
    }

    // ---------- admin setters ----------
    function setGracePeriod(uint256 seconds_) external onlyOwner { gracePeriod = seconds_; }
    function setExtraGracePeriod(uint256 seconds_) external onlyOwner { extraGracePeriod = seconds_; }
    function setMonthlyCycle(uint256 seconds_) external onlyOwner { monthlyCycle = seconds_; }
    function setExtraGraceReputationThreshold(uint256 v) external onlyOwner { extraGraceReputationThreshold = v; }
}
