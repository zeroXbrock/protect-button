import { FunctionComponent, PropsWithChildren } from 'react';
import { AddEthereumChainParameter } from 'metamask-react/lib/metamask-context';
import { HintPreferences } from '@flashbots/matchmaker-ts';
export interface ProtectButtonOptions extends PropsWithChildren {
    /** Callback from useMetaMask() */
    addChain?: (chain: AddEthereumChainParameter) => Promise<void>;
    /** Specify data to share; if undefined, uses default [Stable config](https://docs.flashbots.net/flashbots-protect/rpc/mev-share#stable-configuration) */
    hints?: HintPreferences;
    /** ID for iterative bundle-building (default: undefined) */
    bundleId?: string;
    /** Chain to connect to (default: 1) */
    chainId?: number;
    /** Selected builders that are permitted to build blocks using the client's transactions. */
    builders?: Array<string>;
}
/**
 * Button that connects Metamask to Flashbots Protect when it's clicked.
 */
declare const FlashbotsProtectButton: FunctionComponent<ProtectButtonOptions>;
export default FlashbotsProtectButton;
export { HintPreferences } from "@flashbots/matchmaker-ts";
//# sourceMappingURL=button.d.ts.map