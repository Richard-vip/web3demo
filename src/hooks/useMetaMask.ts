import { useEffect } from 'react'
import { hooks, metaMask } from '../connectors/metaMask';

const {
    useChainId,
    useAccounts,
    useIsActivating,
    useIsActive,
    useProvider,
    useENSNames,
} = hooks;

const useMetaMask = () => {
    const chainId = useChainId();
    const accounts = useAccounts();
    const isActivating = useIsActivating();
    const isActive = useIsActive();
    const provider = useProvider();
    const ENSNames = useENSNames(provider);
    useEffect(() => {
        void metaMask.connectEagerly().catch((error) => {
            console.debug('Failed to connect eagerly to metamask');
        });
    }, []);
    return {
        metaMask: {
            chainId,
            accounts,
            isActivating,
            isActive,
            provider,
            ENSNames,
            connector:metaMask
        }
    }
}

export default useMetaMask;