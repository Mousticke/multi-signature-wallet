import React from 'react'
import useAsync from '../hooks/useAsync'
import { Button, Form, Modal, Message } from 'semantic-ui-react'
import { submitTrx } from '../api/multi-signature-wallet'
import { useWeb3Context } from '../contexts/web3Context'

function TransactionForm({ transactionTriggerButton }) {
  const [open, setOpen] = React.useState(false)
  const {
    state: { web3, account },
  } = useWeb3Context()

  const { pending, error, call } = useAsync(async (params) => {
    if (!web3) throw new Error('No web3')

    await submitTrx(web3, account, params)
  })

  const [inputs, setInputs] = React.useState({
    to: '',
    value: 0,
    data: '',
  })

  const onChange = (name, e) => {
    setInputs({
      ...inputs,
      [name]: e.target.value,
    })
  }

  const onSubmit = async (e) => {
    if (pending) {
      return
    }

    const { error } = await call({
      ...inputs,
      value: inputs.value.toString(),
    })

    if (!error) setOpen(false)
  }

  return (
    <Modal
      onClose={() => setOpen(false)}
      onOpen={() => setOpen(true)}
      open={open}
      trigger={transactionTriggerButton}
    >
      <Modal.Header>Create a new Transaction</Modal.Header>
      <Modal.Content>
        {error && <Message error>{error.message}</Message>}
        <Form onSubmit={onSubmit}>
          <Form.Field>
            <Form.Input
              placeholder="To"
              name="to"
              value={inputs.to}
              onChange={(e) => onChange('to', e)}
            />
          </Form.Field>
          <Form.Field>
            <Form.Input
              placeholder="Value"
              name="value"
              value={inputs.value}
              onChange={(e) => onChange('value', e)}
            />
          </Form.Field>
          <Form.Field>
            <Form.Input
              placeholder="Data"
              name="data"
              value={inputs.data}
              onChange={(e) => onChange('data', e)}
            />
          </Form.Field>
          <Button type="submit">Submit</Button>
        </Form>
      </Modal.Content>
    </Modal>
  )
}

export default TransactionForm
