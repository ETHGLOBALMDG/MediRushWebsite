import { useAccount } from "wagmi"
import { Account } from "./Accounts.jsx"
import { WalletOptions } from "./WalletOptions.jsx"

export const ConnectWallet = () => {
    const { isConnected } = useAccount()
    if (isConnected) return <Account />
    return <WalletOptions />
}

