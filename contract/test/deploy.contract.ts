import { ethers } from "hardhat";
import { TokenSale } from "../typechain-types";
import { mockERC20 } from "./erc20.mock";

export class TokenSaleContract {
  protected contract: TokenSale | null = null;

  async setup() {
    const [deployer, alice, bob, danya] = await ethers.getSigners();

    const token = await mockERC20();
    const paymentToken = await mockERC20();

    this.contract = await (
      await ethers.getContractFactory("TokenSale")
    ).deploy(token.address, paymentToken.address, 1, 1000);

    await paymentToken.transfer(alice.address, 5000);
    await paymentToken.connect(alice).approve(this.contract.address, ethers.constants.MaxUint256);

    await token.transfer(this.contract.address, 100000);

    return {
      contract: this.contract,
      deployer,
      token,
      paymentToken,
      alice,
      bob,
      danya,
    };
  }
}
export const tokenSale = new TokenSaleContract();
