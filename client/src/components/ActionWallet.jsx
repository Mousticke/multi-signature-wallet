import React from 'react'
import { Button } from 'semantic-ui-react'
import DepositForm from './DepositForm'
import TransactionForm from './TransactionForm'

function ActionWallet() {
  return (
    <Button.Group labeled icon>
      <DepositForm
        depositTriggerButton={
          <Button icon="download" color="blue" content="Deposit" />
        }
      />
      <Button.Or />
      <TransactionForm
        transactionTriggerButton={
          <Button icon="key" color="green" content="Create Transaction" />
        }
      />
    </Button.Group>
  )
}

export default ActionWallet
