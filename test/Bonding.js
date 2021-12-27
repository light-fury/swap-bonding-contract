const { expect } = require("chai");
const { ethers, upgrades } = require("hardhat");

// principle = USDT = 0x13512979ade267ab5100878e2e0f485b568328a4

describe("Bonding", function () {
  let owner;
  let alice;
  let dao;
  let bondingCalculator;
  let bondDepository;
  let swapToken;
  let usdtToken;
  before(async function () {
    [owner, alice, dao] = await ethers.getSigners();
    console.log(owner.address);
    console.log(alice.address);
    console.log(dao.address);

    const MockUSDT = await ethers.getContractFactory("MockUSDT");
    usdtToken = await MockUSDT.attach(
      "0x13512979ADE267AB5100878E2e0f485B568328a4" // The deployed contract address
    );

    const SwapToken = await ethers.getContractFactory("SwapToken");
    swapToken = await upgrades.deployProxy(SwapToken, [
      "TrustSwap Token",
      "SWAP",
      18,
      ethers.utils.parseUnits("100000000", 0),
    ]);
    await swapToken.deployed();

    const BondingCalculator = await ethers.getContractFactory(
      "BondingCalculator"
    );
    bondingCalculator = await BondingCalculator.deploy(swapToken.address);
    await bondingCalculator.deployed();

    const BondDepository = await ethers.getContractFactory(
      "SwapBondDepository"
    );
    bondDepository = await BondDepository.deploy(
      swapToken.address,
      "0x13512979ade267ab5100878e2e0f485b568328a4",
      owner.address,
      dao.address,
      "0x0000000000000000000000000000000000000000"
      // bondingCalculator.address
    );
    await bondDepository.deployed();

    await bondDepository.initializeBondTerms(
      300,
      33110,
      26000,
      50,
      10000,
      ethers.utils.parseUnits("600000000", 6),
      ethers.utils.parseUnits("450000000", 6)
    );
    await swapToken
      .connect(owner)
      .approve(
        bondDepository.address,
        ethers.utils.parseUnits("100000000", 18)
      );
    await usdtToken
      .connect(owner)
      .transfer(alice.address, ethers.utils.parseUnits("400000000", 6));
    await usdtToken
      .connect(alice)
      .approve(bondDepository.address, ethers.utils.parseUnits("400000000", 6));
  });
  it("Deposit & Redeem", async function () {
    await bondDepository
      .connect(alice)
      .deposit(ethers.utils.parseUnits("10000", 6), 28630, alice.address);

    const swapAmt = await swapToken.connect(alice).balanceOf(alice.address);
    const usdtAmt = await usdtToken.connect(alice).balanceOf(alice.address);
    console.log(swapAmt);
    console.log(usdtAmt);

    const bondSwapAmt = await swapToken
      .connect(alice)
      .balanceOf(bondDepository.address);
    const bondUsdtAmt = await usdtToken
      .connect(alice)
      .balanceOf(bondDepository.address);
    console.log(bondSwapAmt);
    console.log(bondUsdtAmt);
  });
});
