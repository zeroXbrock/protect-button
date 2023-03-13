import React from 'react'
import './App.css'
import { useMetaMask } from 'metamask-react'
import ProtectButton from "protect-button"

function App() {
  const { status, connect, addChain } = useMetaMask()
  return (
    <div className="App">
      <header className="App-header">
        {status === 'notConnected' && (
          <button onClick={connect}>Connect to MetaMask</button>
        )}
        {status !== 'connected' && status !== "notConnected" && (
          <span>Connecting to MetaMask...</span>
        )}
        {status === 'connected' && (<>
          <ProtectButton>Connect to Protect (default params)</ProtectButton>
          <ProtectButton addChain={addChain} chainId={1}>Connect to Protect (Mainnet)</ProtectButton>
          <ProtectButton addChain={addChain} chainId={5}>Connect to Protect (Goerli)</ProtectButton>
          <ProtectButton chainId={5}>Connect to Protect (Goerli) (RAW)</ProtectButton>
        </>)}
      </header>
    </div>
  );
}

export default App
