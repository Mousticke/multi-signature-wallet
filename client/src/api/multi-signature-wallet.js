import TruffleContract from '@truffle/contract'
import multiSignatureWalletTruffle from '../contracts/MultiSignature.json'

const MultiSignatureWallet = TruffleContract(multiSignatureWalletTruffle)
let arrayEventHistory = []

export async function get(web3, account) {
  MultiSignatureWallet.setProvider(web3.currentProvider)
  const multiSignature = await MultiSignatureWallet.deployed()
  const balance = await web3.eth.getBalance(multiSignature.address)
  const owners = await multiSignature.getOwner()
  const numConformationsRequired = await multiSignature.numConformationsRequired()
  const transactionCount = await multiSignature.getTransactionCount()
  const countTrx = transactionCount.toNumber()
  const transactions = []
  for (let i = 1; i <= countTrx; i++) {
    const trxIndex = countTrx - i
    if (trxIndex < 0) break

    const trx = await multiSignature.getTransaction(trxIndex)
    const isConfirmed = await multiSignature.isTransactionConfirmed(
      trxIndex,
      account
    )
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
    numConformationsRequired: numConformationsRequired.toNumber(),
    transactionCount: countTrx,
    transactions,
  }
}

export async function deposit(web3, account, params) {
  MultiSignatureWallet.setProvider(web3.currentProvider)
  const multiSignature = await MultiSignatureWallet.deployed()
  await window.ethereum.request({
    method: 'eth_sendTransaction',
    params: [
      {
        to: multiSignature.address,
        from: account,
        value: web3.utils.toHex(params.value),
      },
    ],
  })
}

export async function submitTrx(web3, account, params) {
  const { to, value, data } = params

  MultiSignatureWallet.setProvider(web3.currentProvider)
  const multiSignature = await MultiSignatureWallet.deployed()
  await multiSignature.submitTransaction(to, value, data, {
    from: account,
  })
}

export async function confirmTrx(web3, account, params) {
  const { trxIndex } = params

  MultiSignatureWallet.setProvider(web3.currentProvider)
  const multiSignature = await MultiSignatureWallet.deployed()
  await multiSignature.confirmTransaction(trxIndex, {
    from: account,
  })
}

export async function cancelConfirmation(web3, account, params) {
  const { trxIndex } = params

  MultiSignatureWallet.setProvider(web3.currentProvider)
  const multiSignature = await MultiSignatureWallet.deployed()
  await multiSignature.cancelConfirmation(trxIndex, {
    from: account,
  })
}

export async function executeTrx(web3, account, params) {
  const { trxIndex } = params
  MultiSignatureWallet.setProvider(web3.currentProvider)
  const multiSignature = await MultiSignatureWallet.deployed()
  console.log(trxIndex)
  await multiSignature.executeTransaction(trxIndex, { from: account })
}

export function subscribe(web3, address, callback) {
  const multiSignature = new web3.eth.Contract(
    MultiSignatureWallet.abi,
    address
  )
  multiSignature.events
    .allEvents()
    .on('data', (event) => {
      console.log(event)
      callback(null, event)
    })
    .on('error', (err) => {
      callback(err, null)
    })
}

export function getEventHistory(web3, address) {
  MultiSignatureWallet.setProvider(web3.currentProvider)
  const contract = new web3.eth.Contract(MultiSignatureWallet.abi, address)
  contract.getPastEvents(
    'allEvents',
    { fromBlock: 0, toBlock: 'latest' },
    (error, events) => {
      arrayEventHistory = [...events]
    }
  )

  return arrayEventHistory
}
