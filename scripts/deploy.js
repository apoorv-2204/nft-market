// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// You can also run a script with `npx hardhat run <script>`. If you do that, Hardhat
// will compile your contracts, add the Hardhat Runtime Environment's members to the
// global scope, and execute the script.
const Hardhat = "hardhat";

async function main() {
    const nftMarketAbi = await ethers.getContractFactory("NFTMarket");
    const nftMarketContract = await nftMarketAbi.deploy();
    await nftMarketContract.deployed();
    console.log("nft market deployed to:", nftMarketContract.address);

    const NFTAbi = await ethers.getContractFactory("NFT");
    const nftContract = await NFTAbi.deploy(nftMarketContract.address);
    await nftContract.deployed();

    console.log("nft deployed to :", nftContract.address)
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});

