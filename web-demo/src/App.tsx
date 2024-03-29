import React, { useEffect, useState } from 'react'
import './App.css'
import { useMetaMask } from 'metamask-react'
import ProtectButton, { HintPreferences, generateRpcUrl } from "protect-button"

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
  // fast mode
  const [fast, setFast] = useState(false)
  // hints
  const [calldata, setCalldata] = useState(false)
  const [contractAddress, setContractAddress] = useState(false)
  const [functionSelector, setFunctionSelector] = useState(false)
  const [logs, setLogs] = useState(false)
  const [maxPrivacy, setMaxPrivacy] = useState(false)
  // builders
  const [allBuilders, setAllBuilders] = useState(false)
  const [selectedBuilders, setSelectedBuilders] = useState<Array<string>>(["flashbots"])
  const [curatedBuilders, setCuratedBuilders] = useState<Array<Builder>>()

  const getHints = (): HintPreferences | undefined => {
    if (maxPrivacy) return {
      txHash: true,
    }
    return { calldata, contractAddress, functionSelector, logs }
  }

  useEffect(() => {
    async function init() {
      if (!curatedBuilders) {
        setCuratedBuilders(await getSupportedBuilders())
      }
    }
    init()
  })

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

  const hints = getHints()

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
          <div className='horizontal'>
            <Checkbox id='calldata' label='calldata' disabled={maxPrivacy} checked={calldata} onChange={setCalldata} orientation='first' />
            <Checkbox id='contractAddress' label='contract address' disabled={maxPrivacy} checked={contractAddress} orientation='first' onChange={setContractAddress} />
            <Checkbox id='functionSelector' label='function selector' disabled={maxPrivacy} checked={functionSelector} orientation='first' onChange={setFunctionSelector} />
            <Checkbox id='logs' label='logs' disabled={maxPrivacy} checked={logs} onChange={setLogs} orientation='first' />
            <Checkbox id='maxPrivacy' label='Max Privacy' checked={maxPrivacy} onChange={setMaxPrivacy} orientation='first' />
            <Checkbox id='fast' label='Fast' checked={fast} onChange={setFast} orientation='first' />
          </div>
          <div style={{ marginTop: 13 }}>
            <code>URL: {generateRpcUrl({ hints, fast }).toString()}</code>
          </div>
          <div style={{ marginTop: 32 }}>
            <h3>Target Builders</h3>
            <div className="horizontal">
              <div>
                <Checkbox id="allBuilders" label="All Builders" checked={allBuilders} onChange={setAllBuilders} />
              </div>
              {curatedBuilders?.map(builder => <BuilderCheckbox key={builder.name} name={builder.name} />)}
            </div>
          </div>
          <div style={{ marginTop: 32 }}>
            {curatedBuilders && <ProtectButton addChain={addChain} chainId={1} builders={((allBuilders ? curatedBuilders.map(b => b.name.toLowerCase()) : selectedBuilders)).map(b => b.toLowerCase())} hints={getHints()} fast={fast}>Connect to Protect (Mainnet)</ProtectButton>}
            {curatedBuilders && <ProtectButton addChain={addChain} chainId={5} builders={((allBuilders ? curatedBuilders.map(b => b.name.toLowerCase()) : selectedBuilders)).map(b => b.toLowerCase())} hints={getHints()} fast={fast}>Connect to Protect (Goerli)</ProtectButton>}
          </div>
        </>)}
      </header>
    </div>
  );
}

export default App
