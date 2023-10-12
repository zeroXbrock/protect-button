import { FunctionComponent, PropsWithChildren } from 'react'
import { AddEthereumChainParameter } from 'metamask-react/lib/metamask-context'
import { HintPreferences } from '@flashbots/mev-share-client'

export const mungeHintsForRpcUrl = (hints?: HintPreferences) => {
  /*
    `hash` is always shared on the backend.
    We only need to specify it if we don't want default hints shared.

    If other hints are specified, `hash` is implied. In that case we
    set hash to undefined so it's removed from the URL.
 */
  const hashImplied = hints?.calldata || hints?.contractAddress || hints?.functionSelector || hints?.logs || hints?.defaultLogs
  return {
    calldata: hints?.calldata,
    contract_address: hints?.contractAddress,
    function_selector: hints?.functionSelector,
    logs: hints?.logs,
    default_logs: hints?.defaultLogs,
    hash: hashImplied ? false : hints?.txHash,
  }
}

export interface ProtectButtonOptions extends PropsWithChildren {
  /** Callback from useMetaMask() */
  addChain?: (chain: AddEthereumChainParameter) => Promise<void>
  /** Specify data to share; if undefined, uses default [Stable config](https://docs.flashbots.net/flashbots-protect/rpc/mev-share#stable-configuration) */
  hints?: HintPreferences,
  /** ID for iterative bundle-building (default: undefined) */
  bundleId?: string,
  /** Chain to connect to (default: 1) */
  chainId?: number,
  /** Selected builders that are permitted to build blocks using the client's transactions. */
  builders?: Array<string>,
  /** `fast` mode enables all supported builders implicitly. Setting `fast` will override `builders`. */
  fast?: boolean,
}

export const generateRpcUrl = ({
  chainId,
  hints,
  bundleId,
  builders,
  fast,
}: ProtectButtonOptions) => {
  const protectUrl = chainId === 5 ? "https://rpc-goerli.flashbots.net" :
    chainId === 11155111 ? "https://rpc-sepolia.flashbots.net" :
      "https://rpc.flashbots.net"
  const rpcUrl = new URL(protectUrl)

  if (hints) {
    for (const entry of Object.entries(mungeHintsForRpcUrl(hints))) {
      const [hintName, hintEnabled] = entry
      if (hintEnabled) {
        rpcUrl.searchParams.append("hint", hintName.toLowerCase())
      }
    }
  }

  if (bundleId) {
    rpcUrl.searchParams.append("bundle", bundleId)
  }

  if (fast) {
    rpcUrl.pathname += "fast"
  } else if (builders) {
    for (const builder of builders) {
      rpcUrl.searchParams.append("builder", builder.toLowerCase())
    }
  }
  return rpcUrl
}

const chainName = (chainId: number) => {
  switch (chainId) {
    case 1:
      return "Mainnet"
    case 5:
      return "Goerli"
    case 11155111:
      return "Sepolia"
    default:
      return `Chain ${chainId}`
  }
}


/**
 * Button that connects Metamask to Flashbots Protect when it's clicked.
 */
const FlashbotsProtectButton: FunctionComponent<ProtectButtonOptions> = ({
  addChain,
  hints,
  bundleId,
  chainId,
  children,
  builders,
  fast,
}) => {
  const chainIdActual: number = chainId || 1
  const rpcUrl = generateRpcUrl({ chainId: chainIdActual, hints, bundleId, builders });

  const connectToProtect = async () => {
    const addChainParams = {
      chainId: `0x${chainIdActual.toString(16)}`,
      chainName: `Flashbots Protect (${chainName(chainIdActual)})`,
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
