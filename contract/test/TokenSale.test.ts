import { expect } from "chai";
import { tokenSale } from "./deploy.contract";
import { mockERC20 } from "./erc20.mock";

describe("TokenSale", function () {
  context("IAM", async () => {
    it("init owner", async () => {
      const { deployer, contract } = await tokenSale.setup();

      await expect(await contract.owner()).to.be.equal(deployer.address);
    });

    it("revert if not owner try change rate", async () => {
      const { alice, contract } = await tokenSale.setup();

      await expect(contract.connect(alice).changeRate(4)).to.be.revertedWith(
        "Ownable: caller is not the owner"
      );
    });

    it("revert if not owner try change token", async () => {
      const { alice, contract } = await tokenSale.setup();

      const token_ = mockERC20();

      await expect(
        contract.connect(alice).changeToken((await token_).address)
      ).to.be.revertedWith("Ownable: caller is not the owner");
    });

    it("revert if not owner try withdraw tokens", async () => {
      const { alice, contract } = await tokenSale.setup();

      await expect(contract.connect(alice).withdrawTokens()).to.be.revertedWith(
        "Ownable: caller is not the owner"
      );
    });

    it("revert if not owner try withdraw tokens", async () => {
      const { alice, contract } = await tokenSale.setup();

      await expect(contract.connect(alice).withdrawEth()).to.be.revertedWith(
        "Ownable: caller is not the owner"
      );
    });

    it("revert if not owner try change max allocation", async () => {
      const { alice, contract } = await tokenSale.setup();

      await expect(
        contract.connect(alice).changeMaxAllocation(500)
      ).to.be.revertedWith("Ownable: caller is not the owner");
    });

    it("revert if not owner try pause auction", async () => {
      const { alice, contract } = await tokenSale.setup();

      await expect(contract.connect(alice).pauseSale()).to.be.revertedWith(
        "Ownable: caller is not the owner"
      );
    });

    it("revert if not owner try start auction", async () => {
      const { alice, contract } = await tokenSale.setup();

      await expect(contract.connect(alice).startSale()).to.be.revertedWith(
        "Ownable: caller is not the owner"
      );
    });
  });

  context("buy", async () => {
    it("user buy tokens", async () => {
      const { alice, contract, token } = await tokenSale.setup();

      await expect(contract.connect(alice).buy(100)).to.changeTokenBalance(
        token,
        alice.address,
        100
      );
    });

    it("shop get payments", async () => {
      const { alice, contract, paymentToken } = await tokenSale.setup();

      await expect(contract.connect(alice).buy(100)).to.changeTokenBalance(
        paymentToken,
        contract.address,
        100
      );
    });

    it("revert if user try buy tokens when sale is paused", async () => {
      const { alice, contract } = await tokenSale.setup();

      await contract.pauseSale();

      await expect(contract.connect(alice).buy(100)).to.be.revertedWith(
        "TokenSale: sale is not active at that moment"
      );
    });

    it("buy after reset pause", async () => {
      const { alice, contract } = await tokenSale.setup();

      await contract.pauseSale();

      await contract.startSale();

      await expect(contract.connect(alice).buy(100)).to.be.not.revertedWith(
        "TokenSale: sale is not active at that moment"
      );
    });

    it("reverts when user try buy more than max allocation", async () => {
      const { alice, contract } = await tokenSale.setup();

      await expect(contract.connect(alice).buy(1001)).to.be.revertedWith(
        "TokenSale: you try buy more than max allocation"
      );
    });
  });
});
