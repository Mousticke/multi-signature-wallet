import React from 'react';
import ReactDOM from 'react-dom';
import "semantic-ui-css/semantic.min.css"
import './styles/index.css';
import App from './App';
import {Provider as Web3Provider, Updater as Web3Updater} from './contexts/web3Context'
ReactDOM.render(
    <React.StrictMode>
        <Web3Provider>
            <App />
            <Web3Updater/>
        </Web3Provider>       
    </React.StrictMode>, 
    document.getElementById('root')
);