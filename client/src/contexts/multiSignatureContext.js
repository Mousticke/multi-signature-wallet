import React, { useReducer, useEffect, createContext, useContext, useMemo, } from "react";
import { useWeb3Context } from "../contexts/web3Context";
import { get as getMultiSignatureWallet, subscribe } from "../api/multi-signature-wallet";

const INITIAL_STATE = {
    address: "",
    balance: "0",
    owners: [],
    numConfirmationsRequired: 0,
    transactionCount: 0,
    transactions: [],
};
const SET = "SET";
const UPDATE_BALANCE = "UPDATE_BALANCE";

function reducer(state = INITIAL_STATE, action) {
    console.log(action)
    switch (action.type) {
        case SET: {
            return{
                ...state,
                ...action.data
            }
        }
        case UPDATE_BALANCE: {
            return{
                ...state,
                balance: action.data.balance
            }
        }
        default:
            return state;
    }
}

const MultiSignatureWalletContext = createContext({
    state: INITIAL_STATE,
    set: (_data) => { },
});

export const useMultiSignatureWalletContext = () => {
    return useContext(MultiSignatureWalletContext)
}

export const Provider = ({children}) => {
    const [state, dispatch] = useReducer(reducer, INITIAL_STATE)

    const set = (data) => {
        dispatch({
            type: SET,
            data
        })
    }

    const updateBalance = (data) => {
        dispatch({
            type: UPDATE_BALANCE,
            data
        })
    }

    return (
        <MultiSignatureWalletContext.Provider 
        value = {useMemo(
            () => ({
                state,
                set,
                updateBalance
            }), [state]
        )}>
            {children}
        </MultiSignatureWalletContext.Provider>
    )
}

export function Updater() {
    const { state: { web3, account }, } = useWeb3Context();
    const { state, set, updateBalance } = useMultiSignatureWalletContext();

    useEffect(() => {
        async function get(web3, account) {
            try {
                const data = await getMultiSignatureWallet(web3, account);
                set(data)
            } catch (error) {
                console.error(error);
            }
        }

        if(web3)
            get(web3, account)
    }, [web3, account])

    useEffect(() => {
        if(web3 && state.address){
            return subscribe(web3, state.address, (error, log) => {
                if(error)
                    console.error(error)
                else if(log){
                    switch(log.event){
                        case "Deposit": {
                            updateBalance(log.returnValues)
                            break;
                        }
                        default:
                            console.log(log);
                    }
                }
            })
        }
    }, [web3, state.address])


    return null
}