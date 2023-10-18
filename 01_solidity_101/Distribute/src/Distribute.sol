// SPDX-License-Identifier: BUSL-1.1
pragma solidity ^0.8.13;

contract Distribute {
    /*
        This exercise assumes you know how to sending Ether.
        1. This contract has some ether in it, distribute it equally among the
           array of addresses that is passed as argument.
        2. Write your code in the `distributeEther` function.
    */


    event FractionDistributed(address target, uint256 amount);

    constructor() payable {}

    function distributeEther(address[] memory addresses) public {
        require(address(this).balance % addresses.length == 0, "must be divisble");
        uint256 amount = address(this).balance / addresses.length;
        for(uint8 j = 0; j < addresses.length; j++) {
            (bool ok,) = addresses[j].call{value: amount}("");
            if (ok) {
                emit FractionDistributed(addresses[j], amount);
            }
        }
    }
}
