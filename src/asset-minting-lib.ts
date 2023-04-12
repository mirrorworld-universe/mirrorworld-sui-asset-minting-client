import {
    Ed25519Keypair,
    JsonRpcProvider,
    devnetConnection,
    RawSigner,
    TransactionBlock,
    Transactions,
    Keypair,
    SuiTransactionBlockResponse
} from "@mysten/sui.js";
import {Buffer} from "buffer";
import keccak256 from "keccak256";
import {promises} from "dns";
import {isAwaitExpression} from "tsutils";
export class AssetMintingLib {
    packageAddress: string;
    provider: JsonRpcProvider;

    constructor(packageAddress: string, provider: JsonRpcProvider = new JsonRpcProvider(devnetConnection)) {
        this.packageAddress = packageAddress;
        this.provider = provider;
    }

    async executeTransactionBlock(txb: TransactionBlock, signatures: string[]): Promise<SuiTransactionBlockResponse>{
        const res = await this.provider.executeTransactionBlock({
            transactionBlock: (await txb.build()),
            signature: signatures
        })

        return res;
    }

    async signTransaction(txb: TransactionBlock, signer: RawSigner): Promise<string> {
         return (await signer.signTransactionBlock({transactionBlock: txb})).signature;
    }

    async addFeePayerAndGasBudgetInTransaction(txb: TransactionBlock, senderAddress: string, feePayerAddress: string | undefined = undefined, gasBudget: number | undefined): Promise<TransactionBlock> {
        if (feePayerAddress != undefined) {
            txb.setGasOwner(feePayerAddress)
        }

        if (gasBudget != undefined) {
            txb.setGasBudget(gasBudget)
        }

        txb.setSender(senderAddress);

        return txb;
    }

    async createCollectionCreateAuthorityCapTransaction(superAdminCapAddress: string, collectionCreateAuthorityAddress: string,
                                                        superAdminAddress: string, feePayer: string | undefined = undefined, gasBudget: number| undefined = undefined): Promise<TransactionBlock> {
        const txb = new TransactionBlock();
        txb.add(Transactions.MoveCall({
            target: `${this.packageAddress}::asset_minting::create_collection_create_authority_cap`,
            arguments: [
                txb.pure(superAdminCapAddress),
                txb.pure(collectionCreateAuthorityAddress)
            ]
        }));

        await this.addFeePayerAndGasBudgetInTransaction(txb, superAdminAddress, feePayer, gasBudget);

        return txb;
    }

    async createCollectionTransaction(collectionCreateAuthorityCap: string, singingAuthorityPublicKey: string, updateAuthorityAddress: string, isSingingAuthorityRequired: boolean, supply: number[], nftMintCapOwnerAddress: string,
                                    collectionName: string, collectionDescription: string, creators: string[],
                                      collectionCreateAuthorityCapOwnerAddress: string, feePayer: string | undefined = undefined, gasBudget: number| undefined = undefined): Promise<TransactionBlock> {

        const txb = new TransactionBlock();

        txb.add(Transactions.MoveCall({
            target: `${this.packageAddress}::asset_minting::create_collection`,
            arguments: [
                txb.pure(collectionCreateAuthorityCap),
                txb.pure(singingAuthorityPublicKey),
                txb.pure(updateAuthorityAddress),
                txb.pure(isSingingAuthorityRequired),
                txb.pure(supply),
                txb.pure(nftMintCapOwnerAddress),
                txb.pure(collectionName),
                txb.pure(collectionDescription),
                txb.pure(creators)
            ]
        }));

        await this.addFeePayerAndGasBudgetInTransaction(txb, collectionCreateAuthorityCapOwnerAddress, feePayer, gasBudget);

        return txb;
    }


    async mintNftTransaction(mintCapAddress: string, collectionConfigAddress: string, nftReceiverAddress: string, nftName: string,
                             nftDescription: string, nftUrl: string, attributeKeys: string[], attributeValues: string[], salt: string[], signature: string[],
                             mintCapOwnerAddress: string, feePayer: string | undefined = undefined, gasBudget: number| undefined = undefined): Promise<TransactionBlock> {
        const txb = new TransactionBlock();

        txb.add(Transactions.MoveCall({
            target: `${this.packageAddress}::asset_minting::mint_nft`,
            arguments: [
                txb.pure(mintCapAddress),
                txb.pure(collectionConfigAddress),
                txb.pure(nftReceiverAddress),
                txb.pure(nftName),
                txb.pure(nftDescription),
                txb.pure(nftUrl),
                txb.pure(attributeKeys),
                txb.pure(attributeValues),
                txb.pure(salt),
                txb.pure(signature),
            ]
        }));

        await this.addFeePayerAndGasBudgetInTransaction(txb, mintCapOwnerAddress, feePayer, gasBudget);

        return txb;
    }
}
