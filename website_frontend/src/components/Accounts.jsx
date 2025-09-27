import { useAccount, useDisconnect } from 'wagmi';
import '../styles/Account.css'

export function Account() {
  const { address } = useAccount();
  const { disconnect } = useDisconnect();
  // const { data: ensName } = useEnsName({ address });
  // const { data: ensAvatar } = useEnsAvatar({ name: ensName });

  return (
    <div style={{'display':'flex'}}>
      {/* {ensAvatar && <img alt="ENS Avatar" src={ensAvatar} />} */}
      {/* <div>{address ? address : 'Address Not Found'}</div> */}
      <button id='' style={{'color':'white'}} className="btn" onClick={() => disconnect()}>{address}</button>
    </div>
  );
}