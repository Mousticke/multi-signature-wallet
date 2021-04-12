import React from 'react'
import { useMultiSignatureWalletContext } from '../contexts/multiSignatureContext'
import { Segment } from 'semantic-ui-react'
import ActionWallet from './ActionWallet'
import OwnersInfo from './OwnersInfo'
import DividerHeader from './DividerHeader'

function LeftPanel() {
  const { state } = useMultiSignatureWalletContext()

  return (
    <Segment color="blue">
      <Segment>Balance : {state.balance} wei</Segment>
      <DividerHeader headerType="h4" title="Owners" />
      <OwnersInfo owners={state.owners} />
      <DividerHeader headerType="h4" title="Actions" />
      <ActionWallet />
    </Segment>
  )
}

export default LeftPanel
