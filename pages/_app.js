// import '@/styles/globals.css'

// export default function App({ Component, pageProps }) {
//   return <Component {...pageProps} />
// }

import "../styles/globals.css";
import Link from "next/link";

function MarketApp(data) {
  return (
    <>
      <div className="border-b p-6 bg-gradient-to-b from-orange-700 to to-blue-800" >
        <nav className="border-b p-6">
          <p className="text-4xl font-bold flex justify-center text-cyan-200">
            Corgi NFT Marketplace
          </p>
          <div className="flex justify-center p-8">
            <Link href="/" className="mr-6 text-xl  text-cyan-200 ">Home</Link>
            <Link href="/dashboard" className="mr-6 text-xl text-cyan-200"> Dashboard</Link>
            <Link href="/sell" className="mr-6 text-xl  text-cyan-200">Sell</Link>
            <Link href="/account" className="mr-6 text-xl text-cyan-200"> Account</Link>
          </div>
        </nav>
        <data.component{...data.pageprops} />
      </div>
    </>
  );
}

export default function App({ Component, pageProps }) {
  return (
    <MarketApp component={Component} pageprops={pageProps} />
  )
}
