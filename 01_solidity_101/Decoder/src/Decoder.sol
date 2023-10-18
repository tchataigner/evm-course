// SPDX-License-Identifier: BUSL-1.1
pragma solidity ^0.8.13;

contract Decoder {
    /* This exercise assumes you know how abi decoding works.
        1. In the `decodeData` function below, write the logic that decodes a `bytes` data, based on the function parameters
        2. Return the decoded data
    */
    function decodeData(
        bytes memory _data
    ) public pure returns (string memory, uint256) {
        (string memory a, uint256 b) =  abi.decode(_data, (string, uint256));
        return (a, b);
    }
}

