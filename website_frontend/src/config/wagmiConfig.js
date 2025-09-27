import { http, createConfig } from 'wagmi'
import { arbitrumSepolia } from 'wagmi/chains'
import { injected, metaMask, safe, walletConnect } from 'wagmi/connectors'

const projectId = '<WALLETCONNECT_PROJECT_ID>'

export const config = createConfig({
  chains: [arbitrumSepolia],
  connectors: [
    injected(),
    walletConnect({ projectId }),
    metaMask(),
    safe(),
  ],
  transports: {
    // [hederaTestnet.id]: http('https://testnet.hashio.io/api.'),
    [arbitrumSepolia.id]: http('https://arb-sepolia.g.alchemy.com/v2/-X4x3cNsMEN-Gpatu4BYaa8V7eOAFHY4'),
  },
})