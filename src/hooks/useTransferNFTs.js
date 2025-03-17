import { useCallback } from "react";
import { Contract } from "ethers";
import NFT_ABI from "../ABI/nft.json";
import { useConfig } from "wagmi";
import { getEthersSigner } from "../config/wallet-connection/adapter";

export const useTransferNFT = () => {
  const wagmiConfig = useConfig();

  return useCallback(
    async (tokenId, recipient) => {
      if (!recipient) {
        console.error("Recipient address is required");
        return false;
      }

      try {
        const signer = await getEthersSigner(wagmiConfig); 
        const contract = new Contract(
          import.meta.env.VITE_NFT_CONTRACT_ADDRESS,
          NFT_ABI,
          signer
        );

 
        const tx = await contract.safeTransferFrom(
          await signer.getAddress(),
          recipient, 
          tokenId 
        );

        await tx.wait(); 
        console.log(`NFT ${tokenId} transferred to ${recipient}`);
        return true;
      } catch (error) {
        console.error("Error transferring NFT:", error);
        return false;
      }
    },
    [wagmiConfig]
  );
};
