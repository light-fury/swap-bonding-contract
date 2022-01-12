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
  let tetherToken;
  before(async function () {
    [owner, alice, dao] = await ethers.getSigners();
    console.log(owner.address);
    console.log(alice.address);
    console.log(dao.address);

    const MockUSDT = await ethers.getContractFactory("MockUSDT");
    tetherToken = await MockUSDT.connect(alice).deploy();
    await tetherToken.deployed();

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
      tetherToken.address,
      owner.address,
      dao.address,
      "0x0000000000000000000000000000000000000000"
      // bondingCalculator.address
    );
    await bondDepository.deployed();

    await bondDepository.initializeBondTerms(
      480,
      33110,
      0,
      5,
      10000,
      ethers.utils.parseUnits("2", 16),
      0
    );
    await swapToken
      .connect(owner)
      .approve(
        bondDepository.address,
        ethers.utils.parseUnits("100000000", 18)
      );
    await tetherToken
      .connect(alice)
      .approve(bondDepository.address, ethers.utils.parseUnits("100000", 18));
  });
  it("Deposit & Redeem", async function () {
    const bondSwapAmt1 = await swapToken
      .connect(alice)
      .balanceOf(bondDepository.address);
    console.log(bondSwapAmt1);
    await bondDepository
      .connect(alice)
      .deposit(ethers.utils.parseUnits("1000", 18), 31529, alice.address);

    const swapAmt = await swapToken.connect(alice).balanceOf(alice.address);
    const usdtAmt = await tetherToken.connect(alice).balanceOf(alice.address);
    console.log(swapAmt);
    console.log(usdtAmt);

    const bondSwapAmt = await swapToken
      .connect(alice)
      .balanceOf(bondDepository.address);
    const bondUsdtAmt = await tetherToken
      .connect(alice)
      .balanceOf(bondDepository.address);
    console.log(bondSwapAmt);
    console.log(bondUsdtAmt);
  });
});
