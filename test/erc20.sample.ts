import { ethers } from "hardhat";
import { faker } from "@faker-js/faker";

import { ERC20Sample } from "../typechain-types";

export async function sampleERC20() {
  const name = faker.word.noun(6);

  const [deployer] = await ethers.getSigners();

  return (await ethers.getContractFactory("ERC20Sample")).deploy(
    name,
    name.substring(0, 2),
    ethers.utils.parseEther("1000"),
    deployer.address
  ) as Promise<ERC20Sample>;
}
