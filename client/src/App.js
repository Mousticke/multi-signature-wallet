import React from "react";
import "./styles/App.css";
import MenuComponent from './components/Menu'
import MetaMaskConnect from './components/MetaMaskConnect'
import { Divider, Grid, Header, Item, Segment, Icon, Button } from "semantic-ui-react";
import { useWeb3Context } from "./contexts/web3Context";

//TODO : Add a feed


const App = () => {
  const {state:{account, netId}} = useWeb3Context()

  return (
    <div className="App">
      {account ? (
        <>
          <MenuComponent account={account} netId={netId}/>
          <Grid padded="horizontally" columns={2}>
            <Grid.Column width={3}>
              <Segment color='blue'>
                <p>Balance : 10000 Wei</p>
                <Divider horizontal>
                  <Header as='h4'>
                    Owners
                  </Header>
                </Divider>
                <Item.Group>
                  <Item>
                    <Item.Content>
                      
                      <Item.Header><Icon name='favorite' />Address 0x0001</Item.Header>
                    </Item.Content>
                  </Item>
                  <Item>
                    <Item.Content>
                    
                      <Item.Header><Icon name='favorite' />Address 0x0002</Item.Header>
                    </Item.Content>
                  </Item>
                  <Item>
                    <Item.Content>
                      
                      <Item.Header><Icon name='favorite' />Address 0x0003</Item.Header>
                    </Item.Content>
                  </Item>
                </Item.Group>
                <Divider horizontal>
                  <Header as='h4'>
                    Actions
                  </Header>
                </Divider>
                <Button.Group vertical labeled icon centered>
                  <Button icon='download' color='teal' content='Deposit' />
                  <Button.Or />
                  <Button icon='key' color='green' content='Create Transaction' />
                  <Button.Or />
                  <Button icon='eye' color='blue' content='See Transaction' />
                </Button.Group>
              </Segment>
            </Grid.Column>   
            <Grid.Column width={12}>
              <Segment color='blue'>Application</Segment>
            </Grid.Column>     
          </Grid>   
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
