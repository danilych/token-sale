import { ethers } from "hardhat";
import { faker } from "@faker-js/faker";

import { ERC20Mock } from "../typechain-types";

export async function mockERC20() {
  const name = faker.word.noun(6);

  const [deployer] = await ethers.getSigners();

  return (await ethers.getContractFactory("ERC20Mock")).deploy(
    name,
    name.substring(0, 2),
    ethers.utils.parseEther("1000"),
    deployer.address
  ) as Promise<ERC20Mock>;
}
