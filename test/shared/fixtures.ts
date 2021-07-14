import { Contract } from "ethers"
import { ethers } from "hardhat";
import { Signer } from "@ethersproject/abstract-signer";
import { START_BLOCK, END_BLOCK } from "../../helpers/constants";
import { VestingReturnType } from "../../types";

export async function unitFixtureVesting(signers: Signer[]): Promise<VestingReturnType> {
    const TestToken = await ethers.getContractFactory("MockERC20");
    const testToken = await TestToken.connect(signers[0]).deploy(
        "Test",
        "TT",
        100000
    )
    await testToken.deployed();

    const Vesting = await ethers.getContractFactory("Vesting");
    const vesting = await Vesting.connect(signers[0]).deploy(
        testToken.address,
        START_BLOCK,
        END_BLOCK
    );
    await vesting.deployed();

    return { vesting, testToken };
}
