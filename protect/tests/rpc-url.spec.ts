import assert from "assert";
import { describe } from 'mocha';
import { HintPreferences, generateRpcUrl } from '../src/button';

describe('rpc url', () => {
    const test = (hints: HintPreferences, expected: string) => {
        console.log(hints)
        const url = generateRpcUrl({hints}).toString()
        console.log(url)
        assert.equal(url, expected)
    }

    it('renders maxPrivacy params properly', () => {
        test({
            calldata: false,
            contractAddress: false,
            functionSelector: false,
            logs: false,
            defaultLogs: false,
            txHash: true,
        }, 'https://rpc.flashbots.net/?hint=hash')
    })

    it('renders maxSpeed params properly', () => {
        test({
            calldata: true,
            contractAddress: true,
            functionSelector: true,
            logs: true,
            defaultLogs: true,
            txHash: true,
        }, 'https://rpc.flashbots.net/?hint=calldata&hint=contract_address&hint=function_selector&hint=logs&hint=default_logs')
    })

    it('renders maxSpeed params properly regardless of hash param', () => {
        test({
            calldata: true,
            contractAddress: true,
            functionSelector: true,
            logs: true,
            defaultLogs: true,
            txHash: false,
        }, 'https://rpc.flashbots.net/?hint=calldata&hint=contract_address&hint=function_selector&hint=logs&hint=default_logs')
    })

    it('renders default params properly', () => {
        test({}, 'https://rpc.flashbots.net/')
    })

    it('renders default params (2) properly', () => {
        test({
            calldata: false,
            contractAddress: false,
            functionSelector: false,
            logs: false,
            defaultLogs: false,
            txHash: false,
        }, 'https://rpc.flashbots.net/')
    })

    it('renders default params (2) properly', () => {
        test({
            calldata: false,
            contractAddress: false,
            functionSelector: false,
            logs: false,
            defaultLogs: false,
        }, 'https://rpc.flashbots.net/')
    })
})
