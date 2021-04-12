import React, {
  useReducer,
  useEffect,
  createContext,
  useContext,
  useMemo,
} from 'react'
import { useWeb3Context } from '../contexts/web3Context'
import {
  get as getMultiSignatureWallet,
  subscribe,
} from '../api/multi-signature-wallet'
import {
  INITIAL_STATE,
  UPDATE_BALANCE,
  CREATE_TRANSACTION,
  UPDATE_TRANSACTION,
  SET,
  MultiSignatureReducer,
} from '../reducers/multiSignatureReducer'
const MultiSignatureWalletContext = createContext({
  state: INITIAL_STATE,
  dispatch: (_data) => {},
})

export const useMultiSignatureWalletContext = () => {
  return useContext(MultiSignatureWalletContext)
}

export const Provider = ({ children }) => {
  const [state, dispatch] = useReducer(MultiSignatureReducer, INITIAL_STATE)

  const valueProvider = useMemo(
    () => ({
      state,
      dispatch,
    }),
    [state]
  )

  return (
    <MultiSignatureWalletContext.Provider value={valueProvider}>
      {children}
    </MultiSignatureWalletContext.Provider>
  )
}

export function MultiSignatureEvents() {
  const {
    state: { web3, account },
  } = useWeb3Context()
  const { state, dispatch } = useMultiSignatureWalletContext()

  useEffect(() => {
    async function get(web3, account) {
      try {
        const data = await getMultiSignatureWallet(web3, account)
        dispatch({ data, type: SET })
      } catch (error) {
        console.error(error)
      }
    }

    if (web3) get(web3, account)
  }, [web3, account, dispatch])

  useEffect(() => {
    if (web3 && state.address) {
      return subscribe(web3, state.address, (error, log) => {
        if (error) console.error(error)
        else if (log) {
          switch (log.event) {
            case 'Deposit': {
              dispatch({ data: log.returnValues, type: UPDATE_BALANCE })
              break
            }
            case 'Submit': {
              dispatch({ data: log.returnValues, type: CREATE_TRANSACTION })
              break
            }
            case 'Cancel': {
              dispatch({
                data: {
                  ...log.returnValues,
                  confirmed: false,
                  account,
                },
                type: UPDATE_TRANSACTION,
              })
              break
            }
            case 'Confirm': {
              dispatch({
                data: {
                  ...log.returnValues,
                  confirmed: true,
                  account,
                },
                type: UPDATE_TRANSACTION,
              })
              break
            }
            case 'Execute': {
              dispatch({
                data: {
                  ...log.returnValues,
                  executed: true,
                  account,
                },
                type: UPDATE_TRANSACTION,
              })
              break
            }
            default:
              console.log(log)
          }
        }
      })
    }
  }, [web3, state.address, account, dispatch])

  return null
}
