// SPDX-License-Identifier: AGPL-3.0-or-later
pragma solidity ^0.8;

import "@uniswap/v3-core/contracts/interfaces/IUniswapV3Pool.sol";
import "@uniswap/v3-core/contracts/libraries/FixedPoint96.sol";

import "./library/SafeMath.sol";
import "./library/UniFullMath.sol";
import "./library/FixedPoint.sol";
import "./interface/IERC20Metadata.sol";
import "./interface/IUniswapV2Pair.sol";
import "./interface/IBondingCalculator.sol";

contract BondingCalculatorV3 is IBondingCalculator {

    using FixedPoint for *;
    using SafeMath for uint;
    using SafeMath for uint112;

    address public immutable SWAP;
    address public immutable PRINCIPLE;

    constructor( address _SWAP, address _PRINCIPLE ) {
        require( _SWAP != address(0) );
        require( _PRINCIPLE != address(0) );
        SWAP = _SWAP;
        PRINCIPLE = _PRINCIPLE;
    }

    function getBondTokenPrice( address _pair ) external view override returns ( uint _value ) {
        (uint reserve0, uint reserve1, ) = IUniswapV2Pair( _pair ).getReserves();

        if ( IUniswapV2Pair( _pair ).token0() == SWAP ) {
            uint token0 = IERC20Metadata( IUniswapV2Pair( _pair ).token0() ).decimals();
            _value = reserve1.mul(10 ** token0).div(reserve0);
        } else {
            uint token1 = IERC20Metadata( IUniswapV2Pair( _pair ).token1() ).decimals();
            _value = reserve0.mul(10 ** token1).div(reserve1);
        }
    }

    function getBondTokenPrice( address _pairSwap, address _pairPrinciple ) external view override returns ( uint _value ) {
        (uint reserveS0, uint reserveS1, ) = IUniswapV2Pair( _pairSwap ).getReserves();
        (uint reserveP0, uint reserveP1, ) = IUniswapV2Pair( _pairPrinciple ).getReserves();

        if ( IUniswapV2Pair( _pairSwap ).token0() == SWAP ) {
            uint token0 = IERC20Metadata( IUniswapV2Pair( _pairSwap ).token0() ).decimals();
            _value = reserveS1.mul(10 ** token0).div(reserveS0);
        } else {
            uint token1 = IERC20Metadata( IUniswapV2Pair( _pairSwap ).token1() ).decimals();
            _value = reserveS0.mul(10 ** token1).div(reserveS1);
        }

        if ( IUniswapV2Pair( _pairPrinciple ).token0() == PRINCIPLE ) {
            _value = reserveP0.mul(_value).div(reserveP1);
        } else {
            _value = reserveP1.mul(_value).div(reserveP0);
        }
    }

    function getPrincipleTokenValue( address _pair, uint amount_ ) external view override returns ( uint _value ) {
        (uint reserve0, uint reserve1, ) = IUniswapV2Pair( _pair ).getReserves();

        if ( IUniswapV2Pair( _pair ).token0() == SWAP ) {
            _value = reserve0.mul(amount_).div(reserve1);
        } else {
            _value = reserve1.mul(amount_).div(reserve0);
        }
    }

    function getPrincipleTokenValue( address _pairSwap, address _pairPrinciple, uint amount_ ) external view override returns ( uint _value ) {
        (uint reserveS0, uint reserveS1, ) = IUniswapV2Pair( _pairSwap ).getReserves();
        (uint reserveP0, uint reserveP1, ) = IUniswapV2Pair( _pairPrinciple ).getReserves();

        if ( IUniswapV2Pair( _pairSwap ).token0() == SWAP ) {
            _value = reserveS0.mul(amount_).div(reserveS1);
        } else {
            _value = reserveS1.mul(amount_).div(reserveS0);
        }

        if ( IUniswapV2Pair( _pairPrinciple ).token0() == PRINCIPLE ) {
            _value = reserveP1.mul(_value).div(reserveP0);
        } else {
            _value = reserveP0.mul(_value).div(reserveP1);
        }
    }

    function getBondTokenValue( address _pair, uint amount_ ) external view override returns ( uint _value ) {
        if ( IUniswapV3Pool(_pair).token0() == SWAP ) {
            _value = getPriceX96(_pair).mul(amount_);
        } else {
            _value = amount_.div(getPriceX96(_pair));
        }
    }

    function getPriceX96(address uniswapV3Pool) public view returns(uint256 priceX96) {
        (uint160 sqrtPriceX96, , , , , , ) = IUniswapV3Pool(uniswapV3Pool).slot0();
        return UniFullMath.mulDiv(sqrtPriceX96, sqrtPriceX96, FixedPoint96.Q96);
    }
}