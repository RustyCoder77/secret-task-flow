// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import { SepoliaConfig } from "@fhevm/solidity/config/ZamaConfig.sol";
import { euint32, externalEuint32, euint8, ebool, FHE } from "@fhevm/solidity/lib/FHE.sol";

contract SecretTaskFlow is SepoliaConfig {
    using FHE for *;
    
    struct Task {
        euint32 taskId;
        euint32 priority;
        euint32 estimatedHours;
        euint32 actualHours;
        euint32 completionPercentage;
        bool isActive;
        bool isCompleted;
        bool isVerified;
        string title;
        string description;
        string encryptedDetails;
        address assignee;
        address creator;
        uint256 createdAt;
        uint256 deadline;
        uint256 completedAt;
    }
    
    struct TaskSubmission {
        euint32 submissionId;
        euint32 qualityScore;
        euint32 effortScore;
        bool isApproved;
        string submissionHash;
        string feedback;
        address submitter;
        uint256 submittedAt;
    }
    
    struct Contributor {
        euint32 reputation;
        euint32 totalTasksCompleted;
        euint32 averageQuality;
        bool isActive;
        address wallet;
        string encryptedProfile;
        uint256 joinedAt;
    }
    
    mapping(uint256 => Task) public tasks;
    mapping(uint256 => TaskSubmission) public submissions;
    mapping(address => Contributor) public contributors;
    mapping(address => euint32) public contributorReputation;
    mapping(address => euint32) public taskCount;
    
    uint256 public taskCounter;
    uint256 public submissionCounter;
    
    address public owner;
    address public verifier;
    
    event TaskCreated(uint256 indexed taskId, address indexed creator, string title);
    event TaskAssigned(uint256 indexed taskId, address indexed assignee);
    event TaskSubmitted(uint256 indexed taskId, uint256 indexed submissionId, address indexed submitter);
    event TaskCompleted(uint256 indexed taskId, address indexed assignee);
    event TaskVerified(uint256 indexed taskId, bool isVerified);
    event ReputationUpdated(address indexed contributor, uint32 reputation);
    event ContributorRegistered(address indexed contributor);
    
    constructor(address _verifier) {
        owner = msg.sender;
        verifier = _verifier;
    }
    
    function registerContributor(
        string memory encryptedProfile
    ) public returns (bool) {
        require(contributors[msg.sender].wallet == address(0), "Contributor already registered");
        
        contributors[msg.sender] = Contributor({
            reputation: FHE.asEuint32(100), // Initial reputation
            totalTasksCompleted: FHE.asEuint32(0),
            averageQuality: FHE.asEuint32(0),
            isActive: true,
            wallet: msg.sender,
            encryptedProfile: encryptedProfile,
            joinedAt: block.timestamp
        });
        
        emit ContributorRegistered(msg.sender);
        return true;
    }
    
    function createTask(
        string memory _title,
        string memory _description,
        string memory _encryptedDetails,
        uint256 _deadline,
        externalEuint32 priority,
        externalEuint32 estimatedHours,
        bytes calldata inputProof
    ) public returns (uint256) {
        require(bytes(_title).length > 0, "Task title cannot be empty");
        require(_deadline > block.timestamp, "Deadline must be in the future");
        require(contributors[msg.sender].wallet != address(0), "Creator must be registered");
        
        uint256 taskId = taskCounter++;
        
        // Convert externalEuint32 to euint32 using FHE.fromExternal
        euint32 internalPriority = FHE.fromExternal(priority, inputProof);
        euint32 internalEstimatedHours = FHE.fromExternal(estimatedHours, inputProof);
        
        tasks[taskId] = Task({
            taskId: FHE.asEuint32(0), // Will be set properly later
            priority: internalPriority,
            estimatedHours: internalEstimatedHours,
            actualHours: FHE.asEuint32(0),
            completionPercentage: FHE.asEuint32(0),
            isActive: true,
            isCompleted: false,
            isVerified: false,
            title: _title,
            description: _description,
            encryptedDetails: _encryptedDetails,
            assignee: address(0),
            creator: msg.sender,
            createdAt: block.timestamp,
            deadline: _deadline,
            completedAt: 0
        });
        
        emit TaskCreated(taskId, msg.sender, _title);
        return taskId;
    }
    
    function assignTask(
        uint256 taskId,
        address assignee
    ) public {
        require(tasks[taskId].creator == msg.sender, "Only creator can assign task");
        require(tasks[taskId].isActive, "Task must be active");
        require(contributors[assignee].wallet != address(0), "Assignee must be registered");
        require(contributors[assignee].isActive, "Assignee must be active");
        
        tasks[taskId].assignee = assignee;
        emit TaskAssigned(taskId, assignee);
    }
    
    function submitTask(
        uint256 taskId,
        externalEuint32 qualityScore,
        externalEuint32 effortScore,
        string memory submissionHash,
        string memory feedback,
        bytes calldata inputProof
    ) public returns (uint256) {
        require(tasks[taskId].assignee == msg.sender, "Only assignee can submit task");
        require(tasks[taskId].isActive, "Task must be active");
        require(!tasks[taskId].isCompleted, "Task already completed");
        
        uint256 submissionId = submissionCounter++;
        
        // Convert externalEuint32 to euint32 using FHE.fromExternal
        euint32 internalQualityScore = FHE.fromExternal(qualityScore, inputProof);
        euint32 internalEffortScore = FHE.fromExternal(effortScore, inputProof);
        
        submissions[submissionId] = TaskSubmission({
            submissionId: FHE.asEuint32(0), // Will be set properly later
            qualityScore: internalQualityScore,
            effortScore: internalEffortScore,
            isApproved: false,
            submissionHash: submissionHash,
            feedback: feedback,
            submitter: msg.sender,
            submittedAt: block.timestamp
        });
        
        emit TaskSubmitted(taskId, submissionId, msg.sender);
        return submissionId;
    }
    
    function completeTask(
        uint256 taskId,
        externalEuint32 actualHours,
        externalEuint32 completionPercentage,
        bytes calldata inputProof
    ) public {
        require(tasks[taskId].assignee == msg.sender, "Only assignee can complete task");
        require(tasks[taskId].isActive, "Task must be active");
        require(!tasks[taskId].isCompleted, "Task already completed");
        
        // Convert externalEuint32 to euint32 using FHE.fromExternal
        euint32 internalActualHours = FHE.fromExternal(actualHours, inputProof);
        euint32 internalCompletionPercentage = FHE.fromExternal(completionPercentage, inputProof);
        
        tasks[taskId].actualHours = internalActualHours;
        tasks[taskId].completionPercentage = internalCompletionPercentage;
        tasks[taskId].isCompleted = true;
        tasks[taskId].completedAt = block.timestamp;
        
        // Update contributor stats
        contributors[msg.sender].totalTasksCompleted = FHE.add(
            contributors[msg.sender].totalTasksCompleted, 
            FHE.asEuint32(1)
        );
        
        emit TaskCompleted(taskId, msg.sender);
    }
    
    function verifyTask(
        uint256 taskId,
        bool isVerified
    ) public {
        require(msg.sender == verifier, "Only verifier can verify tasks");
        require(tasks[taskId].creator != address(0), "Task does not exist");
        require(tasks[taskId].isCompleted, "Task must be completed first");
        
        tasks[taskId].isVerified = isVerified;
        emit TaskVerified(taskId, isVerified);
    }
    
    function updateReputation(
        address contributor,
        externalEuint32 reputation,
        bytes calldata inputProof
    ) public {
        require(msg.sender == verifier, "Only verifier can update reputation");
        require(contributors[contributor].wallet != address(0), "Contributor must be registered");
        
        // Convert externalEuint32 to euint32 using FHE.fromExternal
        euint32 internalReputation = FHE.fromExternal(reputation, inputProof);
        
        contributors[contributor].reputation = internalReputation;
        contributorReputation[contributor] = internalReputation;
        
        emit ReputationUpdated(contributor, 0); // FHE.decrypt(reputation) - will be decrypted off-chain
    }
    
    function getTaskInfo(uint256 taskId) public view returns (
        string memory title,
        string memory description,
        bool isActive,
        bool isCompleted,
        bool isVerified,
        address assignee,
        address creator,
        uint256 createdAt,
        uint256 deadline,
        uint256 completedAt
    ) {
        Task storage task = tasks[taskId];
        return (
            task.title,
            task.description,
            task.isActive,
            task.isCompleted,
            task.isVerified,
            task.assignee,
            task.creator,
            task.createdAt,
            task.deadline,
            task.completedAt
        );
    }
    
    function getSubmissionInfo(uint256 submissionId) public view returns (
        bool isApproved,
        string memory submissionHash,
        string memory feedback,
        address submitter,
        uint256 submittedAt
    ) {
        TaskSubmission storage submission = submissions[submissionId];
        return (
            submission.isApproved,
            submission.submissionHash,
            submission.feedback,
            submission.submitter,
            submission.submittedAt
        );
    }
    
    function getContributorInfo(address contributor) public view returns (
        bool isActive,
        string memory encryptedProfile,
        uint256 joinedAt
    ) {
        Contributor storage contrib = contributors[contributor];
        return (
            contrib.isActive,
            contrib.encryptedProfile,
            contrib.joinedAt
        );
    }
    
    function getContributorReputation(address contributor) public view returns (uint8) {
        return 0; // FHE.decrypt(contributorReputation[contributor]) - will be decrypted off-chain
    }
    
    function getTaskCount(address contributor) public view returns (uint8) {
        return 0; // FHE.decrypt(taskCount[contributor]) - will be decrypted off-chain
    }
    
    function deactivateContributor(address contributor) public {
        require(msg.sender == owner || msg.sender == verifier, "Only owner or verifier can deactivate");
        require(contributors[contributor].wallet != address(0), "Contributor must be registered");
        
        contributors[contributor].isActive = false;
    }
    
    function activateContributor(address contributor) public {
        require(msg.sender == owner || msg.sender == verifier, "Only owner or verifier can activate");
        require(contributors[contributor].wallet != address(0), "Contributor must be registered");
        
        contributors[contributor].isActive = true;
    }
}
