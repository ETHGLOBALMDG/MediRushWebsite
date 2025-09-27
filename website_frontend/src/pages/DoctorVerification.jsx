import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar.jsx';
import '../styles/DoctorVerification.css';
import { generateZkNationalityProof } from '../api/zkNationality.js'; 
import { generateZkMedicalLicenseProof } from '../api/zkMedicalLicense.js'; 
import { sendDoctorProof } from '../api/sendDoctorProof.js';
import axios from 'axios';
import { ethers } from 'ethers';
import { celo } from 'viem/chains';



const contractABI = [{"inputs":[{"internalType":"address","name":"entropyAddress","type":"address"}],"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"uint64","name":"sequenceNumber","type":"uint64"},{"indexed":false,"internalType":"bytes32","name":"randomNumber","type":"bytes32"}],"name":"RandomNumberReceived","type":"event"},{"inputs":[{"internalType":"uint64","name":"sequence","type":"uint64"},{"internalType":"address","name":"provider","type":"address"},{"internalType":"bytes32","name":"randomNumber","type":"bytes32"}],"name":"_entropyCallback","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint64","name":"","type":"uint64"}],"name":"isRequestFulfilled","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint64","name":"","type":"uint64"}],"name":"receivedRandomNumber","outputs":[{"internalType":"bytes32","name":"","type":"bytes32"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"requestRandomNumber","outputs":[],"stateMutability":"payable","type":"function"}];

const CONTRACT_ADDRESS = "0x7eb0c3b54F82AD237aFE6b3E1024c013929a81c5";

const DoctorVerification = () => {
  const [formData, setFormData] = useState({
    licenseNumber: '',
    specialty: '',
    issuingAuthority: ''
  });
  const [dragActive, setDragActive] = useState(false);
  const [medicalLicenseFile, setMedicalLicenseFile] = useState(null);
  const [medicalLicenseFileName, setMedicalLicenseFileName] = useState("");
  const [medicalLicenseVerified, setMedicalLicenseVerified] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [medicalLicenseConfidence, setMedicalLicenseConfidence] = useState(0);
  const [idtext, setidtext] = useState("Your unique doctor ID will appear here");
  const [randomNumber, setRandomNumber] = useState('');
  const [events, setEvents] = useState([]);
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [contract, setContract] = useState(null);
  const [account, setAccount] = useState('');
  const [isTransactionPending, setIsTransactionPending] = useState(false);
  const [idFile, setIdFile] = useState(null);
  const [idFileName, setIdFileName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [proof, setProof] = useState(null);
  const [error, setError] = useState('');



  const WS_URL =import.meta.env.VITE_WS_URL;
  let wsProvider, wsContract;
  if (typeof window !== "undefined") {
    wsProvider = new ethers.WebSocketProvider(WS_URL);
    wsContract = new ethers.Contract(CONTRACT_ADDRESS, contractABI, wsProvider);
    console.log('client made')
    wsContract.on('RandomNumberReceived', (sequenceNumber, randomNumber) => {
        console.log('New RandomNumberReceived event:', { sequenceNumber, randomNumber })
        setRandomNumber(randomNumber.toString());
      });
        
  }


  // Initialize ethers.js
useEffect(() => {
    const initializeEthers = async () => {
      if (typeof window.ethereum !== 'undefined') {
        try {
          await window.ethereum.request({ method: 'eth_requestAccounts' });
          const web3Provider = new ethers.BrowserProvider(window.ethereum);
          const web3Signer = await web3Provider.getSigner();
          const userAccount = await web3Signer.getAddress();
          const contractInstance = new ethers.Contract(CONTRACT_ADDRESS, contractABI, web3Signer);
          setProvider(web3Provider);
          setSigner(web3Signer);
          setContract(contractInstance);
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

  // useEffect(() => {
  //   if (!wsContract) return;
  //   const handler = (sequenceNumber, randomNumber, event) => {
  //     console.log('RandomNumberReceived event:', { sequenceNumber, randomNumber, event });
  //     const randomNumberDecimal = BigInt(randomNumber).toString();
  //     const eventData = {
  //       sequenceNumber: sequenceNumber.toString(),
  //       randomNumber: randomNumber,
  //       randomNumberDecimal,
  //       blockNumber: event.blockNumber,
  //       transactionHash: event.transactionHash,
  //       timestamp: new Date().toLocaleString()
  //     };
  //     console.log("event recieved")
  //     setRandomNumber(randomNumberDecimal);
  //     setEvents(prev => [eventData, ...prev]);
  //     setidtext("Your unique doctor ID has been generated!");
  //   };
  //   wsContract.on('RandomNumberReceived', handler);
  //   return () => {
  //     wsContract.off('RandomNumberReceived', handler);
  //   };
  // }, []);
  


  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleFile = async (file, fileType) => {
    if (file && file.type === "application/pdf") {
      if (fileType === 'medicalLicense') {
        setMedicalLicenseFile(file);
        setMedicalLicenseFileName(file.name);
        
        try {
          // Show loading state
          setIsVerifying(true);
          
          // Create FormData to send file
          const formData = new FormData();
          formData.append('file', file);
          
          // Send request to backend
          const response = await axios.post(
            'http://localhost:5000/verifyDocCertificate',
            formData,
            {
              headers: {
                'Content-Type': 'multipart/form-data',
              },
              timeout: 30000, // 30 second timeout for verification
            }
          );
          
          // Handle successful response
          if (response.data.status === 'success') {
            if (response.data.verified) {
              setMedicalLicenseVerified(true);
              setMedicalLicenseConfidence(response.data.confidence);
              setError(''); // Clear any previous errors
            } else {
              setMedicalLicenseVerified(false);
              setError('Medical license could not be verified. Please check the document and try again.');
            }
          } else {
            setError('Verification failed. Please try again.');
          }
          
        } catch (error) {
          console.error('Error verifying medical license:', error);
          
          // Handle different types of errors
          if (error.code === 'ECONNABORTED') {
            setError('Verification timeout. Please try again.');
          } else if (error.response) {
            // Server responded with error status
            const errorMessage = error.response.data?.error || 'Server error during verification';
            setError(errorMessage);
          } else if (error.request) {
            // Request was made but no response received
            setError('Unable to connect to verification service. Please check your connection.');
          } else {
            // Something else happened
            setError('An unexpected error occurred during verification.');
          }
          
          // Reset verification state on error
          setMedicalLicenseVerified(false);
          setMedicalLicenseConfidence(0);
          
        } finally {
          setIsVerifying(false); // Hide loading state
        }
        
      } else if (fileType === 'id') {
        setIdFile(file);
        setIdFileName(file.name);
        
        // You can add similar verification logic for ID documents here if needed
        // For now, just setting the file without verification
      }
      
      setError(''); // Clear previous errors on new valid upload
      setProof(null); // Clear previous proofs
      
    } else {
      setError("Please upload a valid PDF file.");
      
      // Clear file states if invalid file
      if (fileType === 'medicalLicense') {
        setMedicalLicenseFile(null);
        setMedicalLicenseFileName('');
        setMedicalLicenseVerified(false);
        setMedicalLicenseConfidence(0);
      } else if (fileType === 'id') {
        setIdFile(null);
        setIdFileName('');
      }
    }
  };

  const handleGenerateProof = async () => {
    if (!medicalLicenseFile || !idFile) {
      setError('Please upload both a medical license and an ID document.');
      return;
    }

    setIsLoading(true);
    setError('');
    setProof(null);

    // Commented out actual ZK proof generation, using mock data for now
    /*
    try {
      // Generate proofs for both files concurrently
      const [medicalLicenseProofData, idProofData] = await Promise.all([
        generateZkMedicalLicenseProof(medicalLicenseFile),
        generateZkNationalityProof(idFile)
      ]);
      
      setProof({
        medicalLicense: JSON.stringify(medicalLicenseProofData, null, 2),
        id: JSON.stringify(idProofData, null, 2)
      });

      } catch (err) {
        setError(err.message || 'An error occurred while generating proofs.');
      } finally {
        setIsLoading(false);
      }
    */

    // Use mock data for proof
    setProof({
      medicalLicense: JSON.stringify({ proof: "mock_medical_license_proof", details: "This is mock data." }, null, 2),
      id: JSON.stringify({ proof: "mock_id_proof", details: "This is mock data." }, null, 2)
    });
    setIsLoading(false);
  };

  useEffect(() => {
    if (proof) {
      sendDoctorProof(JSON.parse(proof))
        .then((res) => {
          console.log('Proof sent to backend:', res);
        })
        .catch((err) => {
          console.error('Error sending proof to backend:', err);
        });
    }
  }, [proof]);

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
      console.log(e.dataTransfer.files);
      handleFile(e.dataTransfer.files[0], fileType);
    }
  };

  const handleFileUpload = (e, fileType) => {
    if (e.target.files && e.target.files[0]) {
      console.log(e.target.files[0]);
      handleFile(e.target.files[0], fileType);
    }
  };

  const handleCancel = () => {
    setFormData({
      licenseNumber: '',
      specialty: '',
      issuingAuthority: ''
    });
    setMedicalLicenseFile(null);
    setMedicalLicenseFileName("");
    setIdFile(null);
    setIdFileName("");
    setProof(null);
    setError("");
    setIsLoading(false);
    setRandomNumber('');
    setidtext("Your unique doctor ID will appear here");
  };

  const handleSubmit = async () => {
    if (!proof) {
      setError('Please generate the proofs before submitting.');
      return;
    }

    if (!medicalLicenseFile) {
      setError('Please upload your medical license PDF.');
      return;
    }

    // Prepare FormData with all details and the certificate file
    const formDataToSend = new FormData();
    formDataToSend.append('name', formData.licenseNumber);
    formDataToSend.append('specialty', formData.specialty);
    formDataToSend.append('nationality', 'IND');
    formDataToSend.append('certificate', medicalLicenseFile);
    // Add doctor address from connected wallet
    formDataToSend.append('doctorAddress', account || "0xDoctorAddress");

    try {
      const response = await axios.post('http://localhost:5000/api/doctors/register', formDataToSend, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      // Handle response as needed
      console.log('Doctor registered:', response.data);
    } catch (err) {
      setError('Registration failed: ' + (err.message || 'Unknown error'));
    }
  };

  const generateRandomId = async () => {
    if (!contract) {
      setError('Contract not initialized. Please make sure your wallet is connected.');
      return;
    }

    try {
      console.log('Requesting random number from contract...');
      setIsTransactionPending(true);
      setIsLoading(true);
      
      // Call the contract function with value (1000000000000000 wei = 0.001 ETH)
      const tx = await contract.requestRandomNumber({
        value: ethers.parseEther('0.001') // Using parseEther for better readability
      });
      
      console.log('Transaction sent:', tx.hash);
      setidtext("Transaction sent! Waiting for confirmation...");
      
      // Wait for transaction to be mined
      const receipt = await tx.wait();
      console.log('Transaction confirmed:', receipt);
      
      setidtext("Transaction confirmed! Waiting for random number...");
      
    } catch (err) {
      console.error('Transaction failed:', err);
      setError(`Transaction failed: ${err.message}`);
      setidtext("Your unique doctor ID will appear here");
    } finally {
      setIsTransactionPending(false);
      setIsLoading(false);
    }
  };

  return (
    <div className="verification-page">
      <Navbar />
      
      <div className="verification-content">
        <div className="verification-header">
          <div className="security-icon">
            <svg width="50" height="60" viewBox="0 0 50 60" fill="none">
              <path d="M25 45.7143C23.3424 45.7143 21.7527 45.1122 20.5806 44.0406C19.4085 42.969 18.75 41.5155 18.75 40C18.75 36.8286 21.5312 34.2857 25 34.2857C26.6576 34.2857 28.2473 34.8878 29.4194 35.9594C30.5915 37.031 31.25 38.4845 31.25 40C31.25 41.5155 30.5915 42.969 29.4194 44.0406C28.2473 45.1122 26.6576 45.7143 25 45.7143ZM43.75 54.2857V25.7143H6.25V54.2857H43.75ZM43.75 20C45.4076 20 46.9973 20.602 48.1694 21.6737C49.3415 22.7453 50 24.1988 50 25.7143V54.2857C50 55.8012 49.3415 57.2547 48.1694 58.3263C46.9973 59.398 45.4076 60 43.75 60H6.25C4.5924 60 3.00268 59.398 1.83058 58.3263C0.65848 57.2547 0 55.8012 0 54.2857V25.7143C0 22.5429 2.78125 20 6.25 20H9.375V14.2857C9.375 10.4969 11.0212 6.86328 13.9515 4.18419C16.8817 1.5051 20.856 0 25 0C27.0519 0 29.0837 0.369511 30.9794 1.08744C32.8751 1.80536 34.5976 2.85764 36.0485 4.18419C37.4995 5.51074 38.6504 7.08559 39.4356 8.81881C40.2208 10.552 40.625 12.4097 40.625 14.2857V20H43.75ZM25 5.71429C22.5136 5.71429 20.129 6.61734 18.3709 8.2248C16.6127 9.83225 15.625 12.0124 15.625 14.2857V20H34.375V14.2857C34.375 12.0124 33.3873 9.83225 31.6291 8.2248C29.871 6.61734 27.4864 5.71429 25 5.71429Z" fill="black"/>
            </svg>
          </div>
          <h1 className="verification-title">Doctor Credential Verification</h1>
          <p className="verification-subtitle">
            Securely submit your credentials for verification on the blockchain. Help us build a trusted and transparent healthcare ecosystem.
          </p>
          {account && (
            <p className="wallet-info">Connected Wallet: {account.slice(0, 6)}...{account.slice(-4)}</p>
          )}
        </div>

        <div className="verification-form-container">
          <div className="form-section">
            <h2 className="section-title">Medical License Information</h2>

            {/* <div className="form-grid"> */}
              <div className="form-group">
                <label className="form-label">Name</label>
                <input type="text" name="licenseNumber" className="form-input" placeholder="eg. Dr John Doe" value={formData.licenseNumber} onChange={handleInputChange}  style={{marginBottom:'20px'}}/>
              </div>
              <div className="form-group">
                <label className="form-label">Speciality</label>
                <input type="text" name="specialty" className="form-input" placeholder="Cardiology, Pediatrics" value={formData.specialty} onChange={handleInputChange} style={{marginBottom:'20px'}}/>
              </div>
              <div className="form-group">
                <label className="form-label">City</label>
                <input type="text" name="specialty" className="form-input" placeholder="eg. Mumbai, NewYork" value={formData.specialty} onChange={handleInputChange} style={{marginBottom:'20px'}}/>
              </div>
            {/* </div> */}
          </div>

          <div className="divider"></div>

          <div className="upload-section">
            <h2 className="section-title">Upload and Verify Documents</h2>
            
            <p className="section-subtitle">1. Please upload a clear copy of your Medical License (PDF only).</p>
            <div className={`upload-area ${dragActive ? 'drag-active' : ''}`} onDragEnter={handleDrag} onDragLeave={handleDrag} onDragOver={handleDrag} onDrop={(e) => handleDrop(e, 'medicalLicense')} style={{marginBottom: '30px'}}>
              <div className="upload-icon">
                <svg width="80" height="80" viewBox="0 0 80 80" fill="none">
                  <path d="M40 10C29.7 10 21.6 17.825 20.4675 27.8125C18.2896 28.1648 16.2473 29.0987 14.5562 30.5157C12.8651 31.9326 11.5881 33.7799 10.86 35.8625C4.71 37.635 0 43.12 0 50C0 58.31 6.69 65 15 65H65C73.31 65 80 58.31 80 50C80 45.6 77.8625 41.66 74.765 38.905C74.185 30.12 67.1775 23.11 58.36 22.655C55.35 15.3325 48.445 10 40 10ZM40 15C46.905 15 52.425 19.425 54.375 25.7L54.925 27.5H57.5C64.3875 27.5 70 33.1125 70 40V41.25L71.015 42.0325C72.24 42.9713 73.2354 44.1766 73.9258 45.557C74.6162 46.9373 74.9835 48.4567 75 50C75 55.69 70.69 60 65 60H15C9.31 60 5 55.69 5 50C5 44.95 8.625 41.03 13.2 40.235L14.8425 39.9225L15.155 38.2775C15.905 34.91 18.89 32.5 22.5 32.5H25V30C25 21.575 31.575 15 40 15ZM40 28.985L38.2 30.7025L28.2 40.7025L31.8 44.3025L37.5 38.5925V55H42.5V38.5925L48.2 44.2975L51.8 40.6975L41.8 30.6975L40 28.985Z" fill="black"/>
                </svg>
              </div>
              <div className="upload-text">
                {medicalLicenseFileName ? medicalLicenseFileName : <><span className="upload-bold">Upload a PDF file</span> or drag and drop</>}
              </div>
              <input type="file" className="file-input" accept=".pdf" onChange={(e) => handleFileUpload(e, 'medicalLicense')} />
            </div>
            <div style={{display:'flex',justifyContent:''}}>
            <button style={{justifyContent:'center'}} className="submit-btn" onClick={handleGenerateProof} disabled={isLoading || !medicalLicenseFile || !idFile}>
              <svg className="check-icon" width="18" height="18" viewBox="0 0 20 20" fill="green">
                <path d="M12.8429 1.03526C13.1238 0.970706 13.4178 0.995206 13.6841 1.10536C13.9504 1.2155 14.1758 1.40584 14.329 1.64993L15.7081 3.85191C15.8193 4.02927 15.9692 4.17916 16.1466 4.29036L18.3486 5.66955C18.5932 5.82264 18.784 6.04818 18.8944 6.31477C19.0048 6.58137 19.0294 6.87576 18.9646 7.15697L18.3819 9.68779C18.3349 9.89233 18.3349 10.1049 18.3819 10.3094L18.9646 12.8416C19.0287 13.1224 19.0039 13.4162 18.8935 13.6822C18.7831 13.9483 18.5927 14.1733 18.3486 14.3263L16.1466 15.7068C15.9692 15.818 15.8193 15.9679 15.7081 16.1453L14.329 18.3473C14.176 18.5916 13.9506 18.7822 13.6843 18.8926C13.418 19.003 13.1239 19.0277 12.8429 18.9633L10.3107 18.3806C10.1066 18.3338 9.89459 18.3338 9.6905 18.3806L7.15828 18.9633C6.87728 19.0277 6.58319 19.003 6.31688 18.8926C6.05057 18.7822 5.82526 18.5916 5.67226 18.3473L4.29307 16.1453C4.18147 15.9678 4.03109 15.8179 3.85323 15.7068L1.65263 14.3276C1.40829 14.1746 1.21767 13.9493 1.10727 13.683C0.996866 13.4167 0.972156 13.1226 1.03657 12.8416L1.61794 10.3094C1.66495 10.1049 1.66495 9.89233 1.61794 9.68779L1.03519 7.15697C0.970589 6.87562 0.995352 6.58112 1.10603 6.31451C1.2167 6.0479 1.40777 5.82244 1.65263 5.66955L3.85323 4.29036C4.03109 4.17932 4.18147 4.02942 4.29307 3.85191L5.67226 1.64993C5.82537 1.4061 6.05053 1.21594 6.31654 1.10581C6.58256 0.995674 6.87624 0.971018 7.1569 1.03526L9.6905 1.61663C9.89459 1.66342 10.1066 1.66342 10.3107 1.61663L12.8429 1.03526Z" stroke="white" strokeWidth="1.5"/>
                <path d="M6.55176 10.7425L9.37535 13.4467L13.4477 6.55078" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              {isLoading ? 'Generating Proofs...' : 'Generate ZK Proof'}
            </button>
            </div>
            <div className='divider'></div>

            <p className="section-subtitle">2. Please upload a clear copy of your ID Document (PDF: Aadhar, PAN, etc.).</p>
            <div className={`upload-area ${dragActive ? 'drag-active' : ''}`} onDragEnter={handleDrag} onDragLeave={handleDrag} onDragOver={handleDrag} onDrop={(e) => handleDrop(e, 'id')}>
              <div className="upload-icon">
                <svg width="80" height="80" viewBox="0 0 80 80" fill="none">
                  <path d="M40 10C29.7 10 21.6 17.825 20.4675 27.8125C18.2896 28.1648 16.2473 29.0987 14.5562 30.5157C12.8651 31.9326 11.5881 33.7799 10.86 35.8625C4.71 37.635 0 43.12 0 50C0 58.31 6.69 65 15 65H65C73.31 65 80 58.31 80 50C80 45.6 77.8625 41.66 74.765 38.905C74.185 30.12 67.1775 23.11 58.36 22.655C55.35 15.3325 48.445 10 40 10ZM40 15C46.905 15 52.425 19.425 54.375 25.7L54.925 27.5H57.5C64.3875 27.5 70 33.1125 70 40V41.25L71.015 42.0325C72.24 42.9713 73.2354 44.1766 73.9258 45.557C74.6162 46.9373 74.9835 48.4567 75 50C75 55.69 70.69 60 65 60H15C9.31 60 5 55.69 5 50C5 44.95 8.625 41.03 13.2 40.235L14.8425 39.9225L15.155 38.2775C15.905 34.91 18.89 32.5 22.5 32.5H25V30C25 21.575 31.575 15 40 15ZM40 28.985L38.2 30.7025L28.2 40.7025L31.8 44.3025L37.5 38.5925V55H42.5V38.5925L48.2 44.2975L51.8 40.6975L41.8 30.6975L40 28.985Z" fill="black"/>
                </svg>
              </div>
              <div className="upload-text">
                {idFileName ? idFileName : <><span className="upload-bold">Upload a PDF file</span> or drag and drop</>}
              </div>
              <input type="file" className="file-input" accept=".pdf" onChange={(e) => handleFileUpload(e, 'id')} />
            </div>
          </div>
          
          {error && <p className="error-message">{error}</p>}
          {(isLoading || isVerifying) && <p className="loading-message">
            {isVerifying ? 'Verifying document...' : 'Generating your secure proofs... This may take a moment.'}
          </p>}
          {proof && (
            <div className="proof-container">
              <h3>Proofs Generated Successfully!</h3>
              <h4>Medical License Proof</h4>
              <pre><code>{proof.medicalLicense}</code></pre>
              <h4>ID Document Proof</h4>
              <pre><code>{proof.id}</code></pre>
            </div>
          )}

          <div className="form-actions" style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
            
            <button className="submit-btn" onClick={handleGenerateProof} disabled={isLoading || !medicalLicenseFile || !idFile}>
              <svg className="check-icon" width="18" height="18" viewBox="0 0 20 20" fill="green">
                <path d="M12.8429 1.03526C13.1238 0.970706 13.4178 0.995206 13.6841 1.10536C13.9504 1.2155 14.1758 1.40584 14.329 1.64993L15.7081 3.85191C15.8193 4.02927 15.9692 4.17916 16.1466 4.29036L18.3486 5.66955C18.5932 5.82264 18.784 6.04818 18.8944 6.31477C19.0048 6.58137 19.0294 6.87576 18.9646 7.15697L18.3819 9.68779C18.3349 9.89233 18.3349 10.1049 18.3819 10.3094L18.9646 12.8416C19.0287 13.1224 19.0039 13.4162 18.8935 13.6822C18.7831 13.9483 18.5927 14.1733 18.3486 14.3263L16.1466 15.7068C15.9692 15.818 15.8193 15.9679 15.7081 16.1453L14.329 18.3473C14.176 18.5916 13.9506 18.7822 13.6843 18.8926C13.418 19.003 13.1239 19.0277 12.8429 18.9633L10.3107 18.3806C10.1066 18.3338 9.89459 18.3338 9.6905 18.3806L7.15828 18.9633C6.87728 19.0277 6.58319 19.003 6.31688 18.8926C6.05057 18.7822 5.82526 18.5916 5.67226 18.3473L4.29307 16.1453C4.18147 15.9678 4.03109 15.8179 3.85323 15.7068L1.65263 14.3276C1.40829 14.1746 1.21767 13.9493 1.10727 13.683C0.996866 13.4167 0.972156 13.1226 1.03657 12.8416L1.61794 10.3094C1.66495 10.1049 1.66495 9.89233 1.61794 9.68779L1.03519 7.15697C0.970589 6.87562 0.995352 6.58112 1.10603 6.31451C1.2167 6.0479 1.40777 5.82244 1.65263 5.66955L3.85323 4.29036C4.03109 4.17932 4.18147 4.02942 4.29307 3.85191L5.67226 1.64993C5.82537 1.4061 6.05053 1.21594 6.31654 1.10581C6.58256 0.995674 6.87624 0.971018 7.1569 1.03526L9.6905 1.61663C9.89459 1.66342 10.1066 1.66342 10.3107 1.61663L12.8429 1.03526Z" stroke="white" strokeWidth="1.5"/>
                <path d="M6.55176 10.7425L9.37535 13.4467L13.4477 6.55078" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              {isLoading ? 'Generating Proofs...' : 'Generate ZK Proof'}
            </button>
          </div>
          
          <div className='divider'></div>
          
          <div className='id-generation-section'>
            <h2 className="section-title">Generate your ID</h2>
            <p className="section-subtitle">Your ID, Your Identity</p>
            <div className="form-group">
              <input
                type="text"
                style={{width: '100%', marginBottom: '20px'}}
                className="form-input"
                value={randomNumber || ''}
                readOnly
                placeholder={idtext}
              />
            </div>
            <button
              className="submit-btn"
              onClick={async () => {
                setidtext("Generating your unique doctor ID...");
                generateRandomId();
              }}
              disabled={isLoading || isTransactionPending || !contract}
            >
              {isTransactionPending ? 'Processing Transaction...' : 'Generate Doctor ID'}
            </button>
          </div>
          
          <div className='divider'></div>

          <button 
            className='submit-btn' 
            onClick={handleSubmit} 
            style={{alignSelf:'center'}} 
            disabled={isLoading || !medicalLicenseFile || !idFile || !proof || !medicalLicenseVerified}
          >
            Register
          </button>
        </div>
      </div>
    </div>
  );
};

export default DoctorVerification;