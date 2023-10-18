// SPDX-License-Identifier: BUSL-1.1
pragma solidity ^0.8.13;

contract TimelockEscrow {
    address public seller;

    struct BuyOrder {
        uint256 amount;
        uint256 timestamp;
    }

    mapping(address => BuyOrder) buyOrders;

    /**
     * The goal of this exercise is to create a Time lock escrow.
     * A buyer deposits ether into a contract, and the seller cannot withdraw it until 3 days passes. Before that, the buyer can take it back
     * Assume the owner is the seller
     */

    constructor() {
        seller = msg.sender;
    }

    // creates a buy order between msg.sender and seller
    /**
     * escrows msg.value for 3 days which buyer can withdraw at anytime before 3 days but afterwhich only seller can withdraw
     * should revert if an active escrow still exist or last escrow hasn't been withdrawn
     */
    function createBuyOrder() external payable {
        buyOrders[msg.sender] = BuyOrder(msg.value, block.timestamp + 3 days);
    }

    /**
     * allows seller to withdraw after 3 days of the escrow with @param buyer has passed
     */
    function sellerWithdraw(address buyer) external {
        require(msg.sender == seller);
        require(buyOrders[buyer].timestamp < block.timestamp);
        (bool ok,) = msg.sender.call{value: buyOrders[buyer].amount}("");
        require(ok, "TX failed");
        delete buyOrders[buyer];
    }

    /**
     * allowa buyer to withdraw at anytime before the end of the escrow (3 days)
     */
    function buyerWithdraw() external {
       require(msg.sender != seller && buyOrders[msg.sender].timestamp > block.timestamp);
       (bool ok,) = msg.sender.call{value: buyOrders[msg.sender].amount}("");
       require(ok, "TX failed");
       delete buyOrders[msg.sender];
    }

    // returns the escrowed amount of @param buyer
    function buyerDeposit(address buyer) external view returns (uint256) {
        require(buyer != seller);
        return buyOrders[buyer].amount;
    }
}
