import { useState } from "react"
import ethers from 'ethers'
import axios from 'axios'
import Web3Modal from 'web3modal';
import ipfsHttpClient from 'ipfs-http-client'
// import { NFTStorage, Blob } from 'nft.storage'
import { useRouter } from "next/router"

import * as ContractInfo from "../config.js"
import NFTAbi from '../artifacts/contracts/NFT.sol/NFT.json';
import MarketAbi from '../artifacts/contracts/NFTMarket.sol/NFTMarket.json';


const PROJECT_ID = '2KuvBHvkJVHfKUcKhBCXak0cLpG'
const API_KEY_SECRET = "862963c0f4457d277b890c6a90c55cc7"

const auth = "Basic " + Buffer.from(PROJECT_ID + ":" + API_KEY_SECRET).toString("base64")
const client = ipfsHttpClient.create({ host: "ipfs.infura.io", port: 5001, protocol: "https" })


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
            const url = `https://ipfs.infura.io/ipfs/${added.path}`
            setFileUrl(url);
        } catch (error) {
            console.log('Error uploading file: ', error)
        }
    }


    return (
        <div>sell</div>
    )
}

export default Sell