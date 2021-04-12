import Web3 from 'web3'

export const INITIAL_STATE = {
  address: '',
  balance: '0',
  owners: [],
  numConformationsRequired: 0,
  transactionCount: 0,
  transactions: [],
}
export const SET = 'SET'
export const UPDATE_BALANCE = 'UPDATE_BALANCE'
export const CREATE_TRANSACTION = 'CREATE_TRANSACTION'
export const UPDATE_TRANSACTION = 'UPDATE_TRANSACTION'

export function MultiSignatureReducer(state = INITIAL_STATE, action) {
  switch (action.type) {
    case SET: {
      return {
        ...state,
        ...action.data,
      }
    }
    case UPDATE_BALANCE: {
      return {
        ...state,
        balance: action.data.balance,
      }
    }
    case CREATE_TRANSACTION: {
      const {
        data: { trxIndex, to, value, data, owner },
      } = action
      const transactions = [
        {
          trxIndex: parseInt(trxIndex),
          to,
          from: owner,
          value: Web3.utils.toBN(value),
          data,
          executed: false,
          numConfirmations: 0,
          isConfirmedByCurrentAccount: false,
        },
        ...state.transactions,
      ]

      return {
        ...state,
        transactionCount: state.transactionCount + 1,
        transactions,
      }
    }
    case UPDATE_TRANSACTION: {
      const { data } = action
      const trxIndex = parseInt(data.trxIndex)
      const transactions = state.transactions.map((trx) => {
        if (trx.trxIndex === trxIndex) {
          const updatedTrx = {
            ...trx,
          }

          if (data.executed) {
            updatedTrx.executed = true
          }
          if (data.confirmed !== undefined) {
            if (data.confirmed) {
              updatedTrx.numConfirmations += 1
              updatedTrx.isConfirmedByCurrentAccount =
                data.owner.toUpperCase() === data.account.toUpperCase()
            } else {
              updatedTrx.numConfirmations -= 1
              if (data.owner.toUpperCase() === data.account.toUpperCase()) {
                updatedTrx.isConfirmedByCurrentAccount = false
              }
            }
          }
          return updatedTrx
        }
        return trx
      })
      return {
        ...state,
        transactions,
      }
    }
    default:
      return state
  }
}
