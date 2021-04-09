import React, {useReducer, createContext, useContext, useEffect, useMemo} from "react"
import {subscribeAccount, subscribeNetwork} from "../web3/web3Utils"

const UPDATE_ACCOUNT = "UPDATE_ACCOUNT"
const UPDATE_NET_ID = "UPDATE_NET_ID";
const INITIAL_STATE = {
    account: "",
    netId: 0,
    web3: null
};

function reducer(state = INITIAL_STATE, action)
{
    switch(action.type){
        case UPDATE_ACCOUNT:{
            const web3 = action.web3 || state.web3
            const {account} = action

            return {
                ...state,
                web3,
                account
            }
        }
        case UPDATE_NET_ID:{
            const {netId} = action
            return {
                ...state,
                netId
            }
        }
        default:
            return state;
    }
}

const Web3Context = createContext({
    state: INITIAL_STATE, 
    updateAccount: (_data) => {},
    updateNetId: (_data) => { },
})

export function useWeb3Context(){
    return useContext(Web3Context)
}

export const Provider = ({children}) => {
    const [state, dispatch] = useReducer(reducer, INITIAL_STATE)

    const updateAccount = (data) => {
        dispatch({
            type: UPDATE_ACCOUNT,
            ...data
        })
    }

    const updateNetId = (data) => {
        dispatch({
            type: UPDATE_NET_ID,
            ...data
        })
    }    

    return (
        <Web3Context.Provider value={useMemo(
            () => ({
                state, 
                updateAccount,
                updateNetId
            }),
            [state]
        )}>
            {children}
        </Web3Context.Provider>
    )

}

export const Updater = () => {
    const {state, updateNetId} = useWeb3Context()

    useEffect(() => {
        if(state.web3){
            const unsubscribe = subscribeAccount(state.web3, (error, account) => {
                if(error){
                    console.error(error)
                }
                if(account !== undefined && account !== state.account){
                    window.location.reload();
                }
            });

            return unsubscribe
        }
    }, [state.web3, state.account]);

    useEffect(() => {
        if(state.web3){
            const unsubscribe = subscribeNetwork(state.web3, (error, netId) => {
                if(error){
                    console.error(error)
                }
                if(netId){
                    if(state.netId === 0)
                        updateNetId({netId});
                    else if(netId !== state.netId)
                        window.location.reload();
                }
            });

            return unsubscribe
        }
    }, [state.web3, state.netId, updateNetId]);

    return null;
}