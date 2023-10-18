// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract CodeSize {

    // Declare multiple state variables
    uint256[100] public numbers;
    string[50] public words;
    address[50] public addresses;

    constructor() {
        for (uint i = 0; i < 100; i++) {
            numbers[i] = i;
        }
    }

    function manipulateNumbers() public {
        for (uint i = 0; i < 100; i++) {
            numbers[i] = numbers[i] * 2;
        }
    }

    function storeWords(string memory _word, uint _index) public {
        words[_index] = _word;
    }

    function storeAddresses(address _address, uint _index) public {
        addresses[_index] = _address;
    }

    function calculateSum() public view returns (uint256) {
        uint256 sum = 0;
        for (uint i = 0; i < 100; i++) {
            sum += numbers[i];
        }
        return sum;
    }
}
