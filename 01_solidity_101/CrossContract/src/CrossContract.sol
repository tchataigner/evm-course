// SPDX-License-Identifier: BUSL-1.1
pragma solidity ^0.8.13;

contract CrossContract {
    /**
     * The function below is to call the price function of PriceOracle1 and PriceOracle2 contracts below and return the lower of the two prices
     */

    function getLowerPrice(
        address _priceOracle1,
        address _priceOracle2
    ) external returns (uint256) {
       (bool ok1, bytes memory result1) = _priceOracle1.call(abi.encodeWithSignature("price()"));
       uint256 price1 = getPrice(ok1, result1);
       (bool ok2, bytes memory result2) = _priceOracle2.call(abi.encodeWithSignature("price()"));
       uint256 price2 = getPrice(ok2, result2);
       return price1 > price2 ? price2 : price1;
    }

    function getPrice(bool ok, bytes memory result) private pure returns (uint256) {
        require(ok, "failed");
        return abi.decode(result, (uint256));
    }
}

contract PriceOracle1 {
    uint256 private _price;

    function setPrice(uint256 newPrice) public {
        _price = newPrice;
    }

    function price() external view returns (uint256) {
        return _price;
    }
}

contract PriceOracle2 {
    uint256 private _price;

    function setPrice(uint256 newPrice) public {
        _price = newPrice;
    }

    function price() external view returns (uint256) {
        return _price;
    }
}
