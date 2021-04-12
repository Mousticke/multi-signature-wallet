import React, { useReducer, useEffect, createContext, useContext, useMemo } from "react";
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
    dispatcher: (_data) => { },
});

export const useMultiSignatureWalletContext = () => {
    return useContext(MultiSignatureWalletContext)
}

export const Provider = ({children}) => {
    const [state, dispatch] = useReducer(reducer, INITIAL_STATE)

    const dispatcher = (data, type) => {
        dispatch({
            type: type,
            data
        })
    }
    const valueProvider = useMemo(() => ({
            state,
            dispatcher
        }),
        [state]
    )

    return (
        <MultiSignatureWalletContext.Provider 
        value = {valueProvider}>
            {children}
        </MultiSignatureWalletContext.Provider>
    )
}

export function Updater() {
    const { state: { web3, account }, } = useWeb3Context();
    const { state, dispatcher } = useMultiSignatureWalletContext();




    useEffect(() => {
        
        async function get(web3, account) {
            try {
                const data = await getMultiSignatureWallet(web3, account);
                dispatcher(data, SET)
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
                            dispatcher(log.returnValues, UPDATE_BALANCE)
                            break;
                        }
                        case "Submit": {
                            dispatcher(log.returnValues, CREATE_TRANSACTION)
                            break;
                        }
                        case "Cancel": {
                            dispatcher({
                                ...log.returnValues,
                                confirmed: false,
                                account
                            }, UPDATE_TRANSACTION)
                            break;
                        }
                        case "Confirm": {
                            dispatcher({
                                ...log.returnValues,
                                confirmed: true,
                                account
                            }, UPDATE_TRANSACTION)
                            break;
                        }
                        case "Execute": {
                            dispatcher({
                                ...log.returnValues,
                                executed: true,
                                account
                            }, UPDATE_TRANSACTION)
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