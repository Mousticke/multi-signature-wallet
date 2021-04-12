import React from 'react'
import './styles/App.css'
import MenuComponent from './components/Menu'
import HistoryEvents from './components/HistoryEvents'
import MetaMaskConnect from './components/MetaMaskConnect'
import { Grid, Segment } from 'semantic-ui-react'
import { useWeb3Context } from './contexts/web3Context'
import LeftPanel from './components/LeftPanel'
import TransactionTable from './components/TransactionTable'

const App = () => {
  const {
    state: { account, netId },
  } = useWeb3Context()

  return (
    <div className="App">
      {account ? (
        <>
          <MenuComponent account={account} netId={netId} />
          <Grid padded="horizontally" columns={2}>
            <Grid.Column width={4}>
              <LeftPanel />
            </Grid.Column>
            <Grid.Column width={11}>
              <Segment color="blue">
                <TransactionTable account={account} />
              </Segment>

              <Segment color="black">
                <HistoryEvents />
              </Segment>
            </Grid.Column>
          </Grid>
        </>
      ) : (
        <>
          <MenuComponent />
          <Grid columns={1} container verticalAlign="middle" centered>
            <Grid.Column>
              <MetaMaskConnect />
            </Grid.Column>
          </Grid>
        </>
      )}
    </div>
  )
}

export default App
