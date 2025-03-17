import { Contract } from "ethers";
import NFT_ABI from "../ABI/nft.json";
import { getReadOnlyProvider } from "../utils";

export const getUserNFTs = async (userAddress) => {
    const contract = new Contract(
        import.meta.env.VITE_NFT_CONTRACT_ADDRESS,
        NFT_ABI,
        getReadOnlyProvider()
    );

    const tokenIds = [];
    const totalSupply = await contract.nextTokenId();

    for (let i = 0; i < totalSupply; i++) {
        const owner = await contract.ownerOf(i).catch(() => null);
        if (owner === userAddress) {
            tokenIds.push({ tokenId: i });
        }
    }

    return tokenIds;
};
