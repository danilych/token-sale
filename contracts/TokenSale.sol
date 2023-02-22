// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract TokenSale is Ownable {
    IERC20 public token;
    uint256 public price;

    constructor(address token_, uint256 price_) {
        token = IERC20(token_);
        price = price_;
    }

    function getTokensBalance() public view returns(uint256 balance) {
        balance = token.balanceOf(address(this));
    }

    function changeToken(address token_) external onlyOwner {
        token = IERC20(token_);
    }

    function changeRate(uint256 price_) external onlyOwner {
        price = price_;
    }

    function withdrawTokens() external onlyOwner {
        token.transfer(owner(), getTokensBalance());
    }

    function withdrawEth() external onlyOwner {
        payable(owner()).transfer(address(this).balance);
    } 

    receive() external payable {}

    function buy() external payable {
        require(msg.value >= price, "TokenSale: Not enought ether");
        uint256 tokensAmount = msg.value / price;
        require(getTokensBalance() >= tokensAmount, "TokenSale: not enough tokens");
        token.transfer(_msgSender(), tokensAmount);
    }
}