// SPDX-License-Identifier: BUSL-1.1
pragma solidity ^0.8.13;

contract OneWeekLockup {

    mapping(address => uint256) balances;
    mapping(address => uint256) depositTimes;

    /**
     * In this exercise you are expected to create functions that let users deposit ether
     * Users can also withdraw their ether (not more than their deposit) but should only be able to do a week after their last deposit
     * Consider edge cases by which users might utilize to deposit ether
     *
     * Required function
     * - depositEther()
     * - withdrawEther(uint256 )
     * - balanceOf(address )
     */

    function balanceOf(address user) public view returns (uint256) {
        return balances[user];
    }

    function depositEther() external payable {
        balances[msg.sender] += msg.value;
        depositTimes[msg.sender] = block.timestamp;
    }

    function withdrawEther(uint256 amount) external {
        require(block.timestamp >= (depositTimes[msg.sender] + 7 days) && balances[msg.sender] >= amount);
        (bool ok, ) = msg.sender.call{value: balances[msg.sender]}("");
        require(ok, "Tx failed");
    }
}
