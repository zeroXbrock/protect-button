import React, { FunctionComponent, PropsWithChildren } from 'react'
import { AddEthereumChainParameter } from 'metamask-react/lib/metamask-context'

export interface ProtectButtonOptions extends PropsWithChildren {
  addChain: (chain: AddEthereumChainParameter) => Promise<void> // callback; from useMetaMask()
  bundleId?: string,  // id for iterative bundle-building (default: undefined)
  chainId?: number,   // chain to connect to (default: 1)
}

/**
 * Button that connects Metamask to Flashbots Protect when it's clicked.
 */
const FlashbotsProtectButton: FunctionComponent<ProtectButtonOptions> = ({addChain, bundleId, chainId, children}) => {
  const chainIdActual: number = chainId || 1
  const protectUrl =
    chainIdActual === 5 ? "https://rpc-goerli.flashbots.net" :
    chainIdActual === 11155111 ? "https://rpc-sepolia.flashbots.net" :
    "https://rpc.flashbots.net"
  const queryStr = bundleId ? `?bundle=${bundleId}` : ""
  const rpcUrl = `${protectUrl}${queryStr}`

  const connectToProtect = async () => {
    try {
      addChain({
        chainId: `0x${chainIdActual.toString(16)}`,
        chainName: `Flashbots Protect ${
          chainIdActual === 1 ? "(Mainnet)" :
          chainIdActual === 5 ? "(Goerli)" :
          chainIdActual === 11155111 ? "(Sepolia)" :
          ` on chain ${chainIdActual}`}`,
        iconUrls: ["https://docs.flashbots.net/img/logo.png"],
        nativeCurrency: {
            name: "Ethereum",
            symbol: "ETH",
            decimals: 18,
        },
        rpcUrls: [rpcUrl],
      })
    } catch (addError) {
      // handle "add" error
      console.error(addError)
    }
  }

  return (
      <button className="flashButton" onClick={connectToProtect}>{children}</button>
  )
}

export default FlashbotsProtectButton
