const Dex = artifacts.require("Dex");
const Link = artifacts.require("Link");
const truffleAssert = require("truffle-assertions");

contract.skip ("Dex", accounts => {
//The user must have ETH deposited such that deposited ETH >= buy order value
    it("should have enough ETH deposited to cover the buy order", async() =>{
    let dex = await Dex.deployed();
    let link = await Link.deployed();
    truffleAssert.reverts(dex.createLimitOrder(0, web3.utils.fromUtf8("LINK"), 10, 5));
    dex.depositEth({value:10});
    await truffleAssert.passes(dex.createLimitOrder(0, web3.utils.fromUtf8("LINK"), 5, 2));
    })

//The user must have enough tokens deposited such that token balance >= sell order amount
    it("should throw an error if token balance is too small when creating sell order", async() =>{
    let dex = await Dex.deployed();
    let link = await Link.deployed();
    await truffleAssert.reverts(dex.createLimitOrder(1, web3.utils.fromUtf8("LINK"), 10, 5));

    await link.approve(dex.address, 500);
    await dex.addToken(web3.utils.fromUtf8("LINK"), link.address, {from:accounts[0]})
    await dex.deposit(100, web3.utils.fromUtf8("LINK"));
    await truffleAssert.passes(dex.createLimitOrder(1, web3.utils.fromUtf8("LINK"), 10, 5));
    })


//The BUY order book should be ordered on price from highest to lowest starting at index 0
    it("The BUY order book should be ordered on price from highest to lowest starting at index 0", async() =>{
    let dex = await Dex.deployed();
    let link = await Link.deployed();
    await link.approve(dex.address, 500);
    await dex.depositEth({value:2000});
    await dex.createLimitOrder(0, web3.utils.fromUtf8("LINK"), 1, 500);
    await dex.createLimitOrder(0, web3.utils.fromUtf8("LINK"), 1, 300);
    await dex.createLimitOrder(0, web3.utils.fromUtf8("LINK"), 1, 400);

    let orderbook = await dex.getOrderBook(web3.utils.fromUtf8("LINK"), 0);
    assert(orderbook.length>0);
    console.log(orderbook);
        for (let i=0; i<orderbook.length-1; i++) {
        assert(orderbook[i].price >= orderbook[i+1].price, "not right order in buy book")
    }
})

//The SELL order book should be ordered on price from lowest to highest starting at index 0
it("The SELL order book should be ordered on price from highest to lowest starting at index 0", async() =>{
    let dex = await Dex.deployed();
    let link = await Link.deployed();
    await link.approve(dex.address, 500);
    await dex.createLimitOrder(1, web3.utils.fromUtf8("LINK"), 1, 500);
    await dex.createLimitOrder(1, web3.utils.fromUtf8("LINK"), 1, 300);
    await dex.createLimitOrder(1, web3.utils.fromUtf8("LINK"), 1, 400);

    let orderbook = await dex.getOrderBook(web3.utils.fromUtf8("LINK"), 1);
    assert(orderbook.length>0);
    for (let i=0; i<orderbook.length-1; i++) {
        assert(orderbook[i].price <= orderbook[i+1].price, "not right order in sell book")
    }
})
})