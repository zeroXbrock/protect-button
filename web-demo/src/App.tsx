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

  const Checkbox = ({ label, id, checked, update, disabled }: { disabled?: boolean, label: string, id: string, checked: boolean, update: (val: boolean) => void }) => (
    <div className="checkbox-context">
      <label htmlFor={id} style={{ fontSize: 12 }}>{label}</label>
      <input id={id} type="checkbox" checked={checked} disabled={disabled} onChange={(e) => {
        update(e.target.checked)
      }} />
    </div>)

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
            <Checkbox id='mevShareDisabled' label='MEV-Share Disabled' checked={mevShareDisabled} update={setMevShareDisabled} />
            {!mevShareDisabled &&
              <Checkbox id='experimental' label='Show Experimental Options' checked={showExperimental} update={setShowExperimental} />
            }
            {showExperimental && !mevShareDisabled && <div>
              <Checkbox id='calldata' label='calldata' disabled={mevShareDisabled} checked={calldata} update={setCalldata} />
              <Checkbox id='contractAddress' label='contract address' disabled={mevShareDisabled} checked={contractAddress} update={setContractAddress} />
              <Checkbox id='functionSelector' label='function selector' disabled={mevShareDisabled} checked={functionSelector} update={setFunctionSelector} />
              <Checkbox id='logs' label='logs' disabled={mevShareDisabled} checked={logs} update={setLogs} />
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
