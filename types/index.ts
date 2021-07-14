import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/dist/src/signer-with-address";
import { MockContract } from "ethereum-waffle";
import { Contract } from "ethers";

import { Vesting } from '../typechain/Vesting'

export interface Contracts {
    vesting: Vesting;
}
 
export interface Signers {
    owner: SignerWithAddress;
    account1: SignerWithAddress;
}

export type VestingReturnType = {
    vesting: Contract,
    testToken: Contract
}
