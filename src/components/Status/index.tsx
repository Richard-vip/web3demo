import type { Web3ReactHooks } from '@web3-react/core';

interface IProps {
    isActivating: ReturnType<Web3ReactHooks['useIsActivating']>;
    isActive: ReturnType<Web3ReactHooks['useIsActive']>;
    error: Error | undefined;
}

const Status = (props: IProps) => {
    const { isActivating, isActive, error } = props;
    if (error) {
        return (
            <span>
                🔴 {error?.name ?? 'Error'} <br />
                {error.message ? `: ${error.message}` : null}
            </span>
        )
    }
    if (isActivating) {
        return (
            <span>
                🟡 Connecting
            </span>
        )
    }

    if (isActive) {
        return (
            <span>
                🟢 Connected
            </span>
        )
    }

    return (
        <span>
            ⚪️ Disconnected
        </span>
    )
}

export default Status;