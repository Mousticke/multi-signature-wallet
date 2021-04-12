import React from 'react'
import { Button, Card, Message } from 'semantic-ui-react'
import { useWeb3Context } from '../contexts/web3Context'
import { UPDATE_ACCOUNT } from '../reducers/web3Reducer'
import useAsync from '../hooks/useAsync'
import { unlockAccount } from '../web3/web3Utils'

function MetaMaskConnect() {
  const { pending, error, call } = useAsync(unlockAccount)
  const { dispatch } = useWeb3Context()
  async function onClickConnect() {
    const { error, data } = await call(null)
    if (error) {
      console.error(error)
    }
    if (data) {
      dispatch({ ...data, type: UPDATE_ACCOUNT })
    }
  }

  return (
    <>
      {error ? (
        <Message error>{error.message}</Message>
      ) : (
        <Message warning>MetaMask is not connected</Message>
      )}
      <Card centered>
        <Card.Content>
          <Card.Header>Metamask Disconnected</Card.Header>
          <Card.Meta>Metamask is needed</Card.Meta>
          <Card.Description>
            The application needs metamask for interacting with the blockchain
            and the smart contract on Ethereum network.
          </Card.Description>
        </Card.Content>
        <Card.Content extra>
          <div className="ui one buttons">
            <Button
              basic
              color="green"
              onClick={() => onClickConnect()}
              disabled={pending}
              loading={pending}
            >
              Connect to MetaMask
            </Button>
          </div>
        </Card.Content>
      </Card>
    </>
  )
}

export default MetaMaskConnect
