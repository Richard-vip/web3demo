import { useCallback, useEffect, useMemo, useState } from "react";
import { Button, Card, Radio, RadioChangeEvent, Select } from "antd"
import { EPurseType } from "../../constant";
import useMetaMask from "../../hooks/useMetaMask";
import useWalletConnect from "../../hooks/useWalletConnect";
import Accounts from "../Accounts";
import Status from "../Status";
import { CHAINS, getAddChainParameters, URLS } from '../../connectors/chains'; // @todo  getAddChainParameters URLS???
import PlaygroundAbi from "../../abi/Playground.json";
import { Contract } from 'ethers';

const PurseCard = () => {
    const [purseType, setPurseType] = useState(EPurseType.METAMASK);
    const [error, setError] = useState<Error>();
    const { metaMask } = useMetaMask();
    const { walletConnect } = useWalletConnect();
    const [desiredChainId, setDesiredChainId] = useState<(keyof typeof CHAINS)>();
    const [btnName, setBtnName] = useState('Connect');
    const [isPending, setPending] = useState(false);
    const isMetaMask = purseType === EPurseType.METAMASK;
    const isActivating = useMemo(() => isMetaMask ? metaMask.isActivating : walletConnect.isActivating, [isMetaMask, metaMask, walletConnect]);
    const isActive = useMemo(() => isMetaMask ? metaMask.isActive : walletConnect.isActive, [isMetaMask, metaMask, walletConnect]);
    const accounts = useMemo(() => isMetaMask ? metaMask.accounts : walletConnect.accounts, [isMetaMask, metaMask, walletConnect]);
    const provider = useMemo(() => isMetaMask ? metaMask.provider : walletConnect.provider, [isMetaMask, metaMask, walletConnect]);
    const ENSNames = useMemo(() => isMetaMask ? metaMask.ENSNames : walletConnect.ENSNames, [isMetaMask, metaMask, walletConnect]);
    const connector = useMemo(() => isMetaMask ? metaMask.connector : walletConnect.connector, [isMetaMask, metaMask, walletConnect]);
    const address = PlaygroundAbi.networks[5777].address;

    useEffect(() => {
        if (isActive) {
            const defaultChainId = isMetaMask ? metaMask.chainId : walletConnect.chainId;
            setDesiredChainId(defaultChainId);
            setBtnName('Disconnect')
        }
    }, [isActive, isMetaMask, metaMask.chainId, walletConnect.chainId])

    const handleChangePurse = (e: RadioChangeEvent) => {
        setPurseType(e.target.value)
    }

    const handleChangeChain = async (value: number) => {
        if (connector.deactivate) {
            // @todo 佳哥 这一块没明白 怎么样才能 走进这里？？？
            await connector.deactivate();
        } else {
            connector.resetState();
        }
        setBtnName('Connect')
        setDesiredChainId(value)
    };

    const handleConnectChain = useCallback(async () => {
        try {
            if (isActive) {
                if (connector.deactivate) {
                    // @todo 佳哥 这一块没明白 怎么样才能 走进这里？？？
                    await connector.deactivate();
                } else {
                    connector.resetState();
                }
                setBtnName('Connect')
            } else {
                await connector.activate(desiredChainId);
            }
        } catch (error) {
            setError(error as Error);
            setBtnName('Try Again?')
        }
    }, [isActive, connector, desiredChainId])

    const handlePlayContract = async () => {
        setPending(true);
        const signer = await provider?.getSigner();
        console.log('debug',signer)
        console.log('debug',address)
        console.log('debug',provider)
        if (provider) {
            const contract = new Contract(address, PlaygroundAbi.abi, signer);
            const result = await contract.setInfo(
                'laoyuan',
                parseInt((Math.random() * 20).toString(), 10)
            );
            console.log('debug',result)
            const transactionReceipt = await provider?.waitForTransaction(
                result.hash
            );
            console.log(
                '监听当前hash挖掘的收据交易状态【为1代表交易成功、为0代表交易失败】transactionReceipt.status：',
                transactionReceipt?.status
            );
            console.log(
                '监听当前hash挖掘的收据交易event事件日志transactionReceipt.logs：',
                transactionReceipt?.logs
            );
            if (
                transactionReceipt?.status === 1 &&
                transactionReceipt.logs.length !== 0
            ) {
                //大大的loading
                setPending(false);
            }
        }
    }

    return (
        <>
            <Card title="钱包" extra={<Status isActivating={isActivating} isActive={isActive} error={error} />}>
                <Radio.Group
                    buttonStyle="solid"
                    defaultValue={EPurseType.METAMASK}
                    onChange={handleChangePurse}
                    value={purseType}
                >
                    <Radio.Button value={EPurseType.METAMASK}>{EPurseType.METAMASK}</Radio.Button>
                    <Radio.Button value={EPurseType.WALLETCONNECT}>{EPurseType.WALLETCONNECT}</Radio.Button>
                </Radio.Group>
                <Accounts accounts={accounts} provider={provider} ENSNames={ENSNames} />
                <Select
                    style={{ width: '100%', marginBottom: 10, marginTop: 10 }}
                    onChange={handleChangeChain}
                    options={Object.keys(CHAINS).map(chainId => ({
                        label: CHAINS[Number(chainId)]?.name ?? chainId,
                        value: Number(chainId)
                    }))}
                    value={desiredChainId}
                />
                <Button type="primary" block disabled={isActivating} onClick={handleConnectChain}>{btnName}</Button>
            </Card>
            <Button type="primary" style={{ margin: 10 }} disabled={isPending} onClick={handlePlayContract}>调用合约</Button>
        </>
    )
}

export default PurseCard;