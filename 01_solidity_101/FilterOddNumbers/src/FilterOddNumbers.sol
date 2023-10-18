// SPDX-License-Identifier: BUSL-1.1
pragma solidity ^0.8.13;

contract FilterOddNumbers {
    /*
        This exercise assumes you understand how to manipulate Array.
        1. Function `filterOdd` takes an array of uint256 as argument. 
        2. Filter and return an array with the odd numbers removed.
        Note: this is tricky because you cannot allocate a dynamic array in memory, 
              you need to count the even numbers then declare an array of that size.
    */

    function filterOdd(uint256[] memory _arr)
        public
        view
        returns (uint256[] memory)
    {
        uint256 even = 0;
	for (uint256 j = 0; j < _arr.length; j++) {
		if (_arr[j] % 2 == 0) {
			even += 1;
		}
	}

	uint256 i = 0;	
	uint256[] memory even_arr = new uint256[](even);
	for (uint256 j = 0; j < _arr.length; j++) {
		if (_arr[j] % 2 == 0) {
			even_arr[i] = _arr[j];
			i += 1;
		}
	}
	return even_arr;
    }
}
