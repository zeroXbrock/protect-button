import assert from "assert";
import { describe } from 'mocha';
import { HintPreferences, generateRpcUrl } from '../src/button';

const maxPrivacy: HintPreferences = {
    calldata: false,
    contractAddress: false,
    functionSelector: false,
    logs: false,
    defaultLogs: false,
    txHash: true,
}

const maxSpeed: HintPreferences = {
    calldata: true,
    contractAddress: true,
    functionSelector: true,
    logs: true,
    defaultLogs: true,
    txHash: true,
}

const maxSpeedNoHash: HintPreferences = {
    calldata: true,
    contractAddress: true,
    functionSelector: true,
    logs: true,
    defaultLogs: true,
    txHash: false,
}

const defaultPrivacy: HintPreferences = {}

describe('rpc url', () => {
    const test = (hints: HintPreferences, expected: string) => {
        console.log(hints)
        const url = generateRpcUrl({hints}).toString()
        console.log(url)
        assert.equal(url, expected)
    }

    it('renders maxPrivacy params properly', () => {
        test(maxPrivacy, 'https://rpc.flashbots.net/?hint=hash')
    })

    it('renders maxSpeed params properly', () => {
        test(maxSpeed, 'https://rpc.flashbots.net/?hint=calldata&hint=contract_address&hint=function_selector&hint=logs&hint=default_logs')
    })

    it('renders maxSpeed params properly regardless of hash param', () => {
        test(maxSpeedNoHash, 'https://rpc.flashbots.net/?hint=calldata&hint=contract_address&hint=function_selector&hint=logs&hint=default_logs')
    })

    it('renders default params properly', () => {
        test(defaultPrivacy, 'https://rpc.flashbots.net/')
    })
})
