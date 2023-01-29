import { useState, useEffect } from 'react'
import { ethers } from 'ethers'
import axios from 'axios'
import Web3Modal from 'web3modal';
// forr account management , and wallet management and d/f wallet support
import * as ContractInfo from "../config.js"
import NFTAbi from '../artifacts/contracts/NFT.sol/NFT.json';
import MarketAbi from '../artifacts/contracts/NFTMarket.sol/NFTMarket.json';

// index is use for home /
// function index() {
function Home() {
  const [nftList, setNftList] = useState([]);
  const [loadingState, setLoadingState] = useState('not-loaded');

  useEffect(() => {
    loadNFTs();
  }, []);

  async function loadNFTs() {
    // call sc and get list of nfts
    // whenever application loads
    const provider = new ethers.providers.JsonRpcProvider();
    // will connext to particular network
    // json rpc api remote procedure call
    const nfTokenContract = new ethers.Contract(ContractInfo.nftContractAddress, NFTAbi.abi, provider);
    const marketContract = new ethers.Contract(ContractInfo.nftMarketContractAddress, MarketAbi.abi, provider);

    const data = await marketContract.fetchMarketItems();
    const items = await Promise.all(data.map(async (i) => {
      // map through each item and return
      // for each item we want to get the token uri
      const tokenUri = await nfTokenContract.tokenURI(i.tokenId);
      // get the token uri
      const nftMetaData = await axios.get(tokenUri);
      // get the metadata
      let price = ethers.utils.formatUnits(i.price.toString(), 'ether');
      // format the price
      let item = {
        price,
        tokenId: i.tokenId.toNumber(),
        seller: i.seller,
        owner: i.owner,
        image: nftMetaData.data.image,
        name: nftMetaData.data.name,
        description: nftMetaData.data.description
      }
      return item;
    }))

    setNftList(items);
    setLoadingState('loaded');
    console.log(items);
  }

  async function buyNft(nft) {
    const web3modal = new Web3Modal();
    const connection = await web3modal.connect();
    const provider = new ethers.providers.Web3Provider(connection);


    const signer = provider.getSigner();
    const marketContract = new ethers.Contract(ContractInfo.nftMarketContractAddress, MarketAbi.abi, signer);

    const price = ethers.utils.parseUnits(nft.price.toString(), 'ether');
    const transaction = await marketContract.createMarketSale(ContractInfo.nftContractAddress, nft.tokenId, { value: price });
    // await transaction.wait(1);
    await transaction.wait();
    loadNFTs();

  }
  if (loadingState === 'loaded' && !nftList.length) {
    return (<> <div><p className="py-10 px-20 text-2xl font-bold flex justify-center text-cyan-500">
      THre are no items in market place <br /> come abck later
    </p>
    </div>
    </>)
  }
  return (
    <div className="flex justify-center">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 pt-5">
          {nftList.map((nft, i) => {
            <div key={i} className="border shadow rounded-xl overflow-hidden">
              <img src={nft.image} />
              <div className="p-4">
                <p style={{ height: '64px' }} className="text-2xl font-bold">{nft.name}</p>

                <div style={{ height: '70px', overflow: 'hidden' }}>
                  <p className="text-gray-400">{nft.description}</p>
                </div>
              </div>
              <div className="p-4 bg-blue">
                <p className="text-2xl mb-4 font-bold text-white">Price - {nft.price} Eth</p>


                <button className="w-full bg-pink-500 text-white font-bold py-2 px-12 rounded" onClick={() => buyNft(nft)}>
                  Buy
                </button>
              </div>
            </div>

          })}
        </div>
      </div>
    </div >
  );
}

export default Home

// import Head from 'next/head'
// import Image from 'next/image'
// import { Inter } from '@next/font/google'
// import styles from '@/styles/Home.module.css'

// const inter = Inter({ subsets: ['latin'] })

// export default function Home() {
//   return (
//     <>
//       <Head>
//         <title>Create Next App</title>
//         <meta name="description" content="Generated by create next app" />
//         <meta name="viewport" content="width=device-width, initial-scale=1" />
//         <link rel="icon" href="/favicon.ico" />
//       </Head>
//       <main className={styles.main}>
//         <div className={styles.description}>
//           <p>
//             Get started by editing&nbsp;
//             <code className={styles.code}>pages/index.js</code>
//           </p>
//           <div>
//             <a
//               href="https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
//               target="_blank"
//               rel="noopener noreferrer"
//             >
//               By{' '}
//               <Image
//                 src="/vercel.svg"
//                 alt="Vercel Logo"
//                 className={styles.vercelLogo}
//                 width={100}
//                 height={24}
//                 priority
//               />
//             </a>
//           </div>
//         </div>

//         <div className={styles.center}>
//           <Image
//             className={styles.logo}
//             src="/next.svg"
//             alt="Next.js Logo"
//             width={180}
//             height={37}
//             priority
//           />
//           <div className={styles.thirteen}>
//             <Image
//               src="/thirteen.svg"
//               alt="13"
//               width={40}
//               height={31}
//               priority
//             />
//           </div>
//         </div>

//         <div className={styles.grid}>
//           <a
//             href="https://nextjs.org/docs?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
//             className={styles.card}
//             target="_blank"
//             rel="noopener noreferrer"
//           >
//             <h2 className={inter.className}>
//               Docs <span>-&gt;</span>
//             </h2>
//             <p className={inter.className}>
//               Find in-depth information about Next.js features and&nbsp;API.
//             </p>
//           </a>

//           <a
//             href="https://nextjs.org/learn?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
//             className={styles.card}
//             target="_blank"
//             rel="noopener noreferrer"
//           >
//             <h2 className={inter.className}>
//               Learn <span>-&gt;</span>
//             </h2>
//             <p className={inter.className}>
//               Learn about Next.js in an interactive course with&nbsp;quizzes!
//             </p>
//           </a>

//           <a
//             href="https://vercel.com/templates?framework=next.js&utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
//             className={styles.card}
//             target="_blank"
//             rel="noopener noreferrer"
//           >
//             <h2 className={inter.className}>
//               Templates <span>-&gt;</span>
//             </h2>
//             <p className={inter.className}>
//               Discover and deploy boilerplate example Next.js&nbsp;projects.
//             </p>
//           </a>

//           <a
//             href="https://vercel.com/new?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
//             className={styles.card}
//             target="_blank"
//             rel="noopener noreferrer"
//           >
//             <h2 className={inter.className}>
//               Deploy <span>-&gt;</span>
//             </h2>
//             <p className={inter.className}>
//               Instantly deploy your Next.js site to a shareable URL
//               with&nbsp;Vercel.
//             </p>
//           </a>
//         </div>
//       </main>
//     </>
//   )
// }
