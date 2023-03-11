# Connect to Protect

React component: a button that connects Metamask to Flashbots Protect when clicked.

## Dependencies

* [react ^18](https://reactjs.org/)
* [metamask-react](https://www.npmjs.com/package/metamask-react) - The component expects a callback `addChain` given by `useMetaMask` from metamask-react to handle the low-level connection to Metamask.

## demo

Build from source:

```sh
cd protect
yarn install && yarn build
cd ..
```

Run demo:

```sh
cd web-demo
npm install && npm start
cd ..
```

## using in your library

Install from npm:

```sh
yarn add protect-button
# or
npm i protect-button
```

Alternatively, if you built from source:

```sh
yarn add ../protect-button
# or
npm i ../protect-button
```

In a React file (tsx or jsx):

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
          <ProtectButton addChain={addChain} chainId={5}>Connect to Protect (Goerli)</ProtectButton>
        </>)}
      </header>
    </div>
  );
}

export default App
```
