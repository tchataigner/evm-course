# Solidity Exercises

This exercises come from the [Rareskills repository](https://github.com/RareSkills/Solidity-Exercises), but we fixed some test files
and remove some non-relevant.

## Installation

Install foundry

```
curl -L https://foundry.paradigm.xyz | bash
```

Clone this repository

```
git clone https://github.com/rareSkills/solidity-exercises.git
```

Complete the exercises in order and test with

```
cd <Problem Name>
forge test -vvv
```

for example, in the Add/ directory, open `src/Add.sol` and change the code so it compiles. The solution is

```solidity
    function add(uint256 a, uint256 b) public pure returns (uint256) {
        return a + b;
    }
```

Save your changes, then, in the same directory, test it with

```
forge test -vvv
```
