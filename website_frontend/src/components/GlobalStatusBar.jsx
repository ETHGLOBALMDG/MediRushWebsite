import React, { useContext } from 'react';
import { GlobalContext } from '../context/GlobalContextInstance';
import '../styles/GlobalStatusBar.css';

const GlobalStatusBar = () => {
  const { registrationStatus, walletConnected } = useContext(GlobalContext);

  return (
    <div className="global-status-bar">
      <span className={`status-label ${registrationStatus.replace(' ', '-')}`}>Status: {registrationStatus}</span>
      <span className={`wallet-label ${walletConnected ? 'connected' : 'not-connected'}`}>Wallet: {walletConnected ? 'Connected' : 'Not Connected'}</span>
    </div>
  );
};

export default GlobalStatusBar;
