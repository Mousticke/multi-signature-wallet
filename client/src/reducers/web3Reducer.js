export const UPDATE_ACCOUNT = 'UPDATE_ACCOUNT'
export const UPDATE_NET_ID = 'UPDATE_NET_ID'
export const INITIAL_STATE = {
  account: '',
  netId: 0,
  web3: null,
}

export function Web3Reducer(state = INITIAL_STATE, action) {
  switch (action.type) {
    case UPDATE_ACCOUNT: {
      const web3 = action.web3 || state.web3
      const { account } = action

      return {
        ...state,
        web3,
        account,
      }
    }
    case UPDATE_NET_ID: {
      const { netId } = action
      return {
        ...state,
        netId,
      }
    }
    default:
      return state
  }
}
