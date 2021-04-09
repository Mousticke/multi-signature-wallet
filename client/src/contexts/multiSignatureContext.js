import React, { useReducer, useEffect, createContext, useContext, useMemo, } from "react";
import { useWeb3Context } from "../contexts/web3Context";
import { get as getMultiSignatureWallet } from "../api/multi-signature-wallet";

const INITIAL_STATE = {
    address: "",
    balance: "0",
    owners: [],
    numConfirmationsRequired: 0,
    transactionCount: 0,
    transactions: [],
};
const SET = "SET";

function reducer(state = INITIAL_STATE, action) {
    switch (action.type) {
        case SET: {
            return{
                ...state,
                ...action.data
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

    return (
        <MultiSignatureWalletContext.Provider 
        value = {useMemo(
            () => ({
                state,
                set
            }), [state]
        )}>
            {children}
        </MultiSignatureWalletContext.Provider>
    )
}

export function Updater() {
    const { state: { web3, account }, } = useWeb3Context();
    const { set } = useMultiSignatureWalletContext();

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


    return null
}