import { ethers } from "hardhat";
import chai from "chai";
import { solidity } from "ethereum-waffle";
import { HitaToken__factory } from "../typechain";

chai.use(solidity);
const { expect } = chai;

describe("Token", () => {
  let tokenAddress: string;

  beforeEach(async () => {
    const [deployer] = await ethers.getSigners();
    const tokenFactory = new HitaToken__factory(deployer);
    const tokenContract = await tokenFactory.deploy();
    tokenAddress = tokenContract.address;

    const totalSupply = ethers.utils.parseEther("1000000000");
    expect(await tokenContract.totalSupply()).to.eq(totalSupply);
  });
  describe("Mint", async () => {
    it("Should mint some tokens", async () => {
      const [deployer, user] = await ethers.getSigners();
      const tokenInstance = new HitaToken__factory(deployer).attach(tokenAddress);
      const toMint = ethers.utils.parseEther("1");

      await tokenInstance.mint(user.address, toMint);
      expect(await tokenInstance.balanceOf(user.address)).to.eq(toMint);
    });
  });

  describe("Transfer", async () => {
    it("Should transfer tokens between users", async () => {
      const [deployer, sender, receiver] = await ethers.getSigners();
      const deployerInstance = new HitaToken__factory(deployer).attach(tokenAddress);
      const toMint = ethers.utils.parseEther("1");

      await deployerInstance.mint(sender.address, toMint);
      expect(await deployerInstance.balanceOf(sender.address)).to.eq(toMint);

      const senderInstance = new HitaToken__factory(sender).attach(tokenAddress);
      const toSend = ethers.utils.parseEther("0.4");
      await senderInstance.transfer(receiver.address, toSend);

      expect(await senderInstance.balanceOf(receiver.address)).to.eq(toSend);
    });

    it("Should fail to transfer with low balance", async () => {
      const [deployer, sender, receiver] = await ethers.getSigners();
      const deployerInstance = new HitaToken__factory(deployer).attach(tokenAddress);
      const toMint = ethers.utils.parseEther("1");

      await deployerInstance.mint(sender.address, toMint);
      expect(await deployerInstance.balanceOf(sender.address)).to.eq(toMint);

      const senderInstance = new HitaToken__factory(sender).attach(tokenAddress);
      const toSend = ethers.utils.parseEther("1.1");

      // Notice await is on the expect
      await expect(senderInstance.transfer(receiver.address, toSend)).to.be.revertedWith(
        "transfer amount exceeds balance",
      );
    });
  });
});
