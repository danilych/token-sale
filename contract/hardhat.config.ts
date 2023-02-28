import * as dotenv from "dotenv";
import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import "hardhat-gas-reporter"

const config: HardhatUserConfig = {
  solidity: "0.8.17",
};

dotenv.config();

function getEnvVariable(name: string, optional = false) {
	if (!optional && !process.env[name]) {
		throw new Error(`Please set your ${name} in an .env file`);
	}
	return process.env[name] ?? '';
}

export default config;
