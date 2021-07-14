import { ethers, network } from 'hardhat'

export const units = (value: number) => ethers.utils.parseUnits(value.toString());

export const mineBlocks = async (blockCount: number) => {
  for (let i = 0; i < blockCount; ++i) {
    await network.provider.send("evm_mine");
  }
};