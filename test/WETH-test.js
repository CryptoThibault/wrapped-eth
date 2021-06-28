const { expect } = require('chai');
const { ethers } = require('hardhat');

describe('WETH', async function () {
  let WETH, weth, dev, alice, bob;
  const VALUE = ethers.utils.parseEther('1');
  const ADDRESS_ZERO = ethers.constants.AddressZero;
  beforeEach(async function () {
    [dev, alice, bob] = await ethers.getSigners();
    WETH = await ethers.getContractFactory('WETH');
    weth = await WETH.connect(dev).deploy();
    await weth.deployed();
  });
  describe('Wrap', async function () {
    let WRAP;
    beforeEach(async function () {
      WRAP = await weth.connect(alice).wrap({ value: VALUE });
    });
    it('should change ethers balances', async function () {
      expect(WRAP).changeEtherBalances([alice, weth], [VALUE.mul(-1), VALUE]);
    });
    it('should mint wETH to sender', async function () {
      expect(await weth.balanceOf(alice.address)).to.equal(VALUE);
      expect(WRAP).to.emit(weth, 'Transfer').withArgs(ADDRESS_ZERO, alice.address, VALUE);
    });
  });
  describe('Unwrap', async function () {
    let UNWRAP;
    beforeEach(async function () {
      await weth.connect(alice).wrap({ value: VALUE });
      UNWRAP = await weth.connect(alice).unwrap(VALUE);
    });
    it('should change ethers balances', async function () {
      expect(UNWRAP).changeEtherBalances([weth, alice], [VALUE.mul(-1), VALUE]);
    });
    it('should burn wETH from sender', async function () {
      expect(await weth.balanceOf(alice.address)).to.equal(0);
      expect(UNWRAP).to.emit(weth, 'Transfer').withArgs(alice.address, ADDRESS_ZERO, VALUE);
    });
    it('should reverts if amount exceed balance', async function () {
      await expect(weth.connect(bob).unwrap(VALUE)).to.revertedWith('ERC20: burn amount exceeds balance');
    });
  });
});
