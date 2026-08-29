import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { sepolia } from 'wagmi/chains';

export const config = getDefaultConfig({
  appName: 'WETH Dashboard',
  projectId: 'a4b1e5a510e118fc964b497c23101c70', // Public WalletConnect project ID for demo
  chains: [sepolia],
  ssr: true, // If your dApp uses server side rendering (SSR)
});
