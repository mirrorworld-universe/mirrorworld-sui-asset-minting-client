import {
    Ed25519Keypair,
    JsonRpcProvider,
    localnetConnection,
    RawSigner,
    TransactionBlock,
    Transactions,
    Keypair,
    SuiTransactionBlockResponse
} from "@mysten/sui.js";
import {Buffer} from "buffer";
import keccak256 from "keccak256";

import {AssetMintingLib} from "./asset-minting-lib";


const provider: JsonRpcProvider = new JsonRpcProvider(localnetConnection);

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

    const packageAddress = "0x8aa6fe85a886d0ae80d36d382088d64edbb1e1c294c4a90cc07b6cb694b25be5";

    const adminCapAddress = "0xb5550af1ba248248a75eac73215e56e0873541784673d28aa8187bb090868d80";

    const collectionCreateAuthorityCap = "0x9a203737ade6c6c1c3e281aef5d234a5c7d4e91761761181cb491098f6678afb";

    const mintCapAddress = "0xe867985952e11bdecda796552809179cafdaf6492602fb938b6d3daaefe93032";

    const collectionConfigAddress = "0xe4ad707d237174db79bcded835c9797fc836f711a76559b9964677ec573a5370";

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

    await mintNft(NFTMintCapKeypairSigner, FeePayerSigner, mintCapAddress, collectionConfigAddress, UserKeypair.getPublicKey().toSuiAddress(),
        "BNFT#2", "BNFT DESCRIPTION", nftImageUrl, ["age", "color"], ["2", "red"], [salt], [sigHash], packageAddress);

})();

async function transferObject(signer: RawSigner, objectId: string, newOwner: string) {
    const tx = new TransactionBlock();
    tx.transferObjects([
            tx.object(objectId)
        ],
        tx.pure(newOwner)
    );

    const result = await signer.signAndExecuteTransactionBlock({transactionBlock: tx});
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

    const feeSig = await assetMintingLib.signTransaction(tx, feeSigner);

    const result = await assetMintingLib.executeTransactionBlock(tx, [collectionCreateSig, feeSig]);

    console.log({result});
}

async function mintNft(nftMintCapSigner: RawSigner, feeSigner: RawSigner, mintCapAddress: string, collectionConfigAddress: string, nftReceiverAddress: string,
                       nftName: string, nftDescription: string, nftUrl: string, aKeys: any, aValues: any, salt: any, signature: any, packageAddress: string) {
    const tx = new TransactionBlock();

    tx.add(Transactions.MoveCall({
        target: `${packageAddress}::asset_minting::mint_nft`,
        arguments: [
            tx.pure(mintCapAddress),
            tx.pure(collectionConfigAddress),
            tx.pure(nftReceiverAddress),
            tx.pure(nftName),
            tx.pure(nftDescription),
            tx.pure(nftUrl),
            tx.pure(aKeys),
            tx.pure(aValues),
            tx.pure(salt),
            tx.pure(signature),
        ]
    }));

    tx.setSender((await nftMintCapSigner.getAddress()).toString());
    tx.setGasOwner((await feeSigner.getAddress()).toString());

    tx.setGasBudget(500000000);

    const adminSig = await nftMintCapSigner.signTransactionBlock({transactionBlock: tx});

    const feeSig = await feeSigner.signTransactionBlock({transactionBlock: tx});

    const result = await provider.executeTransactionBlock({
        transactionBlock: adminSig.transactionBlockBytes, signature: [
            adminSig.signature,
            feeSig.signature
        ]
    });

    console.log({result});
}

function delay(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
