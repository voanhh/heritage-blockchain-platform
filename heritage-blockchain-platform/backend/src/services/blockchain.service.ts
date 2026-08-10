import { Contract, JsonRpcProvider, Wallet } from 'ethers';

const heritageRegistryAbi = [
  'function registerHeritage(string heritageId, bytes32 dataHash, uint256 version) external',
  'function updateHeritage(string heritageId, bytes32 dataHash, uint256 version) external',
  'function verifyHeritage(string heritageId, bytes32 dataHash, uint256 version) external',
  'function getHeritage(string heritageId) external view returns (string, bytes32, uint256, address, uint256)'
];

export class BlockchainService {
  getContract() {
    const rpcUrl = process.env.BLOCKCHAIN_RPC_URL;
    const privateKey = process.env.BLOCKCHAIN_PRIVATE_KEY;
    const contractAddress = process.env.HERITAGE_CONTRACT_ADDRESS;

    if (!rpcUrl || !privateKey || !contractAddress) {
      throw new Error('Blockchain environment variables are not configured.');
    }

    const provider = new JsonRpcProvider(rpcUrl);
    const signer = new Wallet(privateKey, provider);
    return new Contract(contractAddress, heritageRegistryAbi, signer);
  }
}

