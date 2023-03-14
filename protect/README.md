# Connect to Protect

React component: a button that connects Metamask to Flashbots Protect when clicked.

## Dependencies

* [react ^18](https://reactjs.org/)

### OPTIONAL

* [metamask-react](https://www.npmjs.com/package/metamask-react) - The component accepts a callback `addChain` given by `useMetaMask` from metamask-react to handle the low-level connection to Metamask.

```tsx
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
          <ProtectButton addChain={addChain} chainId={1}>Connect to Protect (Mainnet)</ProtectButton>
          {/* addChain is optional; if ommited, will use `window.ethereum` */}
          <ProtectButton chainId={5}>Connect to Protect (Goerli)</ProtectButton>
        </>)}
      </header>
    </div>
  );
}

export default App
```
