// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/utils/Context.sol";

contract TokenBox is Context, ERC1155, AccessControl {
    /*****************************************************************
     * Events
     *****************************************************************/
    // Event emitted when an owner redeems tokens
    event Redeem(
        address indexed owner,
        uint256 indexed tokenId,
        uint256 indexed amount
    );


    /*****************************************************************
     * Token utilities
     *****************************************************************/
    // Next id used for token
    uint256 private _id;
    // URIs for tokens
    mapping(uint256 => string) private _tokenURIs;
    // Minters of given _id
    mapping(uint256 => address) private _minter;
    // Amount of tokens redeemed by an account of an _id
    mapping(uint256 => mapping(address => uint256)) private _redeemed;
    // Supply of tokens available for an id
    mapping(uint256 => uint256) private _supply;
    // Total amount of tokens redeemed for an _id
    mapping(uint256 => uint256) private _redeemedSupply;
    // Redemption statement PDF
    mapping(uint256 => string) private _redemptionStatementURI;

    /*****************************************************************
     * Access control roles
     *****************************************************************/
    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");
    bytes32 public constant REDEEMER_ROLE = keccak256("REDEEMER_ROLE");

    constructor() ERC1155("") {
        _grantRole(DEFAULT_ADMIN_ROLE, _msgSender());
        _grantRole(MINTER_ROLE, _msgSender());
        _grantRole(REDEEMER_ROLE, _msgSender());
    }

    /**
     * Function that checks if a contract supports a specific interface by checking if it implements the ERC1155 or AccessControl interfaces.
     * This function is being overridden from the ERC1155 contract to also check if the interface is supported by the AccessControl contract.
     *
     * @param interfaceId bytes4 of the interface to check support for.
     * @return bool returns true if the interface is supported by the contract, false otherwise.
     */
    function supportsInterface(
        bytes4 interfaceId
    ) public view virtual override(ERC1155, AccessControl) returns (bool) {
        return
            ERC1155.supportsInterface(interfaceId) || AccessControl.supportsInterface(interfaceId);
    }

    /**
     * mintAndAllocate: This function is used to mint new tokens and allocate them to specific addresses.
     *
     * @param tokenUri: string memory, the URI of the token
     * @param amount: uint256, the amount of tokens to mint
     * @param allocated: address[] memory, an array of addresses to allocate the tokens to
     * @param allocations: uint256[] memory, an array of amounts of tokens to allocate to each address
     * @param allocationsRedeemed: bool[] memory, an array specifying if the allocations should be automatically redeemed
     *
     * Preconditions:
     * - msg.sender must have the MINTER_ROLE
     * - allocated.length must be equal to allocations.length
     *
     * Postconditions:
     * - The msg.sender will own the amount of tokens minted
     * - The allocated addresses will own the corresponding allocations of tokens
     * - The token supply will be set to the amount minted
     * - The minter of the token will be set to msg.sender
     * - The URI of the token will be set to the passed in uri
     * - The next token id will be incremented
     */
    function mintAndAllocate(
        string memory tokenUri,
        uint256 amount,
        address[] memory allocated,
        uint256[] memory allocations,
        bool[] memory allocationsRedeemed
    ) public {
        require(
            hasRole(MINTER_ROLE, _msgSender()),
            "Sender must have MINTER_ROLE to mint new tokens"
        );
        require(
            allocated.length == allocations.length,
            "Allocated and allocations arrays must be of the same length"
        );
        require(
            allocated.length == allocationsRedeemed.length,
            "Allocated and allocations redeemed arrays must be of the same length"
        );

        // Mint tokens to msgSender
        _mint(_msgSender(), _id, amount, "");

        // Transfer tokens to each recipients
        for (uint256 i = 0; i < allocated.length; i++) {
            _safeTransferFrom(_msgSender(), allocated[i], _id, allocations[i], "");
            if(allocationsRedeemed[i]) {
                _redeem(allocated[i], _id, allocations[i]);
            }
        }

        // Set token supply
        _supply[_id] = amount;

        // Set token _minter
        _minter[_id] = _msgSender();

        // Set _tokenURI
        _tokenURIs[_id] = tokenUri;

        // Increase next token id
        _id++;
    }

    /**
     * Function that is used to redeem existing tokens, Only callable by accounts with REDEEMER_ROLE.
     * Tokens are burned, redeemed amount is set and corresponding supply of redeemed token is increased.
     * If the redemption was already validated, it will be set as not validated anymore
     *
     * @param id uint256: identifier of the token to be redeemed.
     * @param amount uint256: amount of token to be redeemed.
     *
     */
    function redeem(uint256 id, uint256 amount) public {
        _redeem(_msgSender(), id, amount);
    }

    function _redeem(address redeemer, uint256 id, uint256 amount) internal {
        require(
            hasRole(REDEEMER_ROLE, redeemer),
            "Sender must have MINTER_ROLE to mint new tokens"
        );

        // Burn tokens
        _burn(redeemer, id, amount);

        // Set amount as redeemed
        _redeemed[id][redeemer] += amount;

        // Increase supply _redeemed
        _redeemedSupply[id] += amount;

        emit Redeem(redeemer, id, amount);
    }

    /**
     * Function that returns the next id used for a token
     *
     * @return uint256: The ID of the token.
     */
    function nextId() public view returns (uint256) {
        return _id;
    }

    /**
     * Returns the URI of the token with the given ID.
     * @param id The ID of the token.
     * @return The URI of the token.
     */
    function uri(uint256 id) public view virtual override returns (string memory) {
        return _tokenURIs[id];
    }

    /**
     * Function that returns the address of the minter of a given token id
     *
     * @param id uint256: identifier of the token
     * @return address of the minter
     */
    function minterOf(uint256 id) public view returns (address) {
        return _minter[id];
    }

    /**
     * Function that returns the amount of tokens redeemed by a specific account for a given token id.
     *
     * @param account address: account whose redemption is being queried
     * @param id uint256: identifier of the token
     * @return uint256: amount of tokens redeemed by the account
     */
    function amountRedeemed(address account, uint256 id) public view returns (uint256) {
        return _redeemed[id][account];
    }

    /**
     * Function that returns the supply of a specific token id
     *
     * @param id uint256: identifier of the token
     * @return uint256: supply of the token
     */
    function supplyOf(uint256 id) public view returns (uint256) {
        return _supply[id];
    }

    /**
     * Function that returns the redeemed supply of a specific token id
     *
     * @param id uint256: identifier of the token
     * @return uint256: redeemed supply of the token
     */
    function redeemedSupplyOf(uint256 id) public view returns (uint256) {
        return _redeemedSupply[id];
    }
}