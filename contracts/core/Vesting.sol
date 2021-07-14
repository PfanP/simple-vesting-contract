//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";

import "hardhat/console.sol";
import "../interfaces/IVesting.sol";
import "../VestingStorage.sol";

/// @notice Vesting
/// @author Khanh
/// @dev for upgradable, we inherited stroage contract
contract Vesting is
  Ownable,
  IVesting, // no dependency
  VestingStorage  // no dependency
{

  using SafeMath for uint256;

  constructor(address _token, uint256 _startBlock, uint256 _endBlock) Ownable() {
    token = _token;
    startBlock = _startBlock;
    endBlock = _endBlock;
  }

  /// @inheritdoc IVesting
  function allocate(address _address, uint256 _amount) external override onlyOwner {
    // Checks: amount and current allocation
    require(_amount != 0, "Amount should bigger than zero");
    require(allocations[_address] == 0, "Vesting is already scheduled");
    
    // Effects: udpate allocation
    allocations[_address] = _amount;
    
    // Checks: allocation 
    require(IERC20(token).transferFrom(
      msg.sender,
      address(this),
      _amount
    ), "Transfer: allocation transfer failed");

    emit Allocate(_address, _amount);
  }

// @inheritdoc IVesting
  function claim() external override {
    // Checks: allocation and start time
    require(allocations[msg.sender] > 0, "No allocation available");
    require(block.number > startBlock, "Vesting is not started yet");
    require(allocations[msg.sender] > claimed[msg.sender], "Noting remained to claim");

    uint256 correctEndBlock = block.number > endBlock ? endBlock : block.number;
    // Effects: reward proper amount of allocation
    uint256 claimableAmount = 
      allocations[msg.sender] * 
      (correctEndBlock - startBlock) / 
      (endBlock - startBlock) -
      claimed[msg.sender];
    
    // Checks: claimable token transfer
    require(IERC20(token).transfer(
      msg.sender,
      claimableAmount
    ), "Transfer: claim transfer failed");
    claimed[msg.sender] = claimableAmount;
    emit Claim(msg.sender, claimableAmount);
  }
}
