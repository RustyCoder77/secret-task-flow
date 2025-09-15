const { ethers } = require("hardhat");

async function main() {
  console.log("Deploying SecretTaskFlow contract...");

  // Get the contract factory
  const SecretTaskFlow = await ethers.getContractFactory("SecretTaskFlow");

  // Deploy the contract with a verifier address (you can change this)
  const verifierAddress = "0x1234567890123456789012345678901234567890"; // Replace with actual verifier address
  
  const secretTaskFlow = await SecretTaskFlow.deploy(verifierAddress);

  await secretTaskFlow.waitForDeployment();

  const contractAddress = await secretTaskFlow.getAddress();
  
  console.log("SecretTaskFlow deployed to:", contractAddress);
  console.log("Verifier address:", verifierAddress);
  
  // Save deployment info
  const deploymentInfo = {
    contractAddress: contractAddress,
    verifierAddress: verifierAddress,
    network: "sepolia",
    deployedAt: new Date().toISOString(),
    deployer: await secretTaskFlow.runner.getAddress()
  };
  
  const fs = require('fs');
  fs.writeFileSync(
    'deployment-info.json', 
    JSON.stringify(deploymentInfo, null, 2)
  );
  
  console.log("Deployment info saved to deployment-info.json");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
