const hre = require('hardhat');
const { deployed } = require('./deployed');

async function main() {
  const WETH = await hre.ethers.getContractFactory('WETH');
  const weth = await WETH.deploy();
  await weth.deployed();
  await deployed('WETH', hre.network.name, weth.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
