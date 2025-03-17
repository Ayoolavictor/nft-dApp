import { useEffect, useState } from 'react';
import { useAccount } from 'wagmi';
import { useAppContext } from '../contexts/appContext';
import NFTCard from '../components/NFTCard';
import { getUserNFTs } from '../hooks/useGetUserNFTs';
import Header from '../components/Header';
import Footer from '../components/Footer';

const MyNFTs = () => {
  const { tokenMetaData, mintPrice } = useAppContext();
  const { address, isConnected } = useAccount();
  const [userNFTs, setUserNFTs] = useState([]);

  useEffect(() => {
    if (isConnected && address) {
      getUserNFTs(address).then(setUserNFTs);
    }
  }, [address, isConnected]);

  return (
    <div>
      <Header />
      <main className="h-full min-h-[calc(100vh-128px)] p-4">
        <div className="text-center">
          <h1 className="text-3xl font-bold">My NFTs</h1>
          <p className="text-tertiary font-medium">View NFTs you have minted</p>
        </div>

        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-8">
          {userNFTs.length === 0 ? (
            <p>No NFTs found for this account.</p>
          ) : (
            userNFTs.map(({ tokenId }) => {
              const metadata = tokenMetaData.get(tokenId);
              return metadata ? (
                <NFTCard
                  key={tokenId}
                  metadata={metadata}
                  mintPrice={mintPrice}
                  tokenId={tokenId}
                />
              ) : null;
            })
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default MyNFTs;
