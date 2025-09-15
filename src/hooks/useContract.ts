import { useAccount, useReadContract, useWriteContract } from 'wagmi';
import { useState, useEffect } from 'react';

// Simplified Contract ABI for basic functionality
const CONTRACT_ABI = [
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
  }
] as const;

const CONTRACT_ADDRESS = import.meta.env.VITE_CONTRACT_ADDRESS || '0x0000000000000000000000000000000000000000';

export const useSecretTaskFlow = () => {
  const { address } = useAccount();
  const [isRegistered, setIsRegistered] = useState(false);

  // Check if user is registered
  const { data: contributorInfo } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: CONTRACT_ABI,
    functionName: 'getContributorInfo',
    args: address ? [address] : undefined,
    query: {
      enabled: !!address && CONTRACT_ADDRESS !== '0x0000000000000000000000000000000000000000',
    },
  });

  useEffect(() => {
    if (contributorInfo) {
      setIsRegistered(contributorInfo.isActive);
    }
  }, [contributorInfo]);

  // Contract write functions
  const { writeContract } = useWriteContract();

  const registerContributor = (encryptedProfile: string) => {
    if (CONTRACT_ADDRESS === '0x0000000000000000000000000000000000000000') {
      console.warn('Contract address not set. Please deploy the contract first.');
      return;
    }
    
    writeContract({
      address: CONTRACT_ADDRESS,
      abi: CONTRACT_ABI,
      functionName: 'registerContributor',
      args: [encryptedProfile],
    });
  };

  return {
    isRegistered,
    registerContributor,
    contractAddress: CONTRACT_ADDRESS,
  };
};