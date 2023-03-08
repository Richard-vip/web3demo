import { URI_AVAILABLE } from '@web3-react/walletconnect';
import { useEffect } from 'react';
import { hooks, walletConnect } from '../connectors/walletConnect';

const {
    useChainId,
    useAccounts,
    useIsActivating,
    useIsActive,
    useProvider,
    useENSNames,
} = hooks;

const useWalletConnect = () => {
    const chainId = useChainId();
    const accounts = useAccounts();
    const isActivating = useIsActivating();

    const isActive = useIsActive();

    const provider = useProvider();
    const ENSNames = useENSNames(provider);

    useEffect(() => {
        walletConnect.events.on(URI_AVAILABLE, (uri: string) => {
            console.log(`uri: ${uri}`);
        });
    }, []);
    useEffect(() => {
        walletConnect.connectEagerly().catch(() => {
            console.debug('Failed to connect eagerly to walletconnect');
        });
    }, []);

    return {
        walletConnect: {
            chainId,
            accounts,
            isActivating,
            isActive,
            provider,
            ENSNames,
            connector:walletConnect
        }
    }
}

export default useWalletConnect;
