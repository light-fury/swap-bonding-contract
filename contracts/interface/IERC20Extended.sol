// SPDX-License-Identifier: AGPL-3.0
pragma solidity ^0.8;

import "./IERC20.sol";

interface IERC20Extended is IERC20 {
    function decimals() external view returns (uint8);
    function burnFrom(address account, uint256 amount) external;
}