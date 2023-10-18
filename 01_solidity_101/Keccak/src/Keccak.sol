// SPDX-License-Identifier: BUSL-1.1
pragma solidity ^0.8.13;

contract Keccak {
    function keccak(uint256 x) external pure returns (bytes32) {
        return keccak256(abi.encodePacked(x));
    }
}
