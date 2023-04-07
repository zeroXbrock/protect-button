import React from 'react'
import './App.css'
import { useMetaMask } from 'metamask-react'
import ProtectButton from "protect-button"

function App() {
  const { status, connect, addChain } = useMetaMask()
  const [auctionEnabled, setAuctionEnabled] = React.useState(true)
  const hints = auctionEnabled ? {contractAddress: true, calldata: true, functionSelector: true, logs: true} : undefined

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
          <div style={{display: "flex", alignItems: "center"}}>
            <label htmlFor='auction' style={{fontSize: 12}}>MEV-Share</label>
            <input id='auction' type="checkbox" checked={auctionEnabled} onChange={(e) => {
              setAuctionEnabled(e.target.checked)
            }} />
          </div>
          <ProtectButton addChain={addChain} chainId={1} auctionHints={hints}>Connect to Protect (Mainnet)</ProtectButton>
          <ProtectButton addChain={addChain} chainId={5} auctionHints={hints}>Connect to Protect (Goerli)</ProtectButton>
        </>)}
      </header>
    </div>
  );
}

export default App
