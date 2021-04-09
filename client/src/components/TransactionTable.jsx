import React from 'react'
import { Table } from 'semantic-ui-react';
import {useMultiSignatureWalletContext} from '../contexts/multiSignatureContext'

function TransactionTable() {
    const {state} = useMultiSignatureWalletContext();

    return (
        <Table celled>
            <Table.Header>
                <Table.Row>
                    <Table.HeaderCell>From</Table.HeaderCell>
                    <Table.HeaderCell>To</Table.HeaderCell>
                    <Table.HeaderCell>Amount (wei)</Table.HeaderCell>
                    <Table.HeaderCell>Data</Table.HeaderCell>
                    <Table.HeaderCell>Status</Table.HeaderCell>
                    <Table.HeaderCell>Actions</Table.HeaderCell>
                </Table.Row>
            </Table.Header>

            <Table.Body>
                {state.transactions.map((trx) => (
                    <Table.Row key={trx.trxIndex}>
                        <Table.Cell>{trx.from}</Table.Cell>
                        <Table.Cell>{trx.to}</Table.Cell>
                        <Table.Cell>{trx.value}</Table.Cell>
                        <Table.Cell>{trx.data}</Table.Cell>
                        <Table.Cell>{trx.executed ? 'Pending' : 'Executed'}</Table.Cell>
                        <Table.Cell>Buttons</Table.Cell>
                    </Table.Row>
                ))}         
            </Table.Body>
        </Table>
    )
}

export default TransactionTable
