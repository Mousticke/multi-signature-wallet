import React from 'react'
import { Item, Segment } from 'semantic-ui-react'

function OwnersInfo({ owners }) {
  return (
    <Item.Group>
      {owners.map((owner, i) => (
        <Item key={i}>
          <Item.Content>
            <Segment>{owner}</Segment>
          </Item.Content>
        </Item>
      ))}
    </Item.Group>
  )
}

export default OwnersInfo
