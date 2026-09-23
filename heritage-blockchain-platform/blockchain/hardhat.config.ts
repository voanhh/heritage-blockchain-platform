import { config as loadEnv } from 'dotenv';
import { defineConfig, configVariable } from 'hardhat/config';
import hardhatVerify from '@nomicfoundation/hardhat-verify';

loadEnv();

export default defineConfig({
  plugins: [hardhatVerify],
  solidity: {
    version: '0.8.28',
    settings: {
      optimizer: {
        enabled: true,
        runs: 200
      }
    }
  },
  networks: {
    sepolia: {
      type: 'http',
      url: process.env.SEPOLIA_RPC_URL ?? '',
      accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : []
    }
  },
  verify: {
    etherscan: {
      apiKey: configVariable('ETHERSCAN_API_KEY'),
    }
  }
});

