import React from "react";
import "./styles/App.css";
import MenuComponent from './components/Menu'
import MetaMaskConnect from './components/MetaMaskConnect'
import { Grid } from "semantic-ui-react";
import { useWeb3Context } from "./contexts/web3Context";

const App = () => {
  const {state:{account, netId}} = useWeb3Context()

  return (
    <div className="App">
      {account ? (
        <>
          <MenuComponent account={account} netId={netId}/>
          <p>Application</p>
        </>
        
      ) : (
        <>
          <MenuComponent/>
          <Grid columns={1} container verticalAlign="middle" centered>
            <Grid.Column>
              <MetaMaskConnect/>
            </Grid.Column>     
          </Grid>   
        </>
      )}
       
    </div>
  )
}

export default App;
