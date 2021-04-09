import Web3 from 'web3'

// https://docs.metamask.io/guide/ethereum-provider.html#table-of-contents

export async function unlockAccount(){
    const {ethereum} = window

    if(!ethereum){
        throw new Error("Web3 not found")
    }

    const web3 = new Web3(ethereum)
    //-> deprecated
    //await ethereum.enable() 
    //const accounts = await web3.eth.getAccounts()

    //new way
    const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
    return {web3, account: accounts[0] || ""}
}

export function subscribeAccount(web3, callback){
    const id = setInterval(async () => {
        try{
            //const accounts = await web3.eth.getAccounts() -> deprecated
            const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
            callback(null, accounts[0])
        } catch(err){
            callback(err, null)
        }
    }, 1000)

    return () => {
        clearInterval(id)
    }
}

export function subscribeNetwork(web3, callback){
    const id = setInterval(async () => {
        try{
            const netId = await web3.eth.net.getId()
            callback(null, netId)
        } catch(err){
            callback(err, null)
        }
    }, 1000)

    return () => {
        clearInterval(id)
    }
}