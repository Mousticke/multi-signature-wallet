import React from 'react'
import { Table, Button } from 'semantic-ui-react'
import { useMultiSignatureWalletContext } from '../contexts/multiSignatureContext'
import useAsync from '../hooks/useAsync'
import {
  cancelConfirmation,
  confirmTrx,
  executeTrx,
} from '../api/multi-signature-wallet'
import { useWeb3Context } from '../contexts/web3Context'

function TransactionTable({ account }) {
  const { state } = useMultiSignatureWalletContext()
  const {
    state: { web3 },
  } = useWeb3Context()

  const confirmTransaction = useAsync(async (trxIndex) => {
    if (!web3) {
      throw new Error('No web3')
    }

    await confirmTrx(web3, account, { trxIndex })
  })

  const cancelConfirmationTrx = useAsync(async (trxIndex) => {
    if (!web3) {
      throw new Error('No web3')
    }

    await cancelConfirmation(web3, account, { trxIndex })
  })

  const executeTransaction = useAsync(async (trxIndex) => {
    if (!web3) {
      throw new Error('No web3')
    }

    await executeTrx(web3, account, { trxIndex })
  })

  const renderAction = (trx) => {
    if (account.toUpperCase() === trx.from.toUpperCase()) {
      if (trx.executed === false) {
        if (trx.numConfirmations >= state.numConformationsRequired) {
          return (
            <Button
              color="green"
              onClick={(_e) => executeTransaction.call(trx.trxIndex)}
              loading={cancelConfirmationTrx.pending}
            >
              Execute
            </Button>
          )
        } else {
          return <p>Waiting...</p>
        }
      } else {
        return <p> - </p>
      }
    } else {
      if (trx.executed === false) {
        if (trx.numConfirmations >= state.numConformationsRequired) {
          return (
            <Button.Group vertical labeled>
              <Button
                color="red"
                onClick={(_e) => cancelConfirmationTrx.call(trx.trxIndex)}
                loading={cancelConfirmationTrx.pending}
              >
                Cancel
              </Button>
              <Button.Or />
              <Button
                color="green"
                onClick={(_e) => executeTransaction.call(trx.trxIndex)}
                loading={executeTransaction.pending}
              >
                Execute
              </Button>
            </Button.Group>
          )
        } else {
          if (trx.isConfirmedByCurrentAccount) {
            return (
              <Button
                color="red"
                onClick={(_e) => cancelConfirmationTrx.call(trx.trxIndex)}
                loading={cancelConfirmationTrx.pending}
              >
                Cancel
              </Button>
            )
          } else {
            return (
              <Button
                color="teal"
                loading={confirmTransaction.pending}
                onClick={(_e) => confirmTransaction.call(trx.trxIndex)}
              >
                Confirm
              </Button>
            )
          }
        }
      } else {
        return <p> - </p>
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
        {state.transactions.map((trx) => (
          <Table.Row key={trx.trxIndex}>
            <Table.Cell>{trx.from}</Table.Cell>
            <Table.Cell>{trx.to}</Table.Cell>
            <Table.Cell>{trx.value.toString()}</Table.Cell>
            <Table.Cell>{trx.data}</Table.Cell>
            <Table.Cell>
              {trx.executed ? <p>Executed</p> : <p>Pending</p>}
            </Table.Cell>
            <Table.Cell>{trx.numConfirmations}</Table.Cell>
            <Table.Cell>{renderAction(trx)}</Table.Cell>
          </Table.Row>
        ))}
      </Table.Body>
    </Table>
  )
}

export default TransactionTable
