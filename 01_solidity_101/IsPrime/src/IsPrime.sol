// SPDX-License-Identifier: BUSL-1.1
pragma solidity ^0.8.13;

contract IsPrime {
    function isPrime(uint256 number) public pure returns (bool) {
        // 1 expected as prime...
        if (number <= 2 && number != 0) {
            return true;
        }
        if (number % 2 == 0) {
            return false;
        }

        // Check divisibility by odd numbers up to the square root of the number
        for (uint256 i = 3; i * i <= number; i += 2) {
            if (number % i == 0) {
                return false;
            }
        }
        return true;
    }
}
