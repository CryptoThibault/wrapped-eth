//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.5;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract WETH is ERC20 {
  constructor() ERC20("Wrapped Ether","WETH") {}

  function wrap() public payable {
    _mint(msg.sender,  msg.value);
  }
  
  function unwrap(uint amount) public {
    _burn(msg.sender, amount);
    payable(msg.sender).transfer(amount);
  }
}