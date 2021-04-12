import Web3 from 'web3'

// https://docs.metamask.io/guide/ethereum-provider.html#table-of-contents

export async function unlockAccount() {
  const { ethereum } = window

  if (!ethereum) {
    throw new Error('Web3 not found')
  }

  const web3 = new Web3(ethereum)

  //-> deprecated
  //await ethereum.enable()
  //const accounts = await web3.eth.getAccounts()

  //new way
  try {
    const accounts = await window.ethereum.request({
      method: 'eth_requestAccounts',
    })
    return { web3, account: accounts[0] || '' }
  } catch (err) {
    if (err.code === 4001) {
      // EIP-1193 userRejectedRequest error
      // If this happens, the user rejected the connection request.
      console.log('Please connect to MetaMask.')
    } else {
      console.error(err)
    }
  }
}
