import { useState, useEffect } from 'react';
import { useAccount } from 'wagmi';
import { useTransferNFT } from '../../hooks/useTransferNFTs';
import { Icon } from '@iconify/react/dist/iconify.js';
import { formatEther } from 'ethers';
import React from 'react';
import { truncateString } from '../../utils';
import { Contract } from 'ethers';
import NFT_ABI from '../../ABI/nft.json';
import { getReadOnlyProvider } from '../../utils';

const NFTCard = ({ metadata, mintPrice, tokenId, nextTokenId, mintNFT }) => {
  const { address: connectedAddress } = useAccount();
  const [recipient, setRecipient] = useState('');
  const [loading, setLoading] = useState(false);
  const [isOwner, setIsOwner] = useState(false);
  const transferNFT = useTransferNFT();

  useEffect(() => {
    const checkOwnership = async () => {
      try {
        const contract = new Contract(
          import.meta.env.VITE_NFT_CONTRACT_ADDRESS,
          NFT_ABI,
          getReadOnlyProvider()
        );

        // Call the `ownerOf` function to check if the current user is the owner
        const owner = await contract.ownerOf(tokenId);
        setIsOwner(owner.toLowerCase() === connectedAddress?.toLowerCase());
      } catch (error) {
        console.error('Error checking ownership:', error);
      }
    };

    if (connectedAddress) {
      checkOwnership();
    }
  }, [connectedAddress, tokenId]);

  const handleTransfer = async () => {
    if (!recipient) return alert('Enter recipient address!');
    setLoading(true);
    const success = await transferNFT(tokenId, recipient); // Call the transfer function
    setLoading(false);
    if (success) {
      alert(`NFT ${tokenId} transferred to ${recipient}`);
      setRecipient(''); // Clear the input field after success
    }
  };

  return (
    <div className="w-full space-y-4 rounded-xl bg-secondary shadow-sm border border-tertiary p-2">
      <img
        src={metadata.image}
        alt={`${metadata.name} image`}
        className="rounded-xl w-full h-64"
      />
      <h1 className="font-bold">{metadata.name}</h1>
      <p className="text-s ">{truncateString(metadata.description, 100)}</p>

      <div className="flex gap-2">
        <Icon icon="ri:file-list-3-line" className="w-6 h-6" />
        <span>{metadata.attributes.length} Attributes</span>
      </div>

      <div className="flex gap-2">
        <Icon icon="ri:eth-line" className="w-6 h-6" />
        <span>{`${formatEther(mintPrice)} ETH`}</span>
      </div>

      <button
        disabled={Number(nextTokenId) !== tokenId}
        onClick={mintNFT}
        className="w-full p-4 bg-tertiary/80 rounded-md text-secondary font-bold disabled:bg-gray-500"
      >
        {Number(nextTokenId) <= tokenId ? 'Mint NFT' : 'Minted'}
      </button>

      {isOwner && (
        <>
          <input
            type="text"
            placeholder="Recipient Address"
            value={recipient}
            onChange={(e) => setRecipient(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md"
          />
          <button
            onClick={handleTransfer}
            disabled={loading}
            className="w-full p-2 bg-tertiary rounded-md text-white disabled:bg-gray-500"
          >
            {loading ? 'Transferring...' : 'Transfer NFT'}
          </button>
        </>
      )}
    </div>
  );
};

export default NFTCard;
