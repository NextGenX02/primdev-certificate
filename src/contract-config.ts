import { ethers } from 'ethers';

interface ContractConfig {
  [key: number]: {
    address?: string;
    blockExplorerUrl?: string;
  };
}
// Contract configuration
const contractConfig: ContractConfig = {
  3: {
    address: import.meta.env.SNOWPACK_PUBLIC_CONTRACT_ADDRESS_ROPSTEN,
    blockExplorerUrl: 'https://ropsten.etherscan.io',
  },
  // the main problem for some reason this id (Chain ID) is not the same chain ID that
  // hardhat server use maybe the dev change the chain ID in the latest release or just typo
  // set this ID to correct chain ID fix the issue
  31337: {  // change from 1337 to 31337
    address: import.meta.env.SNOWPACK_PUBLIC_CONTRACT_ADDRESS_LOCAL,
  },
};

export function getContractConfig(
  provider: ethers.providers.Web3Provider | null,
) {
  if (!provider?.network?.chainId) return null;
  return contractConfig[provider.network.chainId];
}
