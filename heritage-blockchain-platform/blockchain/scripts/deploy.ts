import { network } from "hardhat";

async function main() {
  // Lấy ethers từ network instance giống như file test
  const { ethers } = await network.connect();

  console.log("Deploying HeritageRegistry contract...");
  const contract = await ethers.deployContract("HeritageRegistry");
  await contract.waitForDeployment();

  const contractAddress = await contract.getAddress();
  console.log(`HeritageRegistry deployed to: ${contractAddress}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
