import { expect } from 'chai'
import { ethers } from 'hardhat'
import { CLAIM_NOT_AVAILABLE, CLAIM_NOT_STARTED, END_BLOCK, OWNERSHIP_ERROR, START_BLOCK, VESTING_ALLOCATION_ERROR, VESTING_AMOUNT_ERROR } from '../../helpers/constants'
import { mineBlocks } from '../../helpers/utils'
import { VestingReturnType } from '../../types'
import { unitFixtureVesting } from '../shared/fixtures' 

export function unitTestVesting(): void {
    describe("Vesting", function() {
        before(async function() {
            const { vesting, testToken }: VestingReturnType = await this.loadFixture(unitFixtureVesting)
            this.vesting = vesting;
            this.testToken = testToken
        })

        it('Amount should bigger than zero', async function() {
            await expect(
                this.vesting.connect(this.signers.owner)
                .allocate(this.signers.user2.address, 0)
            ).to.be.revertedWith(VESTING_AMOUNT_ERROR)
        })

        it('Allocate method ownership check', async function() {
            await expect(
                this.vesting.connect(this.signers.user1)
                .allocate(this.signers.user2.address, 0)
            ).to.be.revertedWith(OWNERSHIP_ERROR)            
        })

        it('Allocation status check', async function() {
            const tokenAllocateAmount = 1000;
            await this.testToken.approve(this.vesting.address, tokenAllocateAmount)
            
            await expect(
                this.vesting.connect(this.signers.owner)
                    .allocate(this.signers.user2.address, tokenAllocateAmount)
            ).to.emit(this.vesting, "Allocate")
            .withArgs(this.signers.user2.address, tokenAllocateAmount)

            await expect(
                this.vesting.connect(this.signers.owner)
                .allocate(this.signers.user2.address, tokenAllocateAmount)
            ).to.be.revertedWith(VESTING_ALLOCATION_ERROR)
        })

        it('Cannot claim before startBlock', async function() {
            await expect(
                this.vesting.connect(this.signers.user2)
                .claim()
            ).to.be.revertedWith(CLAIM_NOT_STARTED)
        })

        it('Cannot claim without allocation', async function() {
            await expect(
                this.vesting.connect(this.signers.user1)
                .claim()
            ).to.be.revertedWith(CLAIM_NOT_AVAILABLE)
        })

        it('Claim amount check', async function() {
            const beforeUser2Amount = await this.testToken.balanceOf(this.signers.user2.address)
            const currentBlockNumber = await ethers.provider.getBlockNumber()
            const advanceBlockNumber = START_BLOCK - currentBlockNumber + 2000
            // mine 2000 blocks, total duration is 10000
            // user2 has 1000 allocation so he should get 200
            await mineBlocks(advanceBlockNumber)
            await expect(this.vesting.connect(this.signers.user2)
            .claim()
            ).to.emit(this.vesting, "Claim")
            .withArgs(this.signers.user2.address, 200)

            const afterUser2Amount = await this.testToken.balanceOf(this.signers.user2.address)
            expect(afterUser2Amount - beforeUser2Amount).to.be.equal(200)
        })

        it('Should Claim after END_BLOCK', async function() {
            await mineBlocks(END_BLOCK)

            // rest amount is 1000 - 200 = 800
            await expect(this.vesting.connect(this.signers.user2)
                .claim()
            ).to.emit(this.vesting, "Claim")
            .withArgs(this.signers.user2.address, 800)
        })

    })
}