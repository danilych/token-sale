import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";
import { ethers } from "hardhat";

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployments, getNamedAccounts } = hre;
  const { deploy, log } = deployments;

  const { deployer, owner, token } = await getNamedAccounts();

  const { address: contractAddress, abi } = await deploy("TokenSale", {
    from: owner,
    args: [token, ethers.utils.parseUnits("0.001", 18), ethers.utils.parseUnits("1", 18)],
    log: true,
    autoMine: true, // speed up deployment on local network (ganache, hardhat), no effect on live networks
  });

  log(`Token address: ${token}`);

  const contract = await hre.ethers.getContractAt(abi, contractAddress);

  if ((await contract.owner()) === deployer) {
    log(`Transferring ownership to ${owner}`);
    await contract.transferOwnership(owner);
  }
};

export default func;
