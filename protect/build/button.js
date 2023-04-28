"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const mungeHints = (hints) => {
    const allHintsFalse = hints ? Object.values(hints).reduce((prv, cur) => prv && cur === false, true) : true;
    return hints ?
        (allHintsFalse ?
            {
                hash: true
            } :
            {
                calldata: hints.calldata,
                contract_address: hints.contractAddress,
                function_selector: hints.functionSelector,
                logs: hints.logs,
                hash: true, // (tx/bundle) hash is always shared on Flashbots Matchmaker
            })
        : { /* Default (Stable) config; no params */};
};
/**
 * Button that connects Metamask to Flashbots Protect when it's clicked.
 */
const FlashbotsProtectButton = ({ addChain, hints, bundleId, chainId, children, builders, }) => {
    const chainIdActual = chainId || 1;
    const protectUrl = chainIdActual === 5 ? "https://rpc-goerli.flashbots.net" :
        chainIdActual === 11155111 ? "https://rpc-sepolia.flashbots.net" :
            "https://rpc.flashbots.net";
    const rpcUrl = new URL(protectUrl);
    if (hints) {
        for (const entry of Object.entries(mungeHints(hints))) {
            const [hintName, hintEnabled] = entry;
            if (hintEnabled) {
                rpcUrl.searchParams.append("hint", hintName);
            }
        }
    }
    if (bundleId) {
        rpcUrl.searchParams.append("bundle", bundleId);
    }
    if (builders) {
        for (const builder of builders) {
            rpcUrl.searchParams.append("builder", builder);
        }
    }
    const connectToProtect = () => __awaiter(void 0, void 0, void 0, function* () {
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
        };
        if (addChain) {
            try {
                addChain(addChainParams);
            }
            catch (err) {
                // handle "add" error
                console.error("addChain failed");
                throw err;
            }
        }
        else if ("ethereum" in window) {
            // do it manually with window.ethereum
            try {
                const ethereum = window.ethereum;
                yield ethereum.request({
                    method: 'wallet_addEthereumChain',
                    params: [addChainParams],
                });
            }
            catch (err) {
                // handle "add" error
                console.error("addChain failed");
                throw err;
            }
        }
        else {
            throw new Error("ethereum provider not found");
        }
    });
    return ((0, jsx_runtime_1.jsx)("button", Object.assign({ className: "flashButton", onClick: connectToProtect }, { children: children })));
};
exports.default = FlashbotsProtectButton;
//# sourceMappingURL=button.js.map