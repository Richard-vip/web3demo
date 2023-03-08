import { useEffect, useState } from "react";
import { Web3ReactHooks } from "@web3-react/core";
import type { BigNumber } from '@ethersproject/bignumber';

const useBalances = (provider?: ReturnType<Web3ReactHooks['useProvider']>,accounts?: string[])=>{
    const [balances, setBalances] = useState<BigNumber[] | undefined>();
    useEffect(() => {
        if (provider && accounts?.length) {
            let stale = false;
            void Promise.all(
                accounts.map((account) => provider.getBalance(account))
            ).then((balances) => {
                if (stale) return;
                setBalances(balances);
            });

            return () => {
                stale = true;
                setBalances(undefined);
            };
        }
    }, [accounts, provider]);
    return balances;
}

export default useBalances;