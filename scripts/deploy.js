/* eslint-disable no-process-exit */
const { ethers, upgrades } = require("hardhat");

async function main() {
  // We get the contract to deploy

  const SwapToken = await ethers.getContractFactory("SwapToken");
  // const swapToken = await upgrades.deployProxy(SwapToken, [
  //   "TrustSwap Token",
  //   "SWAP",
  //   18,
  //   ethers.utils.parseUnits("100000000", 0),
  // ]);
  // await swapToken.deployed();
  const swapToken = await SwapToken.attach(
    "0x5A0593E8d540e448E10b6Bac8C1B05f272CaccB9" // The deployed contract address
  );

  const MockUSDT = await ethers.getContractFactory("TetherToken");
  // const tetherToken = await MockUSDT.deploy(
  //   ethers.utils.parseEther("1"),
  //   "Tether USD",
  //   "USDT",
  //   6
  // );
  // await tetherToken.deployed();
  const tetherToken = await MockUSDT.attach(
    "0x01a62BD0245c51760C65446A21c9EF5BB9819803" // The deployed contract address
  );

  const BondingCalculator = await ethers.getContractFactory(
    "BondingCalculator"
  );
  const bondingCalculator = await BondingCalculator.attach(
    "0x78062FD3d4D414f5dFcDC3f24AcEcc8966c73d67" // The deployed contract address
  );
  // const bondingCalculator = await BondingCalculator.deploy(swapToken.address);

  const BondDepository = await ethers.getContractFactory("SwapBondDepository");
  const bondDepository = await BondDepository.deploy(
    swapToken.address,
    tetherToken.address,
    "0xe8A06462628b49eb70DBF114EA510EB3BbBDf559",
    "0xd8c867F1D6508B01e024D9826D6eEd88C3A60A77",
    // "0x0000000000000000000000000000000000000000"
    bondingCalculator.address,
    "0x65dBcA1f0a54FD4DFe6232bE651c5d0FAc344475"
  );
  await bondDepository.deployed();

  await bondDepository.initializeBondTerms(
    480,
    [604800, 2592000, 5184000],
    0,
    500,
    [500, 300, 100],
    ethers.utils.parseUnits("10000000000", 18),
    0
  );
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
