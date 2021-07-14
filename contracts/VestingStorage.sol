//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

abstract contract VestingStorage {
    address public token;

    mapping(address => uint256) public allocations;
    mapping(address => uint256) public claimed;

    uint256 public startBlock;
    uint256 public endBlock;
}