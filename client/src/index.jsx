import React from 'react'
import ReactDOM from 'react-dom'
import 'semantic-ui-css/semantic.min.css'
import './styles/index.css'
import App from './App'
import { Provider as Web3Provider, Web3Events } from './contexts/web3Context'
import {
  Provider as MultiSignatureWalletProvider,
  MultiSignatureEvents,
} from './contexts/multiSignatureContext'
ReactDOM.render(
  <React.StrictMode>
    <Web3Provider>
      <MultiSignatureWalletProvider>
        <App />
        <Web3Events />
        <MultiSignatureEvents />
      </MultiSignatureWalletProvider>
    </Web3Provider>
  </React.StrictMode>,
  document.getElementById('root')
)
