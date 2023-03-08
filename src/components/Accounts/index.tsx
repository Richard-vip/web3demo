import React from 'react'
import { Web3ReactHooks } from '@web3-react/core';
import { formatEther } from '@ethersproject/units';
import useBalances from '../../hooks/useBalances';
import { List, Divider } from 'antd';


interface IProps {
    accounts: ReturnType<Web3ReactHooks['useAccounts']>;
    provider: ReturnType<Web3ReactHooks['useProvider']>;
    ENSNames: ReturnType<Web3ReactHooks['useENSNames']>;
}

const Accounts = (props: IProps) => {
    const { accounts, provider, ENSNames } = props;
    // @todo ENSNames 是什么意思？？？
    const balances = useBalances(provider, accounts);
    if (accounts === undefined) return null;
    return (
        <List
            header={<Divider orientation="left">Accounts</Divider>}
            itemLayout="horizontal"
            dataSource={accounts}
            renderItem={(account, index) => (
                <List.Item>
                    <List.Item.Meta
                        title={ENSNames?.[index] ?? account}
                        description={balances?.[index] ? ` (Ξ${formatEther(balances[index])})` : null}
                    />
                </List.Item>
            )}
        />
    )
}

export default Accounts