import React, { useContext } from 'react';
import "../styles/Navbar.css";
import { Link, useLocation } from 'react-router-dom';
import { GlobalContext } from '../context/GlobalContextInstance';
import { WalletOptions } from "./WalletOptions";
import { Account } from './Accounts';
import { ConnectWallet } from './ConnectWallet';
// import { useAccount } from 'wagmi';

const Navbar = () => {
  const location = useLocation();
  const { registrationStatus } = useContext(GlobalContext);
  const isNotRegistered = registrationStatus === 'not registered';
  const isPatient = registrationStatus === 'patient';
  // const [showWalletOptions, setShowWalletOptions] = useState(false);
  // const {isConnected} = useAccount();
  
  // useEffect(()=>{setWalletConnected(true)},[isConnected,setWalletConnected]);


  return (
	<nav className="navbar">
	  <div className="navbar-logo">VeriMed</div>
	  <ul className="navbar-links">
		<li className={location.pathname === '/' ? 'active' : ''}>
		  <Link to="/">Home</Link>
		</li>
		<li className={location.pathname === '/patient-verification'||location.pathname==='/doctor-verification' ? 'active' : ''}>
			Verification
		</li>		  
        {isPatient?<li className={location.pathname === '/doctor-search'? 'active' : ''}>
          <Link
			to={isNotRegistered ? '#' : '/doctor-search'}
			className={isNotRegistered ? 'disabled' : ''}
			tabIndex={isNotRegistered ? -1 : 0}
			aria-disabled={isNotRegistered}
	    >
            Doctor Search
          </Link>
        </li>:<></>
        }
        {!isNotRegistered?<li className={location.pathname === (isPatient ? '/patient-history' : '/patient-info') ? 'active' : ''}>
		  <Link
			to={isNotRegistered ? '#' : (isPatient ? '/patient-history' : '/patient-info')}
			className={isNotRegistered ? 'disabled' : ''}
			tabIndex={isNotRegistered ? -1 : 0}
			aria-disabled={isNotRegistered}
		  >
			{isPatient ? 'History' : 'Patient Info'}
		  </Link>
		</li>:<></>}

	  </ul>
	  {/* <div style={{ marginLeft: 'auto' }}>
		{walletConnected?<Account/>:showWalletOptions?<div>
			<WalletOptions onClose={()=>setShowWalletOptions(false)} onDisconnect={()=>{setWalletConnected(false); setShowWalletOptions(false);}}/>
		</div>:<button onClick={()=>setShowWalletOptions(true)}className="navbar-btn">Connect Wallet</button>}
	  </div> */}
	  <ConnectWallet/>
	</nav>
  );
};

export default Navbar;
