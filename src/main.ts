import {
    Ed25519Keypair,
    JsonRpcProvider,
    localnetConnection,
    RawSigner,
    TransactionBlock,
    Transactions,
    Keypair,
    SuiTransactionBlockResponse,
    devnetConnection,
    testnetConnection
} from "@mysten/sui.js";
import {Buffer} from "buffer";
import keccak256 from "keccak256";

// import {AssetMintingLib} from "./asset-minting-lib";

import {AssetMintingLib} from "@mirrorworld/sui.assetminting";


const provider: JsonRpcProvider = new JsonRpcProvider(testnetConnection);

const OwnerKey = "ACv2RzNDh2DtTkpfooEMM7TPKS3hGGX/zM5i3zI+O7un";
const CollectionCreateAuthorityKey = "7lk9LqUwWYGmahvHGzFu86CaAAlzpnQom/lF1KEzG8s=";
const NFTMintCapKey = "YUotnE6Ao7gmsqTVySL6QFJdIsltfggILipDFb2qIFQ=";
const UpdateAuthorityKey = "GfhzmHCB9C83/sGNuerDhXX3kvrB7YPruqzjNHto/Ug=";
const SigningAuthorityKey = "mllktba6l/kupMecYlQ9n3KTYl6mh12+gzBb0TlDorw=";
const FeePayerKey = "rXFRC3fGwZ0bNyRff27ZJRciyWhoOihexgbcBXHB0HI=";
const UserKey = "19mE97cpBnBWpbVfcHC4WzkRpxgLo6UUwKuRmDxtqAA=";

const OwnerKeypair = Ed25519Keypair.fromSecretKey(Buffer.from(OwnerKey, "base64").slice(1));
const CollectionCreateAuthorityKeypair = Ed25519Keypair.fromSecretKey(Buffer.from(CollectionCreateAuthorityKey, "base64"));
const NFTMintCapKeypair = Ed25519Keypair.fromSecretKey(Buffer.from(NFTMintCapKey, "base64"));
const UpdateAuthorityKeypair = Ed25519Keypair.fromSecretKey(Buffer.from(UpdateAuthorityKey, "base64"));
const SigningAuthorityKeypair = Ed25519Keypair.fromSecretKey(Buffer.from(SigningAuthorityKey, "base64"));
const FeePayerKeypair = Ed25519Keypair.fromSecretKey(Buffer.from(FeePayerKey, "base64"));
const UserKeypair = Ed25519Keypair.fromSecretKey(Buffer.from(UserKey, "base64"));

console.log("OwnerKey: ", OwnerKeypair.getPublicKey().toSuiAddress());
console.log("CollectionCreateAuthorityKey: ", CollectionCreateAuthorityKeypair.getPublicKey().toSuiAddress());
console.log("NFTMintCapKey: ", NFTMintCapKeypair.getPublicKey().toSuiAddress());
console.log("UpdateAuthorityKey: ", UpdateAuthorityKeypair.getPublicKey().toSuiAddress());
console.log("SigningAuthorityKey: ", SigningAuthorityKeypair.getPublicKey().toSuiAddress());
console.log("FeePayerKey: ", FeePayerKeypair.getPublicKey().toSuiAddress());
console.log("UserKey: ", UserKeypair.getPublicKey().toSuiAddress());

const OwnerSigner = new RawSigner(OwnerKeypair, provider);
const CollectionCreateAuthoritySigner = new RawSigner(CollectionCreateAuthorityKeypair, provider);
const NFTMintCapKeypairSigner = new RawSigner(NFTMintCapKeypair, provider);
const UpdateAuthorityKeypairSigner = new RawSigner(UpdateAuthorityKeypair, provider);
const SigningAuthoritySigner = new RawSigner(SigningAuthorityKeypair, provider);
const FeePayerSigner = new RawSigner(FeePayerKeypair, provider);
const UserSigner = new RawSigner(UserKeypair, provider);

let assetMintingLib: AssetMintingLib;

(async () => {
    console.log("Hello");

    const packageAddress = "0x4b8563ccf44aef795f0c51780df8e00d5e15c115f263151ceb0c8fae5aeeb892";

    const adminCapAddress = "0x4223fd3778a843b020f870ea5da13ad9e8de04fa7c99bf2f30cf26ac2e5c47da";

    const collectionCreateAuthorityCap = "0x6cee69491cb9f15562999c7914310eccc6665790d670a9f770c2268ebcd1cd88";

    const mintCapAddress = "0xc4b4f84c9f052e5c476105822b70f8f6789424081b1a1079cdaf1aef8cf382e2";

    const collectionConfigAddress = "0x38540ab1e48832afbaafc2f1c04210833cef93315eaddd3cc1e250260427772b";

    const nftImageUrl = "https://zwyk5xu3kq2sbn6hxhiw4txnbu6bhb5j5bnj73m7a4jees36uuda.arweave.net/zbCu3ptUNSC3x7nRbk7tDTwTh6noWp_tnwcSQkt-pQY";

    const nftMetadataUrl = "https://m6zsbnhyclkmaqkw62dyxpxo3qxfgb3niok3dv3sczi7epzazrja.arweave.net/Z7MgtPgS1MBBVvaHi77u3C5TB21DlbHXchZR8j8gzFI";

    const salt = "sniperv2";

    await provider.getRpcApiVersion();

    assetMintingLib = new AssetMintingLib(packageAddress, provider);

    // await requestSuiFromFaucet(OwnerKeypair.getPublicKey().toSuiAddress());
    // await requestSuiFromFaucet(CollectionCreateAuthorityKeypair.getPublicKey().toSuiAddress());
    // await requestSuiFromFaucet(NFTMintCapKeypair.getPublicKey().toSuiAddress());
    // await requestSuiFromFaucet(UpdateAuthorityKeypair.getPublicKey().toSuiAddress());
    // await requestSuiFromFaucet(FeePayerKeypair.getPublicKey().toSuiAddress());
    // await requestSuiFromFaucet(SigningAuthorityKeypair.getPublicKey().toSuiAddress());
    // await requestSuiFromFaucet("0xf5809bbde41ee8f4bdb6d79586476ddc925887a14f12a751584ffb95a3ee6cd2");


    const publicKeyHex = "0x" + Buffer.from(SigningAuthorityKeypair.getPublicKey().toBytes()).toString("hex");

    const hashMsg = new Uint8Array((keccak256(salt)));

    const sig = SigningAuthorityKeypair.signData(hashMsg);

    const sigHash = "0x" + Buffer.from(sig).toString("hex");

    // await createCollectionCreateAuthorityCap(OwnerSigner, FeePayerSigner, adminCapAddress, CollectionCreateAuthorityKeypair.getPublicKey().toSuiAddress());

    // await createCollection(CollectionCreateAuthoritySigner, FeePayerSigner, collectionCreateAuthorityCap, publicKeyHex,
    //     UpdateAuthorityKeypair.getPublicKey().toSuiAddress(), false, [3], NFTMintCapKeypair.getPublicKey().toSuiAddress(), "Bilal", "Bilal Collection",
    //     [
    //         UpdateAuthorityKeypair.getPublicKey().toSuiAddress(),
    //         CollectionCreateAuthorityKeypair.getPublicKey().toSuiAddress()
    //
    //     ]);

    // await mintNft(NFTMintCapKeypairSigner, FeePayerSigner, mintCapAddress, collectionConfigAddress, UserKeypair.getPublicKey().toSuiAddress(),
    //     "BNFT#2", "BNFT DESCRIPTION", nftImageUrl, ["age", "color"], ["2", "red"], [salt], [sigHash], packageAddress);

})();

async function transferObject(signer: RawSigner, objectId: string, newOwner: string) {
    const tx = new TransactionBlock();
    tx.transferObjects([
            tx.object(objectId)
        ],
        tx.pure(newOwner)
    );

    const result: SuiTransactionBlockResponse = await signer.signAndExecuteTransactionBlock({transactionBlock: tx});
    console.log({result});
}

async function requestSuiFromFaucet(address: string) {
    await provider.requestSuiFromFaucet(
        address
    );
}

async function createCollectionCreateAuthorityCap(adminSigner: RawSigner, feeSigner: RawSigner, superAdminCapAddress: string, collectionCreateAuthorityAddress: string) {
    const tx = await assetMintingLib.createCollectionCreateAuthorityCapTransaction(superAdminCapAddress, collectionCreateAuthorityAddress,
        (await adminSigner.getAddress()).toString(), (await feeSigner.getAddress()).toString());

    const adminSig = await assetMintingLib.signTransaction(tx, adminSigner);

    const feeSig = await assetMintingLib.signTransaction(tx, feeSigner);

    const result = await assetMintingLib.executeTransactionBlock(tx, [adminSig, feeSig]);

    console.log({result});
}

async function createCollection(collectionCreateAuthoritySigner: RawSigner, feeSigner: RawSigner, collectionCreateAuthorityCap: string,
                                singingAuthorityPublicKey: string, updateAuthorityAddress: string, isSingingAuthorityRequired: boolean, supply: any, nftMintCapOwnerAddress: string,
                                collectionName: string, collectionDescription: string, creatorList: any) {
    const tx = await assetMintingLib.createCollectionTransaction(collectionCreateAuthorityCap, singingAuthorityPublicKey, updateAuthorityAddress, isSingingAuthorityRequired, supply,
        nftMintCapOwnerAddress, collectionName, collectionDescription, creatorList, (await collectionCreateAuthoritySigner.getAddress()), (await feeSigner.getAddress()));
    const collectionCreateSig = await assetMintingLib.signTransaction(tx, collectionCreateAuthoritySigner);

    // tx.setGasBudget(1000000000000);

    const feeSig = await assetMintingLib.signTransaction(tx, feeSigner);

    const result = await assetMintingLib.executeTransactionBlock(tx, [collectionCreateSig, feeSig]);

    console.log({result});
}

async function mintNft(nftMintCapSigner: RawSigner, feeSigner: RawSigner, mintCapAddress: string, collectionConfigAddress: string, nftReceiverAddress: string,
                       nftName: string, nftDescription: string, nftUrl: string, aKeys: any, aValues: any, salt: any, signature: any, packageAddress: string) {


    const tx = await assetMintingLib.mintNftTransaction(mintCapAddress, collectionConfigAddress, nftReceiverAddress, nftName, nftDescription, nftUrl, aKeys, aKeys, salt, signature,
        await nftMintCapSigner.getAddress(), await feeSigner.getAddress())

    const nftMintCapSig = await assetMintingLib.signTransaction(tx, nftMintCapSigner);

    // tx.setGasBudget(1000000000000);

    const feeSig = await assetMintingLib.signTransaction(tx, feeSigner);

    const result = await assetMintingLib.executeTransactionBlock(tx, [nftMintCapSig, feeSig]);

    console.log({result});
}

function delay(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
