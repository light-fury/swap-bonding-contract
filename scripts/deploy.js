/* eslint-disable no-process-exit */
const { ethers, upgrades } = require("hardhat");

async function main() {
  // We get the contract to deploy

  // const SwapToken = await ethers.getContractFactory("SwapToken");
  // const swapToken = await upgrades.deployProxy(SwapToken, [
  //   "TrustSwap Token",
  //   "SWAP",
  //   18,
  //   ethers.utils.parseUnits("100000000", 0),
  // ]);
  // await swapToken.deployed();
  // const swapToken = await SwapToken.attach(
  //   "0x5A0593E8d540e448E10b6Bac8C1B05f272CaccB9" // The deployed contract address
  // );

  // const MockUSDT = await ethers.getContractFactory("TetherToken");
  // const tetherToken = await MockUSDT.deploy(
  //   ethers.utils.parseEther("1"),
  //   "Tether USD",
  //   "USDT",
  //   6
  // );
  // await tetherToken.deployed();
  // const tetherToken = await MockUSDT.attach(
  //   "0x01a62BD0245c51760C65446A21c9EF5BB9819803" // The deployed contract address
  // );

  const BondingCalculator = await ethers.getContractFactory(
    "BondingCalculator"
  );
  // const bondingCalculator = await BondingCalculator.attach(
  //   "0x78062FD3d4D414f5dFcDC3f24AcEcc8966c73d67" // The deployed contract address
  // );
  const bondingCalculator = await BondingCalculator.deploy(
    "0xCC4304A31d09258b0029eA7FE63d032f52e44EFe",
    "0xdAC17F958D2ee523a2206206994597C13D831ec7"
  );

  const BondDepository = await ethers.getContractFactory("SwapBondDepository");
  const bondDepository = await BondDepository.deploy(
    "0xCC4304A31d09258b0029eA7FE63d032f52e44EFe",
    "0xdAC17F958D2ee523a2206206994597C13D831ec7",
    "0xB5440E3E78aF49364C255f8507B4930e816e88fD",
    "0xB5440E3E78aF49364C255f8507B4930e816e88fD",
    // "0x0000000000000000000000000000000000000000"
    bondingCalculator.address,
    "0xd90a1ba0cbaaaabfdc6c814cdf1611306a26e1f8",
    "0x0d4a11d5EEaaC28EC3F61d100daF4d40471f1852"
  );
  await bondDepository.deployed();

  await bondDepository.initializeBondTerms(
    0,
    [14, 30, 60, 120],
    0,
    500,
    [400, 600, 800, 1000],
    ethers.utils.parseUnits("10000000000", 18),
    0
  );

  await bondDepository.updateBatchWhitelist(
    [
      "0x906935f4b42e632137504C0ea00D43C6442272bf",
      "0xe8A06462628b49eb70DBF114EA510EB3BbBDf559",
    ],
    [true, true]
  );
  // await bondDepository.updateBatchWhitelist(
  //   [
  //     "0x7d4d795073c77873e895d9003b7853e31bec5584",
  //     "0x8ff44b0318aa90ab204cb6d403a6181f1a72e515",
  //     "0x10679c76e6aed7816f073ef240b808b2c2b96c89",
  //     "0x1cb4ca109414d650ab3dacdf3984c704d0e2985c",
  //     "0xac35195f17d5b52d3dac2d1cf6f15762ccbc4a2a",
  //     "0x8867a46d1dc2db384aa8af8315b0693d1f256115",
  //     "0x7c4f22a53c1d745ea6e116da54dd30b0273a006e",
  //     "0xea24d9d9586207101e6784542e8a1d4e5ace90e6",
  //     "0xe04fef36bfdfa5747797ea56d7fe9e9cdb347f14",
  //     "0xe04fef36bfdfa5747797ea56d7fe9e9cdb347f14",
  //     "0x3961a340bdde3f7718bfb06749e56a87b4497bf9",
  //     "0xe48badac25557dd368849c7510a6d6f2496970f8",
  //     "0xeb32a65e26d939dc15e87dd959ceaefd91fea8ea",
  //     "0xa57a0792bcd2ed431885f9711f14dce2fe3c1e92",
  //     "0xb959c37b703a8d21c29383a5e205252610acbf77",
  //     "0xba7c6dfd6bb5cba026f0ed988ba33e13d8e49e15",
  //     "0x070c3de0eec9524bc2b6c89976b914807e487d90",
  //     "0xac35195f17d5b52d3dac2d1cf6f15762ccbc4a2a",
  //     "0xac35195f17d5b52d3dac2d1cf6f15762ccbc4a2a",
  //     "0xc9e60767be3c0e812301ab2f38237ec52b56a009",
  //     "0x702a3f3f6543db1fd3f6d340c959ea75d55d8580",
  //     "0xf0ba985fb60da9047d696d567f2a438ecf7bd9e5",
  //     "0x9b65bd5b2feea51a5e44eb579fc1e012873d3ea7",
  //     "0xb41ca07d340d260022fc91e600340cd9e463334f",
  //     "0x2bc185d38b7de6ff64e3ffdab462b4df853c953c",
  //     "0x81514b4740c83f0c83d23886f90a3729f2719705",
  //     "0x46dc081af95a74d7800caf16702ca4553ae115e7",
  //     "0x46dc081af95a74d7800caf16702ca4553ae115e7",
  //     "0x94516dc3eb8131720e2511307675b09a5688e385",
  //     "0x17eca59c620f1049a0f44c774c1ab6c0e111169e",
  //     "0xf1601e335e6045621b01b53af1107ed06456a18a",
  //     "0x11b338b4fc139dc74b47cd304c65b64dbc107e20",
  //     "0x30f204069114870168a0c8601bd1c404486ad8c1",
  //     "0x0b9412df2c8802e7fcc2d000392f16fd0df2bfee",
  //     "0xc924d62e8a000a2490b90475115f5e652108ee19",
  //     "0x7351a6f7eecfad4b373a0c83aaabbd4c9cdb3611",
  //     "0x3d5f305b7b63a3c44c073b96932c21176be24b04",
  //     "0x84861b33ba6c7ae0dc01e0e3192e74d133d9a13a",
  //     "0x45c1f5dd506ea625db3fd9ec69defa718d982d98",
  //     "0x359ae07b23af46a9dac41a9000f036466630901a",
  //     "0x7b600f870ef7a7e3caf637be5edf6ed863f01e2e",
  //     "0xcefb18bacbd75fc849efb718001e49cdf970b89a",
  //     "0x9b65bd5b2feea51a5e44eb579fc1e012873d3ea7",
  //     "0x00aee3177185e7da3b36ee44dd01c1615596a183",
  //     "0x251f16be1f60a3e1a820eb1c05044480ad1a70a6",
  //     "0x2e0ebd3d06e3bcbe93acebf912e63c3a7d486edc",
  //     "0x9c50a3caf5a70529b49e8db964fde3314397d90e",
  //     "0x193f9c60b8a93d1ae4e565597a26933efa4be8a7",
  //     "0x543a2a44498270927ade9be493f25d5315aabd70",
  //     "0xdff214084fee648c8e0bc0838c1fa5e8548f58ac",
  //     "0xdff214084fee648c8e0bc0838c1fa5e8548f58ac",
  //     "0xb0799d85fafc89c81c6c84f1c049769166d60627",
  //     "0x4bac609737ce0de30776146b2fff28336b21f885",
  //     "0xf069686f579ed866d7ee1cd3fcb597f9bb37c1b3",
  //     "0x97bf03d0205ee363d9ec877b7b239aa788c0a340",
  //     "0xfa264b94554e24313b330533ed4cf2001d609f35",
  //     "0xe0c265f06b074f30c97ffb76d6b48e34b3d95e2b",
  //     "0xc2872831e2fc7d031d1197b3ce55fe334d94b70c",
  //     "0xe1c8d716d9a3f7381f75198c145d1ff816c86b31",
  //     "0x94d7f052993dd07a4c13915a5d797c5105d77ed9",
  //     "0x24af2db59ac35a64926203cfbd444f492802c4c9",
  //     "0x5d7ad6fac60bf00a0454520dc163af1d2a97b491",
  //     "0x3c952d426424ef11129b0aa2246ac9896cf1fae9",
  //     "0x6ce0fb258e01fd450587077023ad74cf6c60736c",
  //     "0x3f7e6fd20879a28dec0199ee142695fd5f55251b",
  //     "0x44f6f92bd26c4a5d82f7593d5539d5a951286d84",
  //     "0x753bea3d7af9517730b7c0bec5c951927ce91453",
  //     "0x30f204069114870168a0c8601bd1c404486ad8c1",
  //     "0x2471edb82873e3754c70a9989575b7593647b337",
  //     "0x955282f33670754fd65274245e0133b29c79da25",
  //     "0x8c5438214f1d3163e63529d3960b7645556e9572",
  //     "0x133a899ccf46256ef505207bf48c87097c86fbdd",
  //     "0x99ac788d785cbc264395aa62fe7643682e2b9c54",
  //     "0x579bd1582e0a4800df4ac5f5796261ad3597a1fc",
  //     "0x62c4ee89051804f6c64dcc192ac3d424d3b43785",
  //   ],
  //   [
  //     true,
  //     true,
  //     true,
  //     true,
  //     true,
  //     true,
  //     true,
  //     true,
  //     true,
  //     true,
  //     true,
  //     true,
  //     true,
  //     true,
  //     true,
  //     true,
  //     true,
  //     true,
  //     true,
  //     true,
  //     true,
  //     true,
  //     true,
  //     true,
  //     true,
  //     true,
  //     true,
  //     true,
  //     true,
  //     true,
  //     true,
  //     true,
  //     true,
  //     true,
  //     true,
  //     true,
  //     true,
  //     true,
  //     true,
  //     true,
  //     true,
  //     true,
  //     true,
  //     true,
  //     true,
  //     true,
  //     true,
  //     true,
  //     true,
  //     true,
  //     true,
  //     true,
  //     true,
  //     true,
  //     true,
  //     true,
  //     true,
  //     true,
  //     true,
  //     true,
  //     true,
  //     true,
  //     true,
  //     true,
  //     true,
  //     true,
  //     true,
  //     true,
  //     true,
  //     true,
  //     true,
  //     true,
  //     true,
  //     true,
  //     true,
  //   ]
  // );
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
