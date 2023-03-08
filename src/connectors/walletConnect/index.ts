import { initializeConnector } from '@web3-react/core';
import { WalletConnect } from '@web3-react/walletconnect';
import { URLS } from '../chains';

export const [walletConnect, hooks] = initializeConnector<WalletConnect>(
    //状态管理器
    (actions) =>
      //钱包相关操作的 WalletConnect
      new WalletConnect({
        actions,
        //当前的钱包支持的 链
        options: {
          rpc: URLS,
        },
      })
  );
  