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
        if ( IUniswapV3Pool( _pair ).token0() == SWAP ) {
            uint token0 = IERC20Metadata( IUniswapV2Pair( _pair ).token0() ).decimals();
            _value = (10 ** token0).mul(FixedPoint96.Q96).div(getPriceX96(_pair));
        } else {
            uint token1 = IERC20Metadata( IUniswapV2Pair( _pair ).token1() ).decimals();
            _value = getPriceX96(_pair).mul(10 ** token1).div(FixedPoint96.Q96);
        }
    }

    function getBondTokenPrice( address _pairSwap, address _pairPrinciple ) external view override returns ( uint _value ) {
        if ( IUniswapV3Pool( _pairSwap ).token0() == SWAP ) {
            uint token0 = IERC20Metadata( IUniswapV2Pair( _pairSwap ).token0() ).decimals();
            _value = (10 ** token0).mul(FixedPoint96.Q96).div(getPriceX96(_pairSwap));
        } else {
            uint token1 = IERC20Metadata( IUniswapV2Pair( _pairSwap ).token1() ).decimals();
            _value = getPriceX96(_pairSwap).mul(10 ** token1).div(FixedPoint96.Q96);
        }

        if ( IUniswapV3Pool( _pairPrinciple ).token0() == PRINCIPLE ) {
            _value = getPriceX96(_pairPrinciple).mul(_value).div(FixedPoint96.Q96);
        } else {
            _value = _value.mul(FixedPoint96.Q96).div(getPriceX96(_pairPrinciple));
        }
    }

    function getPrincipleTokenValue( address _pair, uint amount_ ) external view override returns ( uint _value ) {
        if ( IUniswapV3Pool( _pair ).token0() == SWAP ) {
            _value = getPriceX96(_pair).mul(amount_).div(FixedPoint96.Q96);
        } else {
            _value = amount_.mul(FixedPoint96.Q96).div(getPriceX96(_pair));
        }
    }

    function getPrincipleTokenValue( address _pairSwap, address _pairPrinciple, uint amount_ ) external view override returns ( uint _value ) {
        if ( IUniswapV3Pool( _pairSwap ).token0() == SWAP ) {
            _value = getPriceX96(_pairSwap).mul(amount_).div(FixedPoint96.Q96);
        } else {
            _value = amount_.mul(FixedPoint96.Q96).div(getPriceX96(_pairSwap));
        }

        if ( IUniswapV3Pool( _pairPrinciple ).token0() == PRINCIPLE ) {
            _value = _value.mul(FixedPoint96.Q96).div(getPriceX96(_pairPrinciple));
        } else {
            _value = getPriceX96(_pairPrinciple).mul(_value).div(FixedPoint96.Q96);
        }
    }

    function getBondTokenValue( address _pair, uint amount_ ) external view override returns ( uint _value ) {
        if ( IUniswapV3Pool(_pair).token0() == SWAP ) {
            _value = getPriceX96(_pair).mul(amount_).div(FixedPoint96.Q96);
        } else {
            _value = amount_.mul(FixedPoint96.Q96).div(getPriceX96(_pair));
        }
    }

    function getPriceX96(address _uniswapV3Pool) public view returns(uint256 _priceX96) {
        (uint160 sqrtPriceX96, , , , , , ) = IUniswapV3Pool(_uniswapV3Pool).slot0();
        return UniFullMath.mulDiv(sqrtPriceX96, sqrtPriceX96, FixedPoint96.Q96);
    }
}