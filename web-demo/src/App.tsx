import React, { useState } from 'react'
import './App.css'
import { useMetaMask } from 'metamask-react'
import ProtectButton, { HintPreferences } from "protect-button"

enum SupportedBuilders {
  Flashbots = "Flashbots",
  BlockNative = "BlockNative",
}

const Checkbox = (
  { label, id, checked, onChange, disabled, arrangement, orientation }:
    {
      disabled?: boolean,
      label: string,
      id: string,
      arrangement?: "vertical" | "horizontal",
      orientation?: "first" | "last",
      checked: boolean,
      onChange: (val: boolean) => void
    }
) => {
  const elements = [
    <label htmlFor={id} key={0}>{label}</label>,
    <input id={id} type="checkbox" checked={checked} disabled={disabled} key={1} onChange={(e) => {
      onChange(e.target.checked)
    }} />
  ]
  return <div className={`checkbox-context ${arrangement}`}>
    {orientation === "last" ? elements : elements.reverse()}
  </div>
}

function App() {
  const { status, connect, addChain } = useMetaMask()
  const [mevShareDisabled, setMevShareDisabled] = useState(false)
  const [showExperimental, setShowExperimental] = useState(false)
  // hints
  const [calldata, setCalldata] = useState(false)
  const [contractAddress, setContractAddress] = useState(false)
  const [functionSelector, setFunctionSelector] = useState(false)
  const [logs, setLogs] = useState(false)
  // builders
  const [allBuilders, setAllBuilders] = useState(false)
  const [selectedBuilders, setSelectedBuilders] = useState<Array<string>>([SupportedBuilders.Flashbots])

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

  const toggleBuilder = (name: string) => {
    if (selectedBuilders.includes(name)) {
      setSelectedBuilders(selectedBuilders.filter(builderName => builderName !== name))
    } else {
      setSelectedBuilders([...selectedBuilders].concat(name))
    }
  }

  const BuilderCheckbox = ({ name }: { name: SupportedBuilders }) => (
    <Checkbox
      id={`builder_${name.toLowerCase()}`}
      label={name}
      checked={selectedBuilders.includes(name) || allBuilders}
      disabled={allBuilders}
      onChange={() => toggleBuilder(name)}
      orientation='first'
    />)

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
          <h2>MEV-Share Settings</h2>
          <div style={{ display: "flex", alignItems: "stretch" }}>
            <Checkbox id='mevShareDisabled' label='MEV-Share Disabled' arrangement='vertical' checked={mevShareDisabled} onChange={setMevShareDisabled} />
            {!mevShareDisabled &&
              <Checkbox id='experimental' label='Show Experimental Options' arrangement='vertical' checked={showExperimental} onChange={setShowExperimental} />
            }
            {showExperimental && !mevShareDisabled && <div className='vertical' style={{ display: "flex", alignItems: "flex-start" }}>
              <Checkbox id='calldata' label='calldata' disabled={mevShareDisabled} checked={calldata} onChange={setCalldata} orientation='first' />
              <Checkbox id='contractAddress' label='contract address' disabled={mevShareDisabled} checked={contractAddress} orientation='first' onChange={setContractAddress} />
              <Checkbox id='functionSelector' label='function selector' disabled={mevShareDisabled} checked={functionSelector} orientation='first' onChange={setFunctionSelector} />
              <Checkbox id='logs' label='logs' disabled={mevShareDisabled} checked={logs} onChange={setLogs} orientation='first' />
            </div>}
          </div>
          <div style={{ marginTop: 13 }}>
            <code>Hints: {(() => {
              const mungedHints = Object.entries(mungeHints() || {}).filter(([_, v]) => !!v).map(([k,]) => k)
              return Object.keys(mungedHints).length === 0 ? "Stable Configuration" : JSON.stringify(mungedHints)
            })()}</code>
          </div>
          <div style={{ marginTop: 32 }}>
            <h3>Target Builders</h3>
            <div className="horizontal">
              <div>
                <Checkbox id="allBuilders" label="All Builders" checked={allBuilders} onChange={setAllBuilders} />
              </div>
              <BuilderCheckbox name={SupportedBuilders.Flashbots} />
              <BuilderCheckbox name={SupportedBuilders.BlockNative} />
            </div>
          </div>
          <div style={{ marginTop: 32 }}>
            <ProtectButton addChain={addChain} chainId={1} targetBuilders={(allBuilders ? Object.values(SupportedBuilders) : selectedBuilders).map(b => b.toLowerCase())} auctionHints={getHints()}>Connect to Protect (Mainnet)</ProtectButton>
            <ProtectButton addChain={addChain} chainId={5} targetBuilders={(allBuilders ? Object.values(SupportedBuilders) : selectedBuilders).map(b => b.toLowerCase())} auctionHints={getHints()}>Connect to Protect (Goerli)</ProtectButton>
          </div>
        </>)}
      </header>
    </div>
  );
}

export default App
