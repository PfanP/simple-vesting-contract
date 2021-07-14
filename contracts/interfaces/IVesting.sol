//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

interface IVesting {
    event Allocate(address indexed user, uint256 amount);
    event Claim(address indexed user, uint256 amount);

    function allocate(address, uint256) external;
    function claim() external;
}