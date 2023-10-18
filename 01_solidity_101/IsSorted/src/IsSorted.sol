// SPDX-License-Identifier: BUSL-1.1
pragma solidity ^0.8.13;

contract IsSorted {
	function isSorted(uint256[] calldata arr) public pure returns (bool) {
		// If the array has 0 or 1 elements, it's technically sorted
		if (arr.length <= 1) {
			return true;
		}

		// Iterate through the array and check if it's sorted in ascending order
		for (uint256 i = 0; i < arr.length - 1; i++) {
			if (arr[i] > arr[i + 1]) {
				return false;
			}
		}
		return true;
	}
}
