import React, { useEffect, useState, useContext } from 'react';
import Navbar from '../components/Navbar.jsx';
import '../styles/PatientVerification.css';
import {generateZkAgeProof}  from '../api/zkAge.js'; 
import {generateZkNationalityProof}  from '../api/zkNationality.js';
import { sendPatientData } from '../api/sendPatientData.js';
import { ethers } from 'ethers';
import { GlobalContext } from '../context/GlobalContextInstance';
import { encryptData } from '../utils/encryptPatientData.js';
import { useNavigate } from 'react-router-dom';

const RandomNumberContractABI = [{"inputs":[{"internalType":"address","name":"entropyAddress","type":"address"}],"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"uint64","name":"sequenceNumber","type":"uint64"},{"indexed":false,"internalType":"bytes32","name":"randomNumber","type":"bytes32"}],"name":"RandomNumberReceived","type":"event"},{"inputs":[{"internalType":"uint64","name":"sequence","type":"uint64"},{"internalType":"address","name":"provider","type":"address"},{"internalType":"bytes32","name":"randomNumber","type":"bytes32"}],"name":"_entropyCallback","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint64","name":"","type":"uint64"}],"name":"isRequestFulfilled","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint64","name":"","type":"uint64"}],"name":"receivedRandomNumber","outputs":[{"internalType":"bytes32","name":"","type":"bytes32"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"requestRandomNumber","outputs":[],"stateMutability":"payable","type":"function"}];
const RandomNumber_CONTRACT_ADDRESS = "0x7eb0c3b54F82AD237aFE6b3E1024c013929a81c5";

const PatientContractABI=[{"type":"constructor","stateMutability":"undefined","payable":false,"inputs":[]},{"type":"error","name":"OwnableInvalidOwner","inputs":[{"type":"address","name":"owner"}]},{"type":"error","name":"OwnableUnauthorizedAccount","inputs":[{"type":"address","name":"account"}]},{"type":"event","anonymous":false,"name":"OwnershipTransferred","inputs":[{"type":"address","name":"previousOwner","indexed":true},{"type":"address","name":"newOwner","indexed":true}]},{"type":"function","name":"addPatient","constant":false,"payable":false,"inputs":[{"type":"address","name":"_patientAddress"},{"type":"bool","name":"_isRegistered"}],"outputs":[]},{"type":"function","name":"checkPatient","constant":true,"stateMutability":"view","payable":false,"inputs":[],"outputs":[{"type":"bool","name":""}]},{"type":"function","name":"owner","constant":true,"stateMutability":"view","payable":false,"inputs":[],"outputs":[{"type":"address","name":""}]},{"type":"function","name":"registeredPatients","constant":true,"stateMutability":"view","payable":false,"inputs":[{"type":"address","name":""}],"outputs":[{"type":"bool","name":""}]},{"type":"function","name":"renounceOwnership","constant":false,"payable":false,"inputs":[],"outputs":[]},{"type":"function","name":"transferOwnership","constant":false,"payable":false,"inputs":[{"type":"address","name":"newOwner"}],"outputs":[]}];
const Patient_CONTRACT_ADDRESS = "0x46addcda9d925622f7a77ad2841f49b163b70e46";



const PatientVerification = () => {
  const { registrationStatus,setRegistrationStatus } = useContext(GlobalContext);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    contactNumber: '',
    city: '',
    bloodGroup : '',
    knownAllergies: '',
    chronicConditions: '',
    above18: false,
    recentAppointments:[]
  });
  // State for file handling and proofs
  const [dragActive, setDragActive] = useState(false);
  const [nationalityDocument, setNationalityDocument] = useState(null);
  const [ageDocument, setAgeDocument] = useState(null);
  const [nationalityFileName, setNationalityFileName] = useState("");
  const [ageFileName, setAgeFileName] = useState("");
  
  const [isLoadingAgeProof, setIsLoadingAgeProof] = useState(false);
  const [isLoadingNationalityProof, setIsLoadingNationalityProof] = useState(false);

  const [ageProof, setAgeProof] = useState(null);
  const [nationalityProof, setNationalityProof] = useState(null);
  const [error, setError] = useState('');

  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [account,setAccount] = useState(null); 
  // State for blockchain interaction and ID generation
  const [randomNumber, setRandomNumber] = useState('');
  const [idtext, setidtext] = useState('Generate your ID');
  const [isTransactionPending, setisTransactionPending] = useState(false);
  const [randomNumberContract, setRandomNumberContract] = useState(null);
  const [patientContract, setPatientContract] = useState(null);
  
  // Key generation and registration logic
  const [salt, setSalt] = useState('');
  const [privateKey, setPrivateKey] = useState('');
  const [idRegistered, setIdRegistered] = useState(false);
  const [idGenerated, setIdGenerated] = useState(false);
  const [keyReady, setKeyReady] = useState(false);

  const WS_URL =import.meta.env.VITE_WS_URL;
  let wsProvider, wsContract;
  if (typeof window !== "undefined") {
    wsProvider = new ethers.WebSocketProvider(WS_URL);
    wsContract = new ethers.Contract(RandomNumber_CONTRACT_ADDRESS, RandomNumberContractABI, wsProvider);
    wsContract.on('RandomNumberReceived', (sequenceNumber, randomNumber) => {
      setRandomNumber(randomNumber.toString());
      setIdGenerated(true);
      setidtext("Patient ID generated. Enter a unique salt to create your key.");
      setSalt('');
      setPrivateKey('');
      setKeyReady(false);
      setIdRegistered(false);
    });
  }

  // Handlers for Nationality Document
  const handleNationalityFile = (file) => {
    if (file && file.type === "application/pdf") {
      setNationalityDocument(file);
      setNationalityFileName(file.name);
      setError('');
      setNationalityProof(null);
    } else {
      setError("Please upload a valid PDF file for the PAN Card.");
    }
  };

  const handleNationalityUpload = (e) => {
    if (e.target.files && e.target.files[0]) {
      handleNationalityFile(e.target.files[0]);
    }
  };

  const handleGenerateNationalityProof = async () => {
    if (!nationalityDocument) {
      setError('Please upload your PAN Card first.');
      return;
    }
    setIsLoadingNationalityProof(true);
    setError('');
    setNationalityProof(null);
    try {
      const proofData = await generateZkNationalityProof(nationalityDocument);
      setNationalityProof(proofData); 
    } catch (err) {
      setError(`Nationality Proof Error: ${err.message}`);
    } finally {
      setIsLoadingNationalityProof(false);
    }
  };

  // Handlers for Age Document
  const handleAgeFile = (file) => {
    if (file && file.type === "application/pdf") {
      setAgeDocument(file);
      setAgeFileName(file.name);
      setError('');
      setAgeProof(null);
    } else {
      setError("Please upload a valid PDF file for the Driver's License.");
    }
  };

  const handleAgeUpload = (e) => {
    if (e.target.files && e.target.files[0]) {
      handleAgeFile(e.target.files[0]);
    }
  };

  const handleGenerateAgeProof = async () => {
    if (!ageDocument) {
      setError('Please upload your Driver\'s License first.');
      return;
    }
    setIsLoadingAgeProof(true);
    setError('');
    setAgeProof(null);
    try {
      const proofData = await generateZkAgeProof(ageDocument);
      setAgeProof(proofData);
    } catch (err) {
      setError(`Age Proof Error: ${err.message}`);
    } finally {
      setIsLoadingAgeProof(false);
    }
  };

  const hashIdWithSalt = async (id, salt) => {
    const encoder = new TextEncoder();
    const data = encoder.encode(id + salt);
    const hashBuffer = await window.crypto.subtle.digest('SHA-256', data);
    return Array.from(new Uint8Array(hashBuffer)).map(b => b.toString(16).padStart(2, '0')).join('');
  };

    // --- Register ID and key in localStorage ---
  const handleRegister = async () => {
    if (!randomNumber || !privateKey || !salt) {
      setError("ID and key must be generated before registration.");
      return;
    }
    localStorage.setItem('patient_id', randomNumber);
    localStorage.setItem('patient_key', privateKey);
    setIdRegistered(true);
    setError('');

    const encryptedPatientData=encryptData(formData,privateKey);

    try {
      if (!patientContract) {
        throw new Error("Patient contract is not initialized.");
    }

    const tx = await patientContract.addPatient(
      account,
      true
    );

    await tx.wait();
    console.log("Patient successfully registered on-chain");

    } catch (err) {
      console.error("Patient registration failed:", err);
      setError("Patient registration failed: " + err.message);
    }

  try {
    const dataToSend = new FormData();
    dataToSend.append('patientId', randomNumber);
    dataToSend.append('encryptedData', JSON.stringify(encryptedPatientData));

    const response = await sendPatientData(dataToSend);

    if (response.status === 200) {
      setRegistrationStatus('patient');
      navigate('/home'); 
    } else {
      setError("Failed to send patient data to server.");
    }
  } catch (err) {
    console.error("Server upload failed:", err);
    setError("Server upload failed: " + err.message);
  } 
  };

  useEffect(() => {
      const initializeEthers = async () => {
        if (typeof window.ethereum !== 'undefined') {
          try {
            await window.ethereum.request({ method: 'eth_requestAccounts' });
            const web3Provider = new ethers.BrowserProvider(window.ethereum);
            const web3Signer = await web3Provider.getSigner();
            const userAccount = await web3Signer.getAddress();
            const randomNumberContractInstance = new ethers.Contract(RandomNumber_CONTRACT_ADDRESS, RandomNumberContractABI, web3Signer);
                    const patientInstance = new ethers.Contract(
          Patient_CONTRACT_ADDRESS,
          PatientContractABI,
          web3Signer
        );
            setProvider(web3Provider);
            setSigner(web3Signer);
            setRandomNumberContract(randomNumberContractInstance);
            setPatientContract(patientInstance);
            setAccount(userAccount);
          } catch (error) {
            console.error('Error initializing ethers:', error);
            setError('Failed to connect to wallet. Please make sure MetaMask is installed and connected.');
          }
        } else {
          setError('MetaMask not detected. Please install MetaMask to use this feature.');
        }
      };
      initializeEthers();
    }, []);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e, fileType) => {
      e.preventDefault();
      e.stopPropagation();
      setDragActive(false);
      if (e.dataTransfer.files && e.dataTransfer.files[0]) {
          if (fileType === 'nationality') {
              handleNationalityFile(e.dataTransfer.files[0]);
          } else if (fileType === 'age') {
              handleAgeFile(e.dataTransfer.files[0]);
          }
      }
  };

  // const handleSubmit = () => {
  //   console.log('Submit patient profile:', formData);
  // };

  const handleCancel = () => {
    setFormData({
      name: '',
      contactNumber: '',
      city: '',
      knownAllergies: '',
      chronicConditions: '',
      bloodGroup: '',
      above18: false,
      recentAppointments:[]
    });
  };

  // const   

  async function generateRandomId() {
    if (!randomNumberContract || isTransactionPending || idGenerated) return;
    setisTransactionPending(true);
    setError('');
    setidtext("Waiting for blockchain to generate your ID...");
    try {
      const tx = await randomNumberContract.requestRandomNumber({ value: ethers.parseEther("0.01") });
      await tx.wait();
      setisTransactionPending(false);
      // The event will set randomNumber and flags
    } catch (err) {
      console.log(err)
      setError("Failed to generate ID. Please try again.");
      setisTransactionPending(false);
      setidtext("Generate your ID");
    }
  }

    const handleSaltChange = async (e) => {
    const value = e.target.value;
    setSalt(value);
    setPrivateKey('');
    setKeyReady(false);
    if (randomNumber && value) {
      const key = await hashIdWithSalt(randomNumber, value);
      setPrivateKey(key);
      setKeyReady(true);
    }
  };


  return (
<div className="patient-verification-page">
      <Navbar />
      <div className="patient-verification-content">
        <div className="patient-verification-header">
          <div className="security-icon">
             <svg width="50" height="60" viewBox="0 0 50 60" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M25 45.7143C23.3424 45.7143 21.7527 45.1122 20.5806 44.0406C19.4085 42.969 18.75 41.5155 18.75 40C18.75 36.8286 21.5312 34.2857 25 34.2857C26.6576 34.2857 28.2473 34.8878 29.4194 35.9594C30.5915 37.031 31.25 38.4845 31.25 40C31.25 41.5155 30.5915 42.969 29.4194 44.0406C28.2473 45.1122 26.6576 45.7143 25 45.7143ZM43.75 54.2857V25.7143H6.25V54.2857H43.75ZM43.75 20C45.4076 20 46.9973 20.602 48.1694 21.6737C49.3415 22.7453 50 24.1988 50 25.7143V54.2857C50 55.8012 49.3415 57.2547 48.1694 58.3263C46.9973 59.398 45.4076 60 43.75 60H6.25C4.5924 60 3.00268 59.398 1.83058 58.3263C0.65848 57.2547 0 55.8012 0 54.2857V25.7143C0 22.5429 2.78125 20 6.25 20H9.375V14.2857C9.375 10.4969 11.0212 6.86328 13.9515 4.18419C16.8817 1.5051 20.856 0 25 0C27.0519 0 29.0837 0.369511 30.9794 1.08744C32.8751 1.80536 34.5976 2.85764 36.0485 4.18419C37.4995 5.51074 38.6504 7.08559 39.4356 8.81881C40.2208 10.552 40.625 12.4097 40.625 14.2857V20H43.75ZM25 5.71429C22.5136 5.71429 20.129 6.61734 18.3709 8.2248C16.6127 9.83225 15.625 12.0124 15.625 14.2857V20H34.375V14.2857C34.375 12.0124 33.3873 9.83225 31.6291 8.2248C29.871 6.61734 27.4864 5.71429 25 5.71429Z" fill="black"/>
            </svg>
          </div>
          <h1 className="patient-verification-title">Create Your Patient Profile</h1>
          <p className="patient-verification-subtitle">Your information is encrypted and stored securely. Please provide your details below.</p>
        </div>

        <div className="patient-form-container">
          <div className="personal-details-section">
             <h2 className="section-title">Personal Details</h2>
             <div className="form-group"><label className="form-label">Name</label><input type="text" name="name" className="form-input" placeholder="eg. Alex" value={formData.name} onChange={handleInputChange} /></div>
             <div className="form-group"><label className="form-label">Contact Number</label><input type="tel" name="contactNumber" className="form-input" placeholder="eg. 9876543210" value={formData.contactNumber} onChange={handleInputChange} /></div>
             <div className="form-group"><label className="form-label">City</label><input type="tel" name="city" className="form-input" placeholder="eg. Delhi" value={formData.city} onChange={handleInputChange} /></div>          
          </div>
          <div className="divider"></div>
          <div className="medical-history-section">
             <h2 className="section-title">Initial Medical History</h2>
             <div className="form-group"><label className="form-label">Blood Group</label><input type="text" name="bloodGroup" className="form-input" placeholder="eg. A+" value={formData.bloodGroup} onChange={handleInputChange} /></div>
             <div className="form-grid">
               <div className="form-group"><label className="form-label">Known Allergies</label><textarea name="knownAllergies" className="form-textarea" placeholder="eg. Penicillin, Peanuts" value={formData.knownAllergies} onChange={handleInputChange} /></div>
               <div className="form-group"><label className="form-label">Chronic Conditions</label><textarea name="chronicConditions" className="form-textarea" placeholder="eg. Asthma, Diabetes" value={formData.chronicConditions} onChange={handleInputChange} /></div>
             </div>
           </div>
          <div className="divider"></div>
          <div className="upload-section">
            <h2 className="section-title">Nationality Proof</h2>
            <p className="section-subtitle">Please upload a clear PDF copy of your PAN Card.</p>
            <div className={`upload-area ${dragActive ? 'drag-active' : ''}`} onDragEnter={handleDrag} onDragLeave={handleDrag} onDragOver={handleDrag} onDrop={(e) => handleDrop(e, 'nationality')}>
              <div className="upload-icon"><svg width="80" height="80" viewBox="0 0 80 80" fill="none"><path d="M40 10C29.7 10 21.6 17.825 20.4675 27.8125C18.2896 28.1648 16.2473 29.0987 14.5562 30.5157C12.8651 31.9326 11.5881 33.7799 10.86 35.8625C4.71 37.635 0 43.12 0 50C0 58.31 6.69 65 15 65H65C73.31 65 80 58.31 80 50C80 45.6 77.8625 41.66 74.765 38.905C74.185 30.12 67.1775 23.11 58.36 22.655C55.35 15.3325 48.445 10 40 10ZM40 15C46.905 15 52.425 19.425 54.375 25.7L54.925 27.5H57.5C64.3875 27.5 70 33.1125 70 40V41.25L71.015 42.0325C72.24 42.9713 73.2354 44.1766 73.9258 45.557C74.6162 46.9373 74.9835 48.4567 75 50C75 55.69 70.69 60 65 60H15C9.31 60 5 55.69 5 50C5 44.95 8.625 41.03 13.2 40.235L14.8425 39.9225L15.155 38.2775C15.905 34.91 18.89 32.5 22.5 32.5H25V30C25 21.575 31.575 15 40 15ZM40 28.985L38.2 30.7025L28.2 40.7025L31.8 44.3025L37.5 38.5925V55H42.5V38.5925L48.2 44.2975L51.8 40.6975L41.8 30.6975L40 28.985Z" fill="black"/></svg></div>
              <div className="upload-text">{nationalityFileName ? nationalityFileName : <><span className="upload-bold">Upload a PDF file</span> or drag and drop</>}</div>
              <input type="file" className="file-input" accept=".pdf" onChange={handleNationalityUpload} />
            </div>
            {isLoadingNationalityProof && <p className="loading-message">Generating nationality proof...</p>}
            {nationalityProof && <p className="success-message">Nationality Proof Generated Successfully!</p>}
            <div className="form-actions"><button className="submit-btn" onClick={handleGenerateNationalityProof} disabled={isLoadingNationalityProof || !nationalityDocument}>{isLoadingNationalityProof ? 'Generating...' : 'Generate Nationality ZK Proof'}</button></div>
          </div>
          <div className="divider"></div>
          <div className="upload-section">
            <h2 className="section-title">Age Proof</h2>
            <p className="section-subtitle">Please upload a clear PDF copy of your Driver's License.</p>
            <div className={`upload-area ${dragActive ? 'drag-active' : ''}`} onDragEnter={handleDrag} onDragLeave={handleDrag} onDragOver={handleDrag} onDrop={(e) => handleDrop(e, 'age')}>
              <div className="upload-icon"><svg width="80" height="80" viewBox="0 0 80 80" fill="none"><path d="M40 10C29.7 10 21.6 17.825 20.4675 27.8125C18.2896 28.1648 16.2473 29.0987 14.5562 30.5157C12.8651 31.9326 11.5881 33.7799 10.86 35.8625C4.71 37.635 0 43.12 0 50C0 58.31 6.69 65 15 65H65C73.31 65 80 58.31 80 50C80 45.6 77.8625 41.66 74.765 38.905C74.185 30.12 67.1775 23.11 58.36 22.655C55.35 15.3325 48.445 10 40 10ZM40 15C46.905 15 52.425 19.425 54.375 25.7L54.925 27.5H57.5C64.3875 27.5 70 33.1125 70 40V41.25L71.015 42.0325C72.24 42.9713 73.2354 44.1766 73.9258 45.557C74.6162 46.9373 74.9835 48.4567 75 50C75 55.69 70.69 60 65 60H15C9.31 60 5 55.69 5 50C5 44.95 8.625 41.03 13.2 40.235L14.8425 39.9225L15.155 38.2775C15.905 34.91 18.89 32.5 22.5 32.5H25V30C25 21.575 31.575 15 40 15ZM40 28.985L38.2 30.7025L28.2 40.7025L31.8 44.3025L37.5 38.5925V55H42.5V38.5925L48.2 44.2975L51.8 40.6975L41.8 30.6975L40 28.985Z" fill="black"/></svg></div>
              <div className="upload-text">{ageFileName ? ageFileName : <><span className="upload-bold">Upload a PDF file</span> or drag and drop</>}</div>
              <input type="file" className="file-input" accept=".pdf" onChange={handleAgeUpload} />
            </div>
            {isLoadingAgeProof && <p className="loading-message">Generating age proof...</p>}
            {ageProof && <p className="success-message">Age Proof Generated Successfully!</p>}
            <div className="form-actions"><button className="submit-btn" onClick={handleGenerateAgeProof} disabled={isLoadingAgeProof || !ageDocument}>{isLoadingAgeProof ? 'Generating...' : 'Generate Age ZK Proof'}</button></div>
          </div>
          <div className='divider'></div>
          <div className='id-generation-section'>
            <h2 className="section-title">Generate your ID</h2>
            <p className="section-subtitle">Your unique, secure patient identifier.</p>
            <div className="form-group"><input type="text" style={{width: '100%'}} className="form-input" value={randomNumber || ''} readOnly placeholder={idtext} /></div>
            <div className="form-actions"><button className="submit-btn" onClick={generateRandomId} disabled={isTransactionPending || idGenerated || !randomNumberContract}>{isTransactionPending ? 'Processing...' : 'Generate Patient ID'}</button></div>
          </div>
          <div className='divider'></div>
          <div className='key-generation-section'>
            <h2 className="section-title">Generate & Store Your Key</h2>
            <p className="section-subtitle">Enter a unique salt to generate your private key. Remember this salt!</p>
            <div className="form-group"><input style={{width: '100%'}} type="text" className="form-input" placeholder="Enter your unique salt" value={salt} onChange={handleSaltChange} disabled={!idGenerated || idRegistered} /></div>
            {privateKey && (<div style={{ margin: '1rem 0', wordBreak: 'break-all' }}><strong>Your Private Key:</strong><div style={{ fontSize: '0.95em', background: '#f5f5f5', padding: '8px', borderRadius: '4px' }}>{privateKey}</div></div>)}
            <div className="form-actions"><button className="submit-btn" onClick={handleRegister} disabled={!keyReady || idRegistered}>{idRegistered ? 'Key Registered' : 'Register ID & Key'}</button></div>
            {idRegistered && <div style={{ color: 'green', marginTop: '10px', textAlign: 'center' }}>ID and Key stored securely in your browser.</div>}
          </div>
           {error && <p className="error-message">{error}</p>}
        </div>
      </div>
    </div>
  );
};

export default PatientVerification;
