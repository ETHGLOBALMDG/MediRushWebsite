import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage.jsx'
import DoctorVerification from './pages/DoctorVerification.jsx';
import PatientVerification from './pages/PatientVerification.jsx';
import DoctorSearch from './pages/DoctorSearch.jsx';
import DoctorModal from './pages/DoctorModal.jsx';
import PatientInfo from './pages/PatientInfo.jsx';
import PatientHistory from './pages/PatientHistory.jsx';
import UpdatePatientRecord from './pages/UpdatePatientRecord.jsx';
import { GlobalProvider } from './context/GlobalContext';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { WagmiProvider } from 'wagmi';
import { config } from './config/wagmiConfig.js';
import LoadingPage_1 from './pages/loadingpage_1';

const queryClient = new QueryClient()

function App() {
  return (
  <GlobalProvider>
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}> 
        <Router>
          <Routes>
            <Route path="/" element={<HomePage/>} />
            <Route path="/doctor-verification" element={<DoctorVerification />} />
            <Route path="/patient-verification" element={<PatientVerification />} />
            <Route path="/doctor-dashboard" element={<DoctorModal />} />
            <Route path="/doctor-search" element={<DoctorSearch />} />
            <Route path="/patient-info" element={<PatientInfo />} />
            <Route path="/patient-history" element={<PatientHistory />} />
            <Route path="/update-patient-record" element={<UpdatePatientRecord />} />
          </Routes>
        </Router>
      </QueryClientProvider>
    </WagmiProvider>
  </GlobalProvider>
  );
}

export default App;
