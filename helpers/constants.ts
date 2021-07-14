import { BigNumber } from "@ethersproject/bignumber";
import { bn } from "./numbers";

export const GAS_LIMIT_HARDHAT: BigNumber = bn("1e8");
export const GAS_LIMIT_COVERAGE: BigNumber = bn("5e8");

export const START_BLOCK = 10000
export const END_BLOCK = 20000

export const OWNERSHIP_ERROR = "Ownable: caller is not the owner";

export const VESTING_AMOUNT_ERROR = "Amount should bigger than zero";
export const VESTING_ALLOCATION_ERROR = "Vesting is already scheduled";

export const CLAIM_NOT_STARTED = "Vesting is not started yet";
export const CLAIM_NOT_AVAILABLE = "No allocation available";