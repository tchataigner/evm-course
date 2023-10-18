// SPDX-License-Identifier: BUSL-1.1
pragma solidity ^0.8.13;

contract Fibonacci {
    function fibonacci(uint256 _position) public pure returns (uint256) {
        if (_position == 0) {
            return 0;
        } else if (_position == 1 || _position == 2) {
            return 1;
        }

        uint256 first = 1;
        uint256 second = 1;
        uint256 next = 0;

        for (uint256 i = 3; i <= _position; i++) {
            next = first + second;
            first = second;
            second = next;
        }

        return next;
    }
}
