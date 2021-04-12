import React from 'react'
import { Menu } from 'semantic-ui-react'

function getNetwork(netId) {
  switch (netId) {
    case '0x1':
      return 'Mainnet'
    case '0x2':
      return 'Morden test network'
    case '0x3':
      return 'Ropsten network'
    case '0x4':
      return 'Rinkeby test network'
    case '0x2a':
      return 'Kovan test network'
    default:
      return 'Unknown network'
  }
}

function MenuComponent({ account, netId }) {
  return (
    <Menu stackable color="blue">
      {account ? (
        <>
          <Menu.Item header active>
            <p>Network : {getNetwork(netId)}</p>
          </Menu.Item>
          <Menu.Item header className="Menu__AppName">
            <p>Multi Signature Wallet</p>
          </Menu.Item>
          <Menu.Item position="right">
            <p>Account : {account}</p>
          </Menu.Item>
        </>
      ) : (
        <>
          <Menu.Item header active>
            <p>Network : Not Connected</p>
          </Menu.Item>
          <Menu.Item header className="Menu__AppName">
            <p>Multi Signature Wallet</p>
          </Menu.Item>
          <Menu.Item position="right">
            <p>No Account Connected</p>
          </Menu.Item>
        </>
      )}
    </Menu>
  )
}

export default MenuComponent
