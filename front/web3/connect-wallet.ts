import { ethers } from "ethers";

export const connectWallet = async () => {
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      
      const signer = await provider.getSigner();
    } catch (error) {
      console.log("Error connection...");
    }
  };