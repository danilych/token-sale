// SPDX-License-Identifier: MIT
pragma solidity 0.8.17;

import { Ownable } from "@openzeppelin/contracts/access/Ownable.sol";
import { IERC20 } from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import { SafeERC20 } from "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";

/**
 *  @title TokenSale
 *
 *  @notice Contract for selling tokens
 *
 */
contract TokenSale is Ownable {
    // ERC20 operations
    using SafeERC20 for IERC20;

    // Tokens for sale
    IERC20 public token;

    // Price per one token
    uint256 public price;

    // Max Allocation for one wallet
    uint256 public maxAllocation;

    // Variable for hold information about is sale paused or no
    bool public isPaused;

    // Mapping which hold how much bought every wallet
    mapping(address => uint256) public allocations;

    // contructor
    constructor(address token_, uint256 price_, uint256 maxAllocation_) {
        token = IERC20(token_);
        price = price_;
        maxAllocation = maxAllocation_;
        isPaused = false;
    }

    receive() external payable {}

    /// @notice Main method for buying tokens
    function buy() external payable {
        require(!isPaused, "TokenSale: sale is not active at that moment");

        address sender = _msgSender();

        uint256 tokensValue = msg.value / price;

        require(
            msg.value > price,
            "TokenSale: you try buy less than one token"
        );

        require(
            (allocations[sender] + tokensValue) <= maxAllocation,
            "TokenSale: you try buy more than max allocation"
        );

        require(
            getTokensBalance() >= tokensValue,
            "TokenSale: not enough tokens"
        );

        unchecked {
            allocations[sender] += msg.value;
        }

        token.safeTransfer(sender, tokensValue * 10 ** 18);
    }

    /// @notice Changing token for sale
    function changeToken(address token_) external onlyOwner {
        token = IERC20(token_);
    }

    /// @notice Changing allocation per one wallet
    function changeMaxAllocation(uint256 maxAllocation_) external onlyOwner {
        maxAllocation = maxAllocation_;
    }

    /// @notice Changing price per one token
    function changeTokenPrice(uint256 price_) external onlyOwner {
        price = price_;
    }

    /// @notice Method for withdraw all tokens for sale from contract
    function withdrawTokens() external onlyOwner {
        token.safeTransfer(_msgSender(), getTokensBalance());
    }

    /// @notice Withdrawing all ethereum
    function withdrawEth() external onlyOwner {
        payable(owner()).transfer(address(this).balance);
    }

    /// @notice Method for pause sale (Buying will be not possible until sale will be started)
    function pauseSale() external onlyOwner {
        isPaused = true;
    }

    /// @notice Method for start auction
    function startSale() external onlyOwner {
        isPaused = false;
    }

    function getTokensBalance() public view returns (uint256 balance) {
        balance = token.balanceOf(address(this));
    }
}
