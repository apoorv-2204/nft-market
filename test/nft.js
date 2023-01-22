const Chai = require('chai');
const { ethers } = require('hardhat');
const { describe, it } = require('mocha');

describe("Nft market", function () {
    it("Should create and execute market sales", async function () {
        const marketContract = await (await ethers.getContractFactory("NFTMarket")).deploy();
        // await marketContract.deploy();
        console.log("Contract deployed to:", marketContract.address);

        const nftContract = await (await ethers.getContractFactory("NFT")).deploy(marketContract.address);
        console.log("Contract deployed to:", nftContract.address);

        let listingPrice = (await marketContract.getListingPrice()).toString();
        console.log("Listing price:", listingPrice);
        const sellingPrice = ethers.utils.parseUnits('5', 'ether');

        await nftContract.createToken('https://temp1.com');
        await nftContract.createToken('https://temp2.com');

        await marketContract.createMarketItem(nftContract.address, 1, sellingPrice, { value: listingPrice });
        await marketContract.createMarketItem(nftContract.address, 2, sellingPrice, { value: listingPrice });

        // last address is being taken as the buyer
        const [_, buyerAddress] = await ethers.getSigners();
        console.log("Buyer address:", buyerAddress.address);


        await marketContract.connect(buyerAddress).createMarketSale(nftContract.address, 1, { value: sellingPrice });

        let items = await marketContract.fetchMarketItems();

        items = await Promise.all(items.map(async (aItem) => {
            const tokenUri = await nftContract.tokenURI(aItem.tokenId.toString());
            let item = {
                price: aItem.price.toString(),
                tokenId: aItem.tokenId.toString(),
                seller: aItem.seller,
                owner: aItem.owner,
                tokenUri
            }

            return item;
        }))


        console.log("Items:", items);
    });

});