import React, { useReducer, createContext, useContext, useMemo } from 'react'
import {
  Web3Reducer,
  INITIAL_STATE,
  UPDATE_NET_ID,
} from '../reducers/web3Reducer'

const Web3Context = createContext({
  state: INITIAL_STATE,
  dispatch: (_data) => {},
})

export function useWeb3Context() {
  return useContext(Web3Context)
}

export const Provider = ({ children }) => {
  const [state, dispatch] = useReducer(Web3Reducer, INITIAL_STATE)

  const valueProvider = useMemo(
    () => ({
      state,
      dispatch,
    }),
    [state]
  )

  return (
    <Web3Context.Provider value={valueProvider}>
      {children}
    </Web3Context.Provider>
  )
}

export const Web3Events = () => {
  const { state, dispatch } = useWeb3Context()

  window.ethereum.on('connect', function (init) {
    state.netId = init.chainId
  })

  window.ethereum.on('accountsChanged', function (account, error) {
    if (error) {
      console.error(error)
    }

    if (account !== undefined && account !== state.account) {
      window.location.reload()
    }
  })

  window.ethereum.on('chainChanged', function (netId, error) {
    if (error) {
      console.error(error)
    }
    if (netId) {
      if (state.netId === 0) dispatch({ netId, type: UPDATE_NET_ID })
      else if (netId !== state.netId) window.location.reload()
    }
  })

  return null
}
