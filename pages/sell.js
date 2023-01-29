import { useState } from "react"
import * as ethers from 'ethers'
import Web3Modal from 'web3modal';
import * as ipfsHttpClient from 'ipfs-http-client'
import { useRouter } from "next/router"

import * as ContractInfo from "../config.js"
import NFTAbi from '../artifacts/contracts/NFT.sol/NFT.json';
import MarketAbi from '../artifacts/contracts/NFTMarket.sol/NFTMarket.json';


const PROJECT_ID = '2KuvBHvkJVHfKUcKhBCXak0cLpG'
const API_KEY_SECRET = "862963c0f4457d277b890c6a90c55cc7"
const MarketConAddr = ContractInfo.nftMarketContractAddress;
const NFTConAddr = ContractInfo.nftContractAddress;

const CUSTOM_IPFS_GATEWAY = "https://my-next-nft-market.infura-ipfs.io/ipfs/"

const auth = "Basic " + Buffer.from(PROJECT_ID + ":" + API_KEY_SECRET).toString("base64")
const client = ipfsHttpClient.create({
    host: "ipfs.infura.io", port: 5001, protocol: "https", headers: { authorization: auth }
})


const Sell = () => {
    const [fileUrl, setFileUrl] = useState(null);
    const [formInput, updateFormInput] = useState({ price: '', name: '', description: '' });
    const router = useRouter();


    async function onChange(e) {
        const file = e.target.files[0];
        try {
            const added = await client.add(
                file, {
                progress: (prog) => console.log(`received: ${prog}`)
            })
            var url = `${CUSTOM_IPFS_GATEWAY}${added.path}`
            console.log(url)
            setFileUrl(url);
        } catch (error) {
            console.log('Error uploading file: ', error)
        }
    }

    async function createMarketSale() {
        const { name, description, price } = formInput
        if (!name || !description || !price || !fileUrl) return

        const data = JSON.stringify({
            name, description, image: fileUrl
        })
        try {
            const added = await client.add(data)
            const url = `${CUSTOM_IPFS_GATEWAY}${added.path}`

            createSell(url)
        } catch (error) {
            console.log('Error uploading file: ', error)
        }
    }

    async function createSell(url) {
        const web3modal = new Web3Modal()
        const connection = await web3modal.connect()
        const provider = new ethers.providers.Web3Provider(connection);
        const signer = provider.getSigner()

        console.log(signer, "signer")
        console.log(url)
        let contract = new ethers.Contract(NFTConAddr, NFTAbi.abi, signer)
        let transaction = (await contract.createToken(url));
        transaction.gasLimit = 1000000;

        let tx = await transaction.wait()

        let event = tx.events[0]
        let value = event.args[2]
        let tokenId = value.toNumber()

        const price = ethers.utils.parseUnits(formInput.price.toString(), 'ether')

        let contract2 = new ethers.Contract(MarketConAddr, MarketAbi.abi, signer)
        let listingPrice = await contract2.getListingPrice()
        listingPrice = listingPrice.toString()

        // we need to send price instring
        let transaction2 = (await contract2.createMarketItem(MarketConAddr, tokenId, price, { value: listingPrice }));
        transaction.gasLimit = 1000000;
        let tx2 = await transaction2.wait()

        console.log(tx2.events, "tx2")
        router.push('/')

    }


    return (
        <>
            <div className="flex justify-center">
                <div className="w-1/2 flex flex-col pb-12">
                    <input placeholder="NFT Name" className="mt-8 border rounded p-4" onChange={e => updateFormInput({ ...formInput, name: e.target.value })} />
                    <input placeholder="NFT Description" className="mt-2 border rounded p-4" onChange={e => updateFormInput({ ...formInput, description: e.target.value })} />
                    <input placeholder="NFT Price in Matic" className="mt-2 border rounded p-4" onChange={e => updateFormInput({ ...formInput, price: e.target.value })} />
                    <input type="file" name="Asset" className="my-4" onChange={onChange} />
                    {
                        fileUrl && (
                            <img className="rounded mt-4" width="350" src={fileUrl} />
                        )
                    }
                    <button className="font-bold mt-4 bg-pink-500 text-white rounded p-4 shadow-lg" onClick={createMarketSale}>Create Digital Asset</button>


                </div>
            </div>
        </>
    )
}

export default Sell;