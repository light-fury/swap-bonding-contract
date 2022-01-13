// SPDX-License-Identifier: AGPL-3.0-or-later
pragma solidity ^0.8;

import "./library/SafeMath.sol";
import "./library/FixedPoint.sol";
import "./interface/IERC20Metadata.sol";
import "./interface/IUniswapV2Pair.sol";
import "./interface/IBondingCalculator.sol";

contract BondingCalculator is IBondingCalculator {

    using FixedPoint for *;
    using SafeMath for uint;
    using SafeMath for uint112;

    address public immutable SWAP;

    constructor( address _SWAP ) {
        require( _SWAP != address(0) );
        SWAP = _SWAP;
    }

    function getKValue( address _pair ) public view returns( uint k_ ) {
        uint token0 = IERC20Metadata( IUniswapV2Pair( _pair ).token0() ).decimals();
        uint token1 = IERC20Metadata( IUniswapV2Pair( _pair ).token1() ).decimals();
        uint decimals = token0.add( token1 ).sub( IERC20Metadata( _pair ).decimals() );

        (uint reserve0, uint reserve1, ) = IUniswapV2Pair( _pair ).getReserves();
        k_ = reserve0.mul(reserve1).div( 10 ** decimals );
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

    function getPrincipleTokenValue( address _pair, uint amount_ ) external view override returns ( uint _value ) {
        (uint reserve0, uint reserve1, ) = IUniswapV2Pair( _pair ).getReserves();

        if ( IUniswapV2Pair( _pair ).token0() == SWAP ) {
            _value = reserve0.mul(amount_).div(reserve1);
        } else {
            _value = reserve1.mul(amount_).div(reserve0);
        }
    }

    function getBondTokenValue( address _pair, uint amount_ ) external view override returns ( uint _value ) {
        (uint reserve0, uint reserve1, ) = IUniswapV2Pair( _pair ).getReserves();

        if ( IUniswapV2Pair( _pair ).token0() == SWAP ) {
            _value = reserve1.mul(amount_).div(reserve0);
        } else {
            _value = reserve0.mul(amount_).div(reserve1);
        }
    }

    function getTotalValue( address _pair ) public view returns ( uint _value ) {
        _value = getKValue( _pair ).sqrrt().mul(2);
    }

    function valuation( address _pair, uint amount_ ) external view override returns ( uint _value ) {
        uint totalValue = getTotalValue( _pair );
        uint totalSupply = IUniswapV2Pair( _pair ).totalSupply();

        _value = totalValue.mul( FixedPoint.fraction( amount_, totalSupply ).decode112with18() ).div( 1e18 );
    }

    function markdown( address _pair ) external view override returns ( uint ) {
        ( uint reserve0, uint reserve1, ) = IUniswapV2Pair( _pair ).getReserves();

        uint reserve;
        if ( IUniswapV2Pair( _pair ).token0() == SWAP ) {
            reserve = reserve1;
        } else {
            reserve = reserve0;
        }
        return reserve.mul( 2 * ( 10 ** IERC20Metadata( SWAP ).decimals() ) ).div( getTotalValue( _pair ) );
    }
}