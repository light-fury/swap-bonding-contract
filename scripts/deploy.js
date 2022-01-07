/* eslint-disable no-process-exit */
const { ethers, upgrades } = require("hardhat");

async function main() {
  // We get the contract to deploy

  const SwapToken = await ethers.getContractFactory("SwapToken");
  const swapToken = await upgrades.deployProxy(SwapToken, [
    "TrustSwap Token",
    "SWAP",
    18,
    ethers.utils.parseUnits("100000000", 0),
  ]);
  await swapToken.deployed();

  const MockFrax = await ethers.getContractFactory("MockFrax");
  const fraxToken = await MockFrax.deploy();
  await fraxToken.deployed();

  const BondingCalculator = await ethers.getContractFactory(
    "BondingCalculator"
  );
  const bondingCalculator = await BondingCalculator.deploy(swapToken.address);

  const BondDepository = await ethers.getContractFactory("SwapBondDepository");
  const bondDepository = await BondDepository.deploy(
    swapToken.address,
    fraxToken.address,
    "0xe8A06462628b49eb70DBF114EA510EB3BbBDf559",
    "0xd8c867F1D6508B01e024D9826D6eEd88C3A60A77",
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
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
