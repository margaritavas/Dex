pragma solidity ^0.8.0;
pragma experimental ABIEncoderV2;


import "./wallet.sol";

contract Dex is Wallet {

enum Side {
    BUY,
    SELL
}

struct Order{
    uint id;
    address trader;
    bytes32 ticker;
    uint amount;
    uint price;
}

mapping(bytes32 => mapping(uint => Order[])) public orderBook;

function getOrderBook(bytes32 ticker, Side side) view public returns(Order[] memory){
    return orderBook[ticker][uint(side)];
}

//function createLimitOrder() {


}
