// SPDX-License-Identifier: BUSL-1.1
pragma solidity ^0.8.13;

contract IdiotBettingGame {

    uint256 private maxEther;
    address private candidate;
    uint256 private endTime;

    /*
        This exercise assumes you know how block.timestamp works.
        - Whoever deposits the most ether into a contract wins all the ether if no-one 
          else deposits after an hour.
        1. `bet` function allows users to deposit ether into the contract. 
           If the deposit is higher than the previous highest deposit, the endTime is 
           updated by current time + 1 hour, the highest deposit and winner are updated.
        2. `claimPrize` function can only be called by the winner after the betting 
           period has ended. It transfers the entire balance of the contract to the winner.
    */

    function bet() public payable {
        if (msg.value > maxEther) {
            maxEther = msg.value;
            candidate = msg.sender;
            endTime = block.timestamp + 1 hours;
        }
    }

    function claimPrize() public {
        require(block.timestamp > endTime && msg.sender == candidate);
        (bool ok,) = candidate.call{value: address(this).balance}("");
        require(ok, "TX failed");
    }
}
