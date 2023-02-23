import { ethers } from "hardhat";
import { TokenSale } from "../typechain-types";
import { mockERC20 } from "./erc20.mock";

export class TokenSaleContract {
  async setup() {
    const [deployer, alice, bob, danya] = await ethers.getSigners();

    const token = await mockERC20();

    const contract = await (
      await ethers.getContractFactory("TokenSale")
    ).deploy(token.address, ethers.utils.parseEther("0.00001"), 1000);


    return {
      contract: contract,
      deployer,
      token,
      alice,
      bob,
      danya,
    };
  }
}
export const tokenSale = new TokenSaleContract();
