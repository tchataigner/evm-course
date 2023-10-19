// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/IAccessControl.sol";
import "@openzeppelin/contracts/token/ERC1155/IERC1155.sol";
import "@openzeppelin/contracts/token/ERC1155/extensions/IERC1155MetadataURI.sol";
import "@openzeppelin/contracts/token/ERC1155/IERC1155Receiver.sol";

import {Test, console2} from "forge-std/Test.sol";
import {TokenBox} from "../src/TokenBox.sol";

contract TokenBoxTest is Test {

    TokenBox tokenBox;

    // Setup a new contract before each test.
    function setUp() public {
        tokenBox = new TokenBox();
    }

    // Necessary to receive ERC1155 on a smart contract
    function onERC1155Received(
        address _operator,
        address _from,
        uint256 _id,
        uint256 _value,
        bytes calldata _data
    ) external pure returns (bytes4) {
        return bytes4(keccak256("onERC1155Received(address,address,uint256,uint256,bytes)"));
    }

    // Necessary to check event emission.
    event Redeem(
        address indexed owner,
        uint256 indexed tokenId,
        uint256 indexed amount
    );


    function test_RoleAllocation() public {
        // We are expecting the constructor() to set deployer as admin, minter and redeemer.
        assertEq(tokenBox.hasRole(tokenBox.DEFAULT_ADMIN_ROLE(), address(this)), true, "Deployer should be admin");
        assertEq(tokenBox.hasRole(tokenBox.MINTER_ROLE(), address(this)), true, "Deployer should be minter");
        assertEq(tokenBox.hasRole(tokenBox.REDEEMER_ROLE(), address(this)), true, "Deployer should be redeemer");
    }

    function test_CorrectInterfaces() public {
        // We expect our TokenBox to support both IERC1155, IERC1155MetadataURI and IAccessControl interfaces.
        assertEq(tokenBox.supportsInterface(type(IERC1155).interfaceId), true, "TokenBox should support ER1155 interface");
        assertEq(tokenBox.supportsInterface(type(IERC1155MetadataURI).interfaceId), true, "TokenBox should be ERC1155Metadata interface");
        assertEq(tokenBox.supportsInterface(type(IAccessControl).interfaceId), true, "TokenBox should be IAccessControl interface");
    }

    function testFail_Mint_NotMinterRole() public {
        // We expect to only be able to mint if we have a correct role.
        vm.prank(address(0xbed));

        address[] memory allocated;
        uint256[] memory allocations;
        bool[] memory allocationsRedeemed;

        tokenBox.mintAndAllocate("QmZ4tDuvesekSs4qM5ZBKpXiZGun7S2CYtEZRB3DYXkjGx", 10, allocated, allocations, allocationsRedeemed);
    }

    function test_Mint_DifferentArrayLength() public {
        // We expect to only be able to mint if all the array parameters are same length.
        address[] memory allocated = new address[](1);
        uint256[] memory allocations = new uint256[](1);
        bool[] memory allocationsRedeemed = new bool[](0);

        allocated[0] = address(this);

        vm.expectRevert();
        tokenBox.mintAndAllocate("QmZ4tDuvesekSs4qM5ZBKpXiZGun7S2CYtEZRB3DYXkjGx", 10, allocated, allocations, allocationsRedeemed);

        allocations[0] = 5;

        vm.expectRevert();
        tokenBox.mintAndAllocate("QmZ4tDuvesekSs4qM5ZBKpXiZGun7S2CYtEZRB3DYXkjGx", 10, allocated, allocations, allocationsRedeemed);
    }


    function test_Mint_MoreAllocationThanMinted() public {
        // We expect to only be able to mint if there is more token allocate than minted.
        address[] memory allocated = new address[](1);
        uint256[] memory allocations = new uint256[](1);
        bool[] memory allocationsRedeemed = new bool[](1);

        allocated[0] = address(this);
        allocations[0] = 15;
        allocationsRedeemed[0] = false;

        vm.expectRevert();
        tokenBox.mintAndAllocate("QmZ4tDuvesekSs4qM5ZBKpXiZGun7S2CYtEZRB3DYXkjGx", 10, allocated, allocations, allocationsRedeemed);
    }

    function test_Mint_NoAllocations() public {
        // We expect tokens to be assigned to minter if no allocations.
        address[] memory allocated;
        uint256[] memory allocations;
        bool[] memory allocationsRedeemed;

        tokenBox.mintAndAllocate("QmZ4tDuvesekSs4qM5ZBKpXiZGun7S2CYtEZRB3DYXkjGx", 10, allocated, allocations, allocationsRedeemed);

        assertEq(tokenBox.balanceOf(address(this), 0), 10, "Expected balance of token to be minted amount: 10");
    }

    function test_Mint_AllocateProperly() public {
        // We expect allocation to properly work.
        address[] memory allocated = new address[](1);
        uint256[] memory allocations = new uint256[](1);
        bool[] memory allocationsRedeemed = new bool[](1);

        allocated[0] = address(0xbed);
        allocations[0] = 5;
        allocationsRedeemed[0] = false;

        tokenBox.mintAndAllocate("QmZ4tDuvesekSs4qM5ZBKpXiZGun7S2CYtEZRB3DYXkjGx", 10, allocated, allocations, allocationsRedeemed);

        assertEq(tokenBox.balanceOf(address(this), 0), 5, "Expected balance of minter to be: 5");
        assertEq(tokenBox.balanceOf(address(0xbed), 0), 5, "Expected balance of allocation target to be: 5");
    }

    function test_Mint_KeepTrackOfMinter() public {
        // We expect minter to be set as test contract address.
        address[] memory allocated = new address[](1);
        uint256[] memory allocations = new uint256[](1);
        bool[] memory allocationsRedeemed = new bool[](1);

        allocated[0] = address(0xbed);
        allocations[0] = 5;
        allocationsRedeemed[0] = false;

        tokenBox.mintAndAllocate("QmZ4tDuvesekSs4qM5ZBKpXiZGun7S2CYtEZRB3DYXkjGx", 10, allocated, allocations, allocationsRedeemed);

        assertEq(tokenBox.minterOf(0), address(this), "Expected minter to be test contract");
    }

    function test_Mint_SetURI() public {
        // We expect minter to be set as test contract address.
        address[] memory allocated = new address[](1);
        uint256[] memory allocations = new uint256[](1);
        bool[] memory allocationsRedeemed = new bool[](1);

        allocated[0] = address(0xbed);
        allocations[0] = 5;
        allocationsRedeemed[0] = false;

        tokenBox.mintAndAllocate("QmZ4tDuvesekSs4qM5ZBKpXiZGun7S2CYtEZRB3DYXkjGx", 10, allocated, allocations, allocationsRedeemed);

        assertEq(tokenBox.uri(0), "QmZ4tDuvesekSs4qM5ZBKpXiZGun7S2CYtEZRB3DYXkjGx", "Expected uri to be: QmZ4tDuvesekSs4qM5ZBKpXiZGun7S2CYtEZRB3DYXkjGx");
    }

    function test_Mint_AutomaticallyRedeem() public {
        // We expect minter to be set as test contract address.
        address[] memory allocated = new address[](1);
        uint256[] memory allocations = new uint256[](1);
        bool[] memory allocationsRedeemed = new bool[](1);

        allocated[0] = address(0xbed);
        allocations[0] = 5;
        allocationsRedeemed[0] = true;

        tokenBox.grantRole(tokenBox.REDEEMER_ROLE(), address(0xbed));

        tokenBox.mintAndAllocate("QmZ4tDuvesekSs4qM5ZBKpXiZGun7S2CYtEZRB3DYXkjGx", 10, allocated, allocations, allocationsRedeemed);

        assertEq(tokenBox.redeemedSupplyOf(0), 5, "Expected redeemed supply to be: 5");
    }

    function mintWithAllocation(TokenBox _tokenBox, address _allocationReceiver) internal {
        address[] memory allocated = new address[](1);
        uint256[] memory allocations = new uint256[](1);
        bool[] memory allocationsRedeemed = new bool[](1);

        allocated[0] = _allocationReceiver;
        allocations[0] = 5;
        allocationsRedeemed[0] = false;

        _tokenBox.mintAndAllocate("QmZ4tDuvesekSs4qM5ZBKpXiZGun7S2CYtEZRB3DYXkjGx", 10, allocated, allocations, allocationsRedeemed);
    }

    function testFail_Redeeem_NotRedeemer() public {
        // Expect redeemer to have the role REDEEMER.
        mintWithAllocation(tokenBox, address(0xbed));

        vm.prank(address(0xbed));

        tokenBox.redeem(0, 5);
    }

    function testFail_Redeeem_NotEnoughToken() public {
        // Expect to not have enough token.
        mintWithAllocation(tokenBox, address(0xbed));

        tokenBox.grantRole(tokenBox.REDEEMER_ROLE(), address(0xbed));

        vm.prank(address(0xbed));

        tokenBox.redeem(0, 15);
    }

    function test_Redeeem_IncreaseRedeemAmount() public {
        // Expect to update data related to redemption.
        mintWithAllocation(tokenBox, address(0xbed));

        tokenBox.grantRole(tokenBox.REDEEMER_ROLE(), address(0xbed));

        assertEq(tokenBox.amountRedeemed(address(0xbed), 0), 0, "Expected redeemed amount for account to be: 0");
        assertEq(tokenBox.redeemedSupplyOf(0), 0, "Expected redeemed supply to be: 0");

        vm.prank(address(0xbed));

        tokenBox.redeem(0, 5);

        assertEq(tokenBox.amountRedeemed(address(0xbed), 0), 5, "Expected redeemed amount for account to be: 0");
        assertEq(tokenBox.redeemedSupplyOf(0), 5, "Expected redeemed supply to be: 5");
    }

    function testFail_Redeeem_TransferAfterRedeem() public {
        // Expect to be impossible to transfer after redemption.
        mintWithAllocation(tokenBox, address(0xbed));

        tokenBox.grantRole(tokenBox.REDEEMER_ROLE(), address(0xbed));

        vm.startPrank(address(0xbed));

        tokenBox.redeem(0, 5);

        bytes memory data;
        tokenBox.safeTransferFrom(address(0xbed), address(0), 0, 5, data);
    }

    function test_Redeeem_EmitEvent() public {
        // Expect to update data related to redemption.
        mintWithAllocation(tokenBox, address(0xbed));

        tokenBox.grantRole(tokenBox.REDEEMER_ROLE(), address(0xbed));

        vm.expectEmit(false, false, false, false);
        emit TokenBox.Redeem(address(0xbed), 0, 5);

        vm.prank(address(0xbed));

        tokenBox.redeem(0, 5);

        assertEq(tokenBox.amountRedeemed(address(0xbed), 0), 5, "Expected redeemed amount for account to be: 0");
        assertEq(tokenBox.redeemedSupplyOf(0), 5, "Expected redeemed supply to be: 5");
    }

}