import { ethers } from 'hardhat';

async function main() {
  const registry = await ethers.deployContract('HeritageRegistry');
  await registry.waitForDeployment();

  console.log(`HeritageRegistry deployed to ${await registry.getAddress()}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

