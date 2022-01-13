// SPDX-License-Identifier: AGPL-3.0
pragma solidity ^0.8;

interface IBondingCalculator {
    function markdown( address _LP ) external view returns ( uint );

    function valuation( address pair_, uint amount_ ) external view returns ( uint _value );

    function getBondTokenValue( address _pair, uint amount_ ) external view returns ( uint _value );

    function getPrincipleTokenValue( address _pair, uint amount_ ) external view returns ( uint _value );

    function getBondTokenPrice( address _pair ) external view returns ( uint _value );
}