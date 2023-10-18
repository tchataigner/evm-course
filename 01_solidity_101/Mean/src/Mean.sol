// SPDX-License-Identifier: BUSL-1.1
pragma solidity ^0.8.13;

contract Mean {
    /**
     * The goal of this exercise is to return the mean of the numbers in "arr"
     */
    function mean(uint256[] calldata arr) public view returns (uint256) {
	uint256 sum = 0;
	uint256 amount = 0;	
	for(uint j = 0; j < arr.length; j++) {
		amount += 1;
		sum += arr[j];
	}
	return sum/amount;
    }
}
