import assert from "assert";
import { describe } from 'mocha';
import { HintPreferences, ProtectButtonOptions, generateRpcUrl } from '../src';

describe('rpc url', () => {
    const test = (options: ProtectButtonOptions, expected: string) => {
        console.log(options)
        const url = generateRpcUrl(options).toString()
        console.log(url)
        assert.equal(url, expected)
    }

    it('renders maxPrivacy params properly', () => {
        test({
            hints: {
            calldata: false,
            contractAddress: false,
            functionSelector: false,
            logs: false,
            defaultLogs: false,
            txHash: true,
        }}, 'https://rpc.flashbots.net/?hint=hash')
    })

    it('renders maxSpeed params properly', () => {
        test({
            hints: {
            calldata: true,
            contractAddress: true,
            functionSelector: true,
            logs: true,
            defaultLogs: true,
            txHash: true,
        }}, 'https://rpc.flashbots.net/?hint=calldata&hint=contract_address&hint=function_selector&hint=logs&hint=default_logs')
    })

    it('renders maxSpeed params properly regardless of hash param', () => {
        test({
            hints: {
            calldata: true,
            contractAddress: true,
            functionSelector: true,
            logs: true,
            defaultLogs: true,
            txHash: false,
        }}, 'https://rpc.flashbots.net/?hint=calldata&hint=contract_address&hint=function_selector&hint=logs&hint=default_logs')
    })

    it('renders default params properly', () => {
        test({}, 'https://rpc.flashbots.net/')
    })

    it('renders default params (2) properly', () => {
        test({
            hints: {
            calldata: false,
            contractAddress: false,
            functionSelector: false,
            logs: false,
            defaultLogs: false,
            txHash: false,
        }}, 'https://rpc.flashbots.net/')
    })

    it('renders default params (2) properly', () => {
        test({
            hints: {
                calldata: false,
                contractAddress: false,
                functionSelector: false,
                logs: false,
                defaultLogs: false,
            }},
            'https://rpc.flashbots.net/')
    })

    it('adds /fast and ignores builders', () => {
        test({
            hints: {
                calldata:false,
                contractAddress: false,
                functionSelector: false,
                logs: false,
                defaultLogs: false,
            },
            fast: true,
            builders: ["flashbots"]
        },
        'https://rpc.flashbots.net/fast')
    })
})
