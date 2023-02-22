import { ethers } from "hardhat";
import { TokenSale } from "../typechain-types";
import { sampleERC20 } from "./erc20.sample";

export class TokenSaleContract {
  async setup() {
    const [deployer, alice, bob, danya] = await ethers.getSigners();

    const token = await sampleERC20();

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
