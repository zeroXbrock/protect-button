import React, { useEffect, useState } from 'react'
import './App.css'
import { useMetaMask } from 'metamask-react'
import ProtectButton, { HintPreferences } from "protect-button"

const getSupportedBuilders = async () => {
  // hardcode until spec release, then use raw.github
  return [
    {
      name: "flashbots",
      rpc: "rpc.flashbots.net",
    },
  ]
}

type Builder = {
  name: string,
  rpc: string,
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
  const [showExperimental, setShowExperimental] = useState(false)
  // hints
  const [calldata, setCalldata] = useState(false)
  const [contractAddress, setContractAddress] = useState(false)
  const [functionSelector, setFunctionSelector] = useState(false)
  const [logs, setLogs] = useState(false)
  // builders
  const [allBuilders, setAllBuilders] = useState(false)
  const [selectedBuilders, setSelectedBuilders] = useState<Array<string>>(["flashbots"])
  const [curatedBuilders, setCuratedBuilders] = useState<Array<Builder>>()

  const getHints = (): HintPreferences | undefined => {
    const rawHints = { calldata, contractAddress, functionSelector, logs }
    return showExperimental ? rawHints : undefined
  }

  useEffect(() => {
    async function init() {
      if (!curatedBuilders) {
        setCuratedBuilders(await getSupportedBuilders())
      }
    }
    init()
  })

  /** Converts hints into format that the API would receive.
   *
   * For display purposes only -- ProtectButton handles this internally.
  */
  const mungeHints = () => {
    const hints = getHints()
    return showExperimental && hints ? {
      calldata: hints.calldata,
      contract_address: hints.contractAddress,
      function_selector: hints.functionSelector,
      logs: hints.logs,
      hash: true, // (tx/bundle) hash is always shared on Flashbots Matchmaker
    } :
      {}
  }

  const toggleBuilder = (name: string) => {
    if (selectedBuilders.includes(name)) {
      setSelectedBuilders(selectedBuilders.filter(builderName => builderName !== name))
    } else {
      setSelectedBuilders([...selectedBuilders].concat(name))
    }
  }

  const BuilderCheckbox = ({ name }: { name: string }) => (
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
          <Checkbox id='experimental' label='Show Experimental Options' arrangement='vertical' checked={showExperimental} onChange={setShowExperimental} />
          {/* <div style={{ display: "flex", alignItems: "stretch" }}> */}
          {showExperimental && <div className='horizontal'>
            <Checkbox id='calldata' label='calldata' checked={calldata} onChange={setCalldata} orientation='first' />
            <Checkbox id='contractAddress' label='contract address' checked={contractAddress} orientation='first' onChange={setContractAddress} />
            <Checkbox id='functionSelector' label='function selector' checked={functionSelector} orientation='first' onChange={setFunctionSelector} />
            <Checkbox id='logs' label='logs' checked={logs} onChange={setLogs} orientation='first' />
          </div>}
          {/* </div> */}
          <div style={{ marginTop: 13 }}>
            <code>Hints: {(() => {
              const mungedHints = Object.entries(mungeHints() || {}).filter(([_, v]) => !!v).map(([k,]) => k)
              return Object.keys(mungedHints).length === 0 ? "Stable Configuration" : JSON.stringify(mungedHints)
            })()}</code>
          </div>
          {showExperimental && <div style={{ marginTop: 32 }}>
            <h3>Target Builders</h3>
            <div className="horizontal">
              <div>
                <Checkbox id="allBuilders" label="All Builders" checked={allBuilders} onChange={setAllBuilders} />
              </div>
              {curatedBuilders?.map(builder => <BuilderCheckbox name={builder.name} />)}
            </div>
          </div>}
          <div style={{ marginTop: 32 }}>
            {curatedBuilders && <ProtectButton addChain={addChain} chainId={1} targetBuilders={(showExperimental ? (allBuilders ? curatedBuilders.map(b => b.name.toLowerCase()) : selectedBuilders) : []).map(b => b.toLowerCase())} hints={getHints()}>Connect to Protect (Mainnet)</ProtectButton>}
            {curatedBuilders && <ProtectButton addChain={addChain} chainId={5} targetBuilders={(showExperimental ? (allBuilders ? curatedBuilders.map(b => b.name.toLowerCase()) : selectedBuilders) : []).map(b => b.toLowerCase())} hints={getHints()}>Connect to Protect (Goerli)</ProtectButton>}
          </div>
        </>)}
      </header>
    </div>
  );
}

export default App
