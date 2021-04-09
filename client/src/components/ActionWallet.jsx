import React from 'react'
import { Button } from "semantic-ui-react";
import DepositForm from './DepositForm';

function ActionWallet() {
    return (
        <Button.Group vertical labeled icon>
            <DepositForm depositTriggerButton={<Button icon='download' color='teal' content='Deposit' />} />          
            <Button.Or />
            <Button icon='key' color='green' content='Create Transaction' />
            <Button.Or />
            <Button icon='eye' color='blue' content='See Transaction' />
        </Button.Group>
    )
}

export default ActionWallet
