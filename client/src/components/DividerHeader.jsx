import React from 'react'
import { Divider, Header } from 'semantic-ui-react'

function DividerHeader({ headerType, title }) {
  return (
    <Divider horizontal>
      <Header as={headerType}>{title}</Header>
    </Divider>
  )
}

export default DividerHeader
