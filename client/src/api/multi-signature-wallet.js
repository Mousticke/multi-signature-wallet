import TruffleContract from "@truffle/contract";
import multiSignatureWalletTruffle from "../contracts/MultiSignature.json";

const MultiSignatureWallet = TruffleContract(multiSignatureWalletTruffle)

export async function get(web3, account){
    MultiSignatureWallet.setProvider(web3.currentProvider)
    const multiSignature = await MultiSignatureWallet.deployed()
    
    const balance = await web3.eth.getBalance(multiSignature.address)
    const owners = await multiSignature.getOwner()
    const numConfirmationRequired = await multiSignature.numConformationsRequired()
    const transactionCount = await multiSignature.getTransactionCount()

    const countTrx = transactionCount.toNumber();
    const transactions = [];
    for(let i = 1; i<countTrx; i++)
    {
        const trxIndex = countTrx - i;
        if(trxIndex < 0)
            break;
        
        const trx = await multiSignature.getTransaction(trxIndex)
        const isConfirmed = await multiSignature.isTransactionConfirmed(trxIndex, account)
        transactions.push({
            trxIndex,
            to: trx.to,
            from: trx.from,
            value: trx.value,
            data: trx.data,
            executed: trx.executed,
            numConfirmations: trx.numConfirmations.toNumber(),
            isConfirmedByCurrentAccount: isConfirmed,
        })
    }

    return {
        address: multiSignature.address,
        balance,
        owners,
        numConfirmationRequired,
        transactionCount: countTrx,
        transactions
    }
}

export function subscribe(web3, address, callback){
    const multiSignature = new web3.eth.Contract(MultiSignatureWallet.abi, address)
    const res = multiSignature.events.allEvents((error, log) => {
        if(error)
            callback(error, null)
        else if(log)
            callback(null, log)
    })

    return () => res.unsubscribe()
}