import React from 'react'
import Web3 from 'web3'
import { deposit } from '../api/multi-signature-wallet'
import { useWeb3Context } from '../contexts/web3Context'
import useAsync from '../hooks/useAsync'
import { Button, Form, Modal } from 'semantic-ui-react'

function DepositForm({ depositTriggerButton }) {
  const [open, setOpen] = React.useState(false)
  const {
    state: { web3, account },
  } = useWeb3Context()

  const [input, setInput] = React.useState('')
  const { pending, call } = useAsync(({ web3, account, value }) =>
    deposit(web3, account, { value })
  )

  const onChange = (e) => {
    setInput(e.target.value)
  }

  const onSubmit = async (e) => {
    if (pending) return
    if (!web3) {
      alert('No Web3')
      setOpen(false)
      return
    }
    const valueBN = Web3.utils.toBN(input)
    const zero = Web3.utils.toBN(0)
    if (valueBN.gt(zero)) {
      const value = input
      const { error } = await call({
        web3,
        account,
        value,
      })
      if (error) alert(`Error: ${error.message}`)
      else setInput('')
    }
    setOpen(false)
  }

  return (
    <Modal
      onClose={() => setOpen(false)}
      onOpen={() => setOpen(true)}
      open={open}
      trigger={depositTriggerButton}
    >
      <Modal.Header>Deposit into the Wallet</Modal.Header>
      <Modal.Content>
        <Form onSubmit={onSubmit}>
          <Form.Field>
            <Form.Input
              placeholder="Amount"
              name="amount"
              onChange={onChange}
            />
          </Form.Field>
          <Button type="submit">Submit</Button>
        </Form>
      </Modal.Content>
    </Modal>
  )
}

export default DepositForm
