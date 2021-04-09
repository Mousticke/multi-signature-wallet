import React from 'react';
import ReactDOM from 'react-dom';
import "semantic-ui-css/semantic.min.css"
import './styles/index.css';
import App from './App';
import {Provider as Web3Provider, Updater as Web3Updater} from './contexts/web3Context'
import {Provider as MultiSignatureWalletProvider, Updater as MultiSignatureWalletUpdater} from './contexts/multiSignatureContext'
ReactDOM.render(
    <React.StrictMode>
        <Web3Provider>
            <MultiSignatureWalletProvider>
                <App />
                <Web3Updater/>
                <MultiSignatureWalletUpdater />
            </MultiSignatureWalletProvider>      
        </Web3Provider>       
    </React.StrictMode>, 
    document.getElementById('root')
);