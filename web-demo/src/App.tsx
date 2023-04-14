import React, { useState } from 'react'
import './App.css'
import { useMetaMask } from 'metamask-react'
import ProtectButton, { HintPreferences } from "protect-button"

function App() {
  const { status, connect, addChain } = useMetaMask()
  const [mevShareDisabled, setMevShareDisabled] = useState(false)
  const [showExperimental, setShowExperimental] = useState(false)
  // hints
  const [calldata, setCalldata] = useState(false)
  const [contractAddress, setContractAddress] = useState(false)
  const [functionSelector, setFunctionSelector] = useState(false)
  const [logs, setLogs] = useState(false)

  const getHints = () => mevShareDisabled ?
    ({ calldata: false, contractAddress: false, functionSelector: false, logs: false }) :
    showExperimental ?
      ({ calldata, contractAddress, functionSelector, logs }) :
      undefined

  const noHintsSelected = (hints?: HintPreferences) => {
    return hints ? Object.values(hints).reduce((acc, curr) => acc && curr === false, true) : true
  }

  /** Converts hints into format that the API would receive.
   *
   * For display purposes only -- ProtectButton handles this internally.
  */
  const mungeHints = () => {
    const hints = getHints()
    return mevShareDisabled ? {
      transaction_hash: true,
    } :
      noHintsSelected(hints) ? {} :
        hints && {
          calldata: hints.calldata,
          contract_address: hints.contractAddress,
          function_selector: hints.functionSelector,
          logs: hints.logs,
          transaction_hash: true, // tx hash is always shared on Flashbots Matchmaker
        }
  }

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
          <div style={{ display: "flex", alignItems: "stretch" }}>
            <div className="checkbox-context">
              <label htmlFor='auction' style={{ fontSize: 12 }}>MEV-Share Disabled</label>
              <input id='auction' type="checkbox" checked={mevShareDisabled} onChange={(e) => {
                setMevShareDisabled(e.target.checked)
              }} />
            </div>
            {!mevShareDisabled && <div className='checkbox-context'>
              <label htmlFor='experimental' style={{ fontSize: 12 }}>Show Experimental Options</label>
              <input id='experimental' type="checkbox" checked={showExperimental} onChange={(e) => {
                setShowExperimental(e.target.checked)
              }} />
            </div>}
            {showExperimental && !mevShareDisabled && <div>
              <div className="checkbox-context">
                <label htmlFor='calldata' style={{ fontSize: 12 }}>calldata</label>
                <input disabled={mevShareDisabled} id='calldata' type="checkbox" checked={calldata} onChange={(e) => {
                  setCalldata(e.target.checked)
                }} />
              </div>
              <div className="checkbox-context">
                <label htmlFor='contractAddress' style={{ fontSize: 12 }}>contract address</label>
                <input disabled={mevShareDisabled} id='contractAddress' type="checkbox" checked={contractAddress} onChange={(e) => {
                  setContractAddress(e.target.checked)
                }} />
              </div>
              <div className="checkbox-context">
                <label htmlFor='functionSelector' style={{ fontSize: 12 }}>function selector</label>
                <input disabled={mevShareDisabled} id='functionSelector' type="checkbox" checked={functionSelector} onChange={(e) => {
                  setFunctionSelector(e.target.checked)
                }} />
              </div>
              <div className="checkbox-context">
                <label htmlFor='logs' style={{ fontSize: 12 }}>logs</label>
                <input disabled={mevShareDisabled} id='logs' type="checkbox" checked={logs} onChange={(e) => {
                  setLogs(e.target.checked)
                }} />
              </div>
            </div>}
          </div>
          <div>
            <code style={{ fontSize: 12 }}>Hints: {(() => {
              const mungedHints = Object.entries(mungeHints() || {}).filter(([_, v]) => !!v).map(([k,]) => k)
              return Object.keys(mungedHints).length === 0 ? "Stable Configuration" : JSON.stringify(mungedHints)
            })()}</code>
          </div>
          <div style={{ margin: 32 }}>
            <ProtectButton addChain={addChain} chainId={1} auctionHints={getHints()}>Connect to Protect (Mainnet)</ProtectButton>
            <ProtectButton addChain={addChain} chainId={5} auctionHints={getHints()}>Connect to Protect (Goerli)</ProtectButton>
          </div>
        </>)}
      </header>
    </div>
  );
}

export default App
