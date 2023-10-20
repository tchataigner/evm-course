# Decentralized Application development

## Smart contract specification

We will develop an example of a "Token Box" for our application.

### Core features

- `mint`: A method used to create a new collection of tokens. A collection must be related to a URI corresponding to
some metadata we want to attach to all tokens of the collection. At mint time, a minter must be able to specify some predetermined
allocations of some tokens to a list of address. He must also be able to specify if the allocated tokens should be directly 
redeemed.

- `redeem`: A method used by owner of tokens to forever revoke a designated amount of tokens from a collection (conceptually
making them non-transferable). This method should emit a `Redeem` event that carries the address of the redeemer, the 
collection and the amount redeemed.

> Note: It is advised to implement the contract by extending the [ERC1155](https://docs.openzeppelin.com/contracts/3.x/api/token/erc1155)
> standard from Open Zeppelin. It is also recommended to leverage the [ERC1155MetadataURI](https://docs.openzeppelin.com/contracts/3.x/api/token/erc1155#IERC1155MetadataURI)
> standard.

### Access Control 

The core features of our contract will be access limited based on some role granted to the addresses that want to interact with
it. With this in mind there will be 2 roles in our contract:

- `MINTER`: Able to call the `mint` method. The method must revert if the caller does not have the role.
- `REDEEMER`: Able to redeem some token it owns. The `revert` method must revert if the caller does not have the role.

> Note: It is recommended to leverage the [Access Control](https://docs.openzeppelin.com/contracts/3.x/access-control)
> standard from Open Zeppelin.

### Getters

For Getters in our contract, here are the following information interesting to us:
- Current balance of a given address for a given collection.
- URI of a given collection.
- Supply of a given collection.
- Redeemed supply of a given collection
- Redeemed amount of token of a given address for a given collection.

### Miscellaneous

We advise to use the [Context](https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/utils/Context.sol)
contract from Open Zeppelin to get used to it, as it useful in a context where metatransaction might be done on our contract.

## Deployment

First, start the Anvil network:

```shell
anvil
```

Get a Private Key from the proposed list, then run:
```bash
 forge create --rpc-url http://localhost:8545 --private-key <private-key> src/TokenBox.sol:TokenBox
```

You will be able to get your contract address from there.