import { useContract, useContractRead, useContractWrite, useAccount } from 'wagmi';
import { useState, useEffect } from 'react';

// Contract ABI - This would be generated from the compiled contract
const CONTRACT_ABI = [
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "_verifier",
        "type": "address"
      }
    ],
    "stateMutability": "nonpayable",
    "type": "constructor"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "contributor",
        "type": "address"
      }
    ],
    "name": "ContributorRegistered",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "uint256",
        "name": "taskId",
        "type": "uint256"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "assignee",
        "type": "address"
      }
    ],
    "name": "TaskAssigned",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "uint256",
        "name": "taskId",
        "type": "uint256"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "assignee",
        "type": "address"
      }
    ],
    "name": "TaskCompleted",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "uint256",
        "name": "taskId",
        "type": "uint256"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "creator",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "string",
        "name": "title",
        "type": "string"
      }
    ],
    "name": "TaskCreated",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "uint256",
        "name": "taskId",
        "type": "uint256"
      },
      {
        "indexed": true,
        "internalType": "uint256",
        "name": "submissionId",
        "type": "uint256"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "submitter",
        "type": "address"
      }
    ],
    "name": "TaskSubmitted",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "uint256",
        "name": "taskId",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "bool",
        "name": "isVerified",
        "type": "bool"
      }
    ],
    "name": "TaskVerified",
    "type": "event"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "contributor",
        "type": "address"
      }
    ],
    "name": "activateContributor",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "taskId",
        "type": "uint256"
      },
      {
        "internalType": "address",
        "name": "assignee",
        "type": "address"
      }
    ],
    "name": "assignTask",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "taskId",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "actualHours",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "completionPercentage",
        "type": "uint256"
      }
    ],
    "name": "completeTask",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "contributor",
        "type": "address"
      }
    ],
    "name": "deactivateContributor",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "contributor",
        "type": "address"
      }
    ],
    "name": "getContributorInfo",
    "outputs": [
      {
        "internalType": "bool",
        "name": "isActive",
        "type": "bool"
      },
      {
        "internalType": "string",
        "name": "encryptedProfile",
        "type": "string"
      },
      {
        "internalType": "uint256",
        "name": "joinedAt",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "contributor",
        "type": "address"
      }
    ],
    "name": "getContributorReputation",
    "outputs": [
      {
        "internalType": "uint8",
        "name": "",
        "type": "uint8"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "submissionId",
        "type": "uint256"
      }
    ],
    "name": "getSubmissionInfo",
    "outputs": [
      {
        "internalType": "bool",
        "name": "isApproved",
        "type": "bool"
      },
      {
        "internalType": "string",
        "name": "submissionHash",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "feedback",
        "type": "string"
      },
      {
        "internalType": "address",
        "name": "submitter",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "submittedAt",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "taskId",
        "type": "uint256"
      }
    ],
    "name": "getTaskInfo",
    "outputs": [
      {
        "internalType": "string",
        "name": "title",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "description",
        "type": "string"
      },
      {
        "internalType": "bool",
        "name": "isActive",
        "type": "bool"
      },
      {
        "internalType": "bool",
        "name": "isCompleted",
        "type": "bool"
      },
      {
        "internalType": "bool",
        "name": "isVerified",
        "type": "bool"
      },
      {
        "internalType": "address",
        "name": "assignee",
        "type": "address"
      },
      {
        "internalType": "address",
        "name": "creator",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "createdAt",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "deadline",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "completedAt",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "contributor",
        "type": "address"
      }
    ],
    "name": "getTaskCount",
    "outputs": [
      {
        "internalType": "uint8",
        "name": "",
        "type": "uint8"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "owner",
    "outputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "string",
        "name": "encryptedProfile",
        "type": "string"
      }
    ],
    "name": "registerContributor",
    "outputs": [
      {
        "internalType": "bool",
        "name": "",
        "type": "bool"
      }
    ],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "taskId",
        "type": "uint256"
      },
      {
        "internalType": "string",
        "name": "submissionHash",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "feedback",
        "type": "string"
      }
    ],
    "name": "submitTask",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "taskCounter",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "name": "tasks",
    "outputs": [
      {
        "internalType": "uint32",
        "name": "taskId",
        "type": "uint32"
      },
      {
        "internalType": "uint32",
        "name": "priority",
        "type": "uint32"
      },
      {
        "internalType": "uint32",
        "name": "estimatedHours",
        "type": "uint32"
      },
      {
        "internalType": "uint32",
        "name": "actualHours",
        "type": "uint32"
      },
      {
        "internalType": "uint32",
        "name": "completionPercentage",
        "type": "uint32"
      },
      {
        "internalType": "bool",
        "name": "isActive",
        "type": "bool"
      },
      {
        "internalType": "bool",
        "name": "isCompleted",
        "type": "bool"
      },
      {
        "internalType": "bool",
        "name": "isVerified",
        "type": "bool"
      },
      {
        "internalType": "string",
        "name": "title",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "description",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "encryptedDetails",
        "type": "string"
      },
      {
        "internalType": "address",
        "name": "assignee",
        "type": "address"
      },
      {
        "internalType": "address",
        "name": "creator",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "createdAt",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "deadline",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "completedAt",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "verifier",
    "outputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "taskId",
        "type": "uint256"
      },
      {
        "internalType": "bool",
        "name": "isVerified",
        "type": "bool"
      }
    ],
    "name": "verifyTask",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  }
] as const;

const CONTRACT_ADDRESS = import.meta.env.VITE_CONTRACT_ADDRESS || '0x0000000000000000000000000000000000000000';

export const useSecretTaskFlow = () => {
  const { address } = useAccount();
  const [isRegistered, setIsRegistered] = useState(false);

  const contract = useContract({
    address: CONTRACT_ADDRESS,
    abi: CONTRACT_ABI,
  });

  // Check if user is registered
  const { data: contributorInfo } = useContractRead({
    address: CONTRACT_ADDRESS,
    abi: CONTRACT_ABI,
    functionName: 'getContributorInfo',
    args: address ? [address] : undefined,
    enabled: !!address,
  });

  useEffect(() => {
    if (contributorInfo) {
      setIsRegistered(contributorInfo.isActive);
    }
  }, [contributorInfo]);

  // Contract write functions
  const { write: registerContributor } = useContractWrite({
    address: CONTRACT_ADDRESS,
    abi: CONTRACT_ABI,
    functionName: 'registerContributor',
  });

  const { write: createTask } = useContractWrite({
    address: CONTRACT_ADDRESS,
    abi: CONTRACT_ABI,
    functionName: 'createTask',
  });

  const { write: assignTask } = useContractWrite({
    address: CONTRACT_ADDRESS,
    abi: CONTRACT_ABI,
    functionName: 'assignTask',
  });

  const { write: submitTask } = useContractWrite({
    address: CONTRACT_ADDRESS,
    abi: CONTRACT_ABI,
    functionName: 'submitTask',
  });

  const { write: completeTask } = useContractWrite({
    address: CONTRACT_ADDRESS,
    abi: CONTRACT_ABI,
    functionName: 'completeTask',
  });

  return {
    contract,
    isRegistered,
    registerContributor,
    createTask,
    assignTask,
    submitTask,
    completeTask,
  };
};
