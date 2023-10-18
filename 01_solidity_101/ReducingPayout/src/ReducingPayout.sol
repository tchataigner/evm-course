// SPDX-License-Identifier: BUSL-1.1
pragma solidity ^0.8.13;

contract ReducingPayout {
    /*
        This exercise assumes you know how block.timestamp works.
        1. This contract has 1 ether in it, each second that goes by,
           the amount that can be withdrawn by the caller goes from 100% to 0% as 24 hours passes.
        2. Implement your logic in `withdraw` function.
        Hint: 1 second deducts 0.0011574% from the current %.
    */

    // The time 1 ether was sent to this contract
    uint256 public immutable depositedTime;

    constructor() payable {
        depositedTime = block.timestamp;
    }

    function withdraw() public {
        uint256 secondsBetween = block.timestamp - depositedTime;
        uint256 allowance = secondsBetween == 24 hours ? 0 : address(this).balance - ((secondsBetween * 0.0011574 ether) / 100);
        (bool ok,) = msg.sender.call{value: allowance}("");
        require(ok, "TX failed");
    }
}
