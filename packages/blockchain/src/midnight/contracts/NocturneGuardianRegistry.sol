// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract NocturneGuardianRegistry {
    struct GuardianDecision {
        bytes32 intentHash;
        uint8 riskScore;
        bool approved;
        uint256 timestamp;
    }

    // Mapping from intent hash to decision
    mapping(bytes32 => GuardianDecision) private decisions;

    event DecisionRecorded(bytes32 indexed intentHash, uint8 riskScore, bool approved);

    /**
     * @dev Record a guardian decision
     * @param intentHash Hash of the transaction intent
     * @param riskScore Quantitative risk score (0-100)
     * @param approved Whether the transaction was approved
     */
    function recordDecision(bytes32 intentHash, uint8 riskScore, bool approved) external {
        // Prevent overwriting existing decisions
        require(decisions[intentHash].timestamp == 0, "Decision already recorded");
        
        decisions[intentHash] = GuardianDecision({
            intentHash: intentHash,
            riskScore: riskScore,
            approved: approved,
            timestamp: block.timestamp
        });

        emit DecisionRecorded(intentHash, riskScore, approved);
    }

    /**
     * @dev Get a recorded decision
     * @param intentHash Hash of the transaction intent
     * @return GuardianDecision struct
     */
    function getDecision(bytes32 intentHash) external view returns (GuardianDecision memory) {
        require(decisions[intentHash].timestamp != 0, "Decision not found");
        return decisions[intentHash];
    }

    /**
     * @dev Verify if a decision is approved
     * @param intentHash Hash of the transaction intent
     * @return true if approved
     */
    function verifyDecision(bytes32 intentHash) external view returns (bool) {
        require(decisions[intentHash].timestamp != 0, "Decision not found");
        return decisions[intentHash].approved;
    }
}
