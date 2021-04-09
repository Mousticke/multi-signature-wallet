import React, { useReducer, useEffect, createContext, useContext, useMemo, } from "react";
import { useWeb3Context } from "../contexts/web3Context";
import { get as getMultiSignatureWallet, subscribe } from "../api/multi-signature-wallet";
import Web3 from "web3";

const INITIAL_STATE = {
    address: "",
    balance: "0",
    owners: [],
    numConformationsRequired: 0,
    transactionCount: 0,
    transactions: [],
};
const SET = "SET";
const UPDATE_BALANCE = "UPDATE_BALANCE";
const CREATE_TRANSACTION = "CREATE_TRANSACTION";
const UPDATE_TRANSACTION = "UPDATE_TRANSACTION";

function reducer(state = INITIAL_STATE, action) {
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
        case CREATE_TRANSACTION: {
            const { data: { trxIndex, to, value, data, owner } } = action;
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
                ...state.transactions
            ]

            return {
                ...state,
                transactionCount: state.transactionCount +1,
                transactions
            }
        }
        case UPDATE_TRANSACTION: {
            const { data } = action;
            const trxIndex = parseInt(data.trxIndex);
            const transactions = state.transactions.map((trx) => {
                if(trx.trxIndex === trxIndex){
                    const updatedTrx = {
                        ...trx,
                    };

                    if(data.executed){
                        updatedTrx.executed = true
                    }
                    if(data.confirmed !== undefined){
                        if(data.confirmed){
                            updatedTrx.numConfirmations += 1
                            updatedTrx.isConfirmedByCurrentAccount = data.owner.toUpperCase() === data.account.toUpperCase()
                        }else{
                            updatedTrx.numConfirmations -= 1
                            if (data.owner.toUpperCase() === data.account.toUpperCase()) {
                                updatedTrx.isConfirmedByCurrentAccount = false;
                            }
                        }
                    }
                    return updatedTrx
                }
                return trx;
            });
            return {
                ...state,
                transactions
            }
        }
        default:
            return state;
    }
}

const MultiSignatureWalletContext = createContext({
    state: INITIAL_STATE,
    set: (_data) => { },
    updateBalance: (_data) => { },
    createTrx: (_data) => { },
    updateTrx: (_data) => { },
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


    const createTrx = (data) => {
        dispatch({
            type: CREATE_TRANSACTION,
            data
        })
    }

    const updateTrx = (data) => {
        dispatch({
            type: UPDATE_TRANSACTION,
            data
        })
    }

    return (
        <MultiSignatureWalletContext.Provider 
        value = {useMemo(
            () => ({
                state,
                set,
                updateBalance,
                createTrx,
                updateTrx
            }), [state]
        )}>
            {children}
        </MultiSignatureWalletContext.Provider>
    )
}

export function Updater() {
    const { state: { web3, account }, } = useWeb3Context();
    const { state, set, updateBalance, createTrx, updateTrx } = useMultiSignatureWalletContext();

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
                        case "Submit": {
                            createTrx(log.returnValues)
                            break;
                        }
                        case "Cancel": {
                            updateTrx({
                                ...log.returnValues,
                                confirmed: false,
                                account
                            })
                            break;
                        }
                        case "Confirm": {
                            updateTrx({
                                ...log.returnValues,
                                confirmed: true,
                                account
                            })
                            break;
                        }
                        case "Execute": {
                            updateTrx({
                                ...log.returnValues,
                                executed: true,
                                account
                            })
                            break;
                        }
                        default:
                            console.log(log);
                    }
                }
            })
        }
    }, [web3, state.address, account])


    return null
}