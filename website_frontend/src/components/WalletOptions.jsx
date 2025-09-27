import { useConnect } from 'wagmi';
import '../styles/WalletOptions.css';

export function WalletOptions() {
  const { connectors, connect } = useConnect();

  return (
    <>
      {connectors
        .filter(connector => connector.name === 'MetaMask')
        .map(connector => (
          <button
            className='walletOptions'
            key={connector.uid}
            onClick={() => connect({ connector })}
          >
            {connector.name}  
          </button>
        ))}
    </>
  );
}