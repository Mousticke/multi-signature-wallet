import React from 'react'
import { Table, Button } from 'semantic-ui-react';
import {useMultiSignatureWalletContext} from '../contexts/multiSignatureContext'

function TransactionTable({account}) {
    const {state} = useMultiSignatureWalletContext();

    const renderAction = (trx) => {
        if(account.toUpperCase() === trx.from.toUpperCase()){
            if(trx.executed === false){
                if(trx.numConfirmations >= state.numConformationsRequired){
                    return (
                        <Button>Execute 1 </Button>
                    )
                }else{
                    return (
                        <p>Waiting...</p>
                    )
                }
            }else{
                return (
                    <p> - </p>
                )
            }
            
        }else{
            if(trx.executed === false){
                if(trx.numConfirmations >= state.numConformationsRequired){
                    return (
                        <Button>Execute 2 </Button>
                    )
                }else{
                    if(trx.isConfirmedByCurrentAccount){
                        return (
                            <Button>Revoke</Button>
                        )
                    }else{
                        return (
                            <Button>Confirm</Button>
                        )
                    } 
                }
            }else{
                return (
                    <p> - </p>
                )
            }
        }
    }

    return (
        <Table celled>
            <Table.Header>
                <Table.Row>
                    <Table.HeaderCell>From</Table.HeaderCell>
                    <Table.HeaderCell>To</Table.HeaderCell>
                    <Table.HeaderCell>Amount (wei)</Table.HeaderCell>
                    <Table.HeaderCell>Data</Table.HeaderCell>
                    <Table.HeaderCell>Status</Table.HeaderCell>
                    <Table.HeaderCell>Confirmations</Table.HeaderCell>
                    <Table.HeaderCell>Actions</Table.HeaderCell>
                </Table.Row>
            </Table.Header>

            <Table.Body>
                {state.transactions.map(trx => (
                    <Table.Row key={trx.trxIndex}>
                        <Table.Cell>{trx.from}</Table.Cell>
                        <Table.Cell>{trx.to}</Table.Cell>
                        <Table.Cell>{trx.value.toString()}</Table.Cell>
                        <Table.Cell>{trx.data}</Table.Cell>
                        <Table.Cell>{trx.executed ? (<p>Executed</p>) : (<p>Pending</p>)}</Table.Cell>
                        <Table.Cell>{trx.numConfirmations}</Table.Cell>
                        <Table.Cell>{renderAction(trx)}</Table.Cell>
                    </Table.Row>
                ))}         
            </Table.Body>
        </Table>
    )
}

export default TransactionTable
