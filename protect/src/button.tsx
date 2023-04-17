import { FunctionComponent, PropsWithChildren } from 'react'
import { AddEthereumChainParameter } from 'metamask-react/lib/metamask-context'
// import { HintPreferences } from '@flashbots/matchmaker-ts'

// hard-code this until matchmaker-ts update is available
export interface HintPreferences {
  /** Share the calldata of the transaction. (default=false) */
  calldata?: boolean,
  /** Share the contract address of the transaction. (default=true) */
  contractAddress?: boolean,
  /** Share the 4byte function selector of the transaction. (default=true) */
  functionSelector?: boolean,
  /** Share the logs emitted by the transaction. (default=true) */
  logs?: boolean,
}

const mungeHints = (hints?: HintPreferences) => {
  const allHintsFalse = hints ? Object.values(hints).reduce((prv, cur) => prv && !cur, true) : true
  return hints ?
    (allHintsFalse ?
      { // mevshare disabled
        transaction_hash: true
      } :
      { // experimental options
        calldata: hints.calldata,
        contract_address: hints.contractAddress,
        function_selector: hints.functionSelector,
        logs: hints.logs,
        transaction_hash: true, // tx hash is always shared on Flashbots Matchmaker
      })
    : { /* Default (Stable) config; no params */ }
}

export interface ProtectButtonOptions extends PropsWithChildren {
  /** Callback from useMetaMask() */
  addChain?: (chain: AddEthereumChainParameter) => Promise<void>
  /** Specify data to share; default is [Stable config](#TODO-link-to-docs) */
  auctionHints?: HintPreferences,
  /** ID for iterative bundle-building (default: undefined) */
  bundleId?: string,
  /** Chain to connect to (default: 1) */
  chainId?: number,
  /** Selected builders that are permitted to build blocks using the client's transactions. */
  targetBuilders?: Array<string>,
}

/**
 * Button that connects Metamask to Flashbots Protect when it's clicked.
 */
const FlashbotsProtectButton: FunctionComponent<ProtectButtonOptions> = ({
  addChain,
  auctionHints,
  bundleId,
  chainId,
  children,
  targetBuilders,
}) => {
  const chainIdActual: number = chainId || 1
  const protectUrl =
    chainIdActual === 5 ? "https://rpc-goerli.flashbots.net" :
      chainIdActual === 11155111 ? "https://rpc-sepolia.flashbots.net" :
        "https://rpc.flashbots.net"
  const rpcUrl = new URL(protectUrl)

  if (auctionHints) {
    for (const entry of Object.entries(mungeHints(auctionHints))) {
      const [hintName, hintEnabled] = entry
      if (hintEnabled) {
        rpcUrl.searchParams.append("hint", hintName)
      }
    }
  }

  if (bundleId) {
    rpcUrl.searchParams.append("bundle", bundleId)
  }

  if (targetBuilders) {
    for (const builder of targetBuilders) {
      rpcUrl.searchParams.append("targetBuilder", builder)
    }
  }

  const connectToProtect = async () => {
    const addChainParams = {
      chainId: `0x${chainIdActual.toString(16)}`,
      chainName: `Flashbots Protect ${chainIdActual === 1 ? "(Mainnet)" :
        chainIdActual === 5 ? "(Goerli)" :
          chainIdActual === 11155111 ? "(Sepolia)" :
            ` on chain ${chainIdActual}`}`,
      iconUrls: ["https://docs.flashbots.net/img/logo.png"],
      nativeCurrency: {
        name: "Ethereum",
        symbol: "ETH",
        decimals: 18,
      },
      rpcUrls: [rpcUrl.toString()],
    }
    if (addChain) {
      try {
        addChain(addChainParams)
      } catch (err) {
        // handle "add" error
        console.error("addChain failed")
        throw err
      }
    } else if ("ethereum" in window) {
      // do it manually with window.ethereum
      try {
        const ethereum: any = window.ethereum
        await ethereum.request({
          method: 'wallet_addEthereumChain',
          params: [addChainParams],
        })
      } catch (err) {
        // handle "add" error
        console.error("addChain failed")
        throw err
      }
    } else {
      throw new Error("ethereum provider not found")
    }
  }

  return (
    <button className="flashButton" onClick={connectToProtect}>{children}</button>
  )
}

export default FlashbotsProtectButton
