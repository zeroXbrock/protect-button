import React, {useState} from 'react'
import './App.css'
import { useMetaMask } from 'metamask-react'
import ProtectButton from "protect-button"

function App() {
  const { status, connect, addChain } = useMetaMask()
  const [calldata, setCalldata] = useState(false)
  const [contractAddress, setContractAddress] = useState(true)
  const [functionSelector, setFunctionSelector] = useState(true)
  const [logs, setLogs] = useState(true)

  const hints = {contractAddress, calldata, functionSelector, logs}

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
          <div style={{display: "flex", alignItems: "stretch"}}>
            <div className="checkbox-context">
              <label htmlFor='calldata' style={{fontSize: 12}}>calldata</label>
              <input id='calldata' type="checkbox" checked={calldata} onChange={(e) => {
                setCalldata(e.target.checked)
              }} />
            </div>
            <div className="checkbox-context">
              <label htmlFor='contractAddress' style={{fontSize: 12}}>contract address</label>
              <input id='contractAddress' type="checkbox" checked={contractAddress} onChange={(e) => {
                setContractAddress(e.target.checked)
              }} />
            </div>
            <div className="checkbox-context">
              <label htmlFor='functionSelector' style={{fontSize: 12}}>function selector</label>
              <input id='functionSelector' type="checkbox" checked={functionSelector} onChange={(e) => {
                setFunctionSelector(e.target.checked)
              }} />
            </div>
            <div className="checkbox-context">
              <label htmlFor='logs' style={{fontSize: 12}}>logs</label>
              <input id='logs' type="checkbox" checked={logs} onChange={(e) => {
                setLogs(e.target.checked)
              }} />
            </div>
          </div>
          <ProtectButton addChain={addChain} chainId={1} auctionHints={hints}>Connect to Protect (Mainnet)</ProtectButton>
          <ProtectButton addChain={addChain} chainId={5} auctionHints={hints}>Connect to Protect (Goerli)</ProtectButton>
        </>)}
      </header>
    </div>
  );
}

export default App
