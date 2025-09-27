import React, { useState } from 'react';
import { GlobalContext } from './GlobalContextInstance';

export const GlobalProvider = ({ children }) => {
  const [registrationStatus, setRegistrationStatus] = useState('not registered'); // 'not registered', 'doctor', 'patient'
  const [walletConnected, setWalletConnected] = useState(false); // true or false

  return (
    <GlobalContext.Provider value={{ registrationStatus, setRegistrationStatus, walletConnected, setWalletConnected }}>
      {children}
    </GlobalContext.Provider>
  );
};
