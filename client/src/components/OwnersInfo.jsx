import React from 'react'
import { Item } from "semantic-ui-react";

function OwnersInfo({owners}) {
    return (
        <Item.Group>
            {owners.map((owner, i) => (
            <Item key={i}>
                <Item.Content>
                    {owner}
                </Item.Content>
            </Item>
            ))}
        </Item.Group>
    )
}

export default OwnersInfo
