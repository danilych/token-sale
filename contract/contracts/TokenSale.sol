// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";

contract TokenSale is Ownable {
    using SafeERC20 for IERC20;

    IERC20 public paymentToken;

    IERC20 public token;

    uint256 public price;

    uint256 public maxAllocation;

    bool public isPaused;

    mapping(address => uint256) public allocations;

    constructor(
        address token_,
        address paymentToken_,
        uint256 price_,
        uint256 maxAllocation_
    ) {
        token = IERC20(token_);
        paymentToken = IERC20(paymentToken_);
        price = price_;
        maxAllocation = maxAllocation_;
        isPaused = false;
    }

    //***************Domain***************

    function buy(uint256 amount) external payable {
        address sender_ = _msgSender();

        require(!isPaused, "TokenSale: sale is not active at that moment");

        require(
            (allocations[sender_] + amount) <= maxAllocation,
            "TokenSale: you try buy more than max allocation"
        );

        uint256 tokensAmount = amount / price;

        require(
            tokensAmount <= maxAllocation,
            "TokenSale: you try buy more than max allocation"
        );

        require(
            getTokensBalance() >= tokensAmount,
            "TokenSale: not enough tokens"
        );

        paymentToken.safeTransferFrom(sender_, address(this), amount);

        allocations[sender_] += amount;

        token.safeTransfer(sender_, tokensAmount);
    }

    //***************Utils***************

    function getTokensBalance() public view returns (uint256 balance) {
        balance = token.balanceOf(address(this));
    }

    function changeToken(address token_) external onlyOwner {
        token = IERC20(token_);
    }

    function changeMaxAllocation(uint256 maxAllocation_) external onlyOwner {
        maxAllocation = maxAllocation_;
    }

    function changeTokenPrice(uint256 price_) external onlyOwner {
        price = price_;
    }

    function withdrawTokens() external onlyOwner {
        token.safeTransfer(_msgSender(), getTokensBalance());
    }

    function withdrawEth() external onlyOwner {
        payable(owner()).transfer(address(this).balance);
    }

    receive() external payable {}

    function pauseSale() external onlyOwner {
        isPaused = true;
    }

    function startSale() external onlyOwner {
        isPaused = false;
    }
}
