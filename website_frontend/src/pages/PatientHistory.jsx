import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import '../styles/PatientHistory.css';
import CryptoJS from "crypto-js"; // npm install crypto-js
import axios from 'axios';

const PatientHistory = () => {
  const [activeTab, setActiveTab] = useState('ai-assistant');
  const [patientData, setPatientData] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  const potentialDiagnoses = [
    {
      title: 'Possible Migraine',
      description: 'Based on symptoms and medical history'
    },
    {
      title: 'Tension Headache',
      description: 'Consider further evaluation'
    }
  ];

  const recommendedTests = [
    {
      title: 'Neurological Examination',
      description: 'To rule out other conditions'
    },
    {
      title: 'Electroencephalogram (EEG)',
      description: 'To assess brain activity'
    }
  ];

  const drugInteractions = [
    {
      title: 'Interaction between medication A and medication B',
      description: 'May increase risk of side effects'
    },
    {
      title: 'Interaction between medication C and medication D',
      description: 'Monitor closely for adverse reactions'
    }
  ];

  useEffect(() => {
    async function fetchAndDecryptPatientData() {
      setLoading(true);
      const patientId = localStorage.getItem("patientId");
      const key = localStorage.getItem("key");
      if (!patientId || !key) {
        setLoading(false);
        return;
      }

      // 1. Fetch blobId from Hedera contract
      const blobId = await fetchBlobIDFromHedera(patientId);

      // 2. Fetch encrypted blob data
      const encryptedBlob = await fetchEncryptedBlob(blobId);

      // 3. Decrypt using AES
      let decrypted;
      try {
        const bytes = CryptoJS.AES.decrypt(encryptedBlob, key);
        decrypted = bytes.toString(CryptoJS.enc.Utf8);
      } catch (e) {
        setLoading(false);
        return;
      }

      // 4. Parse and set patient data
      try {
        const data = JSON.parse(decrypted);

        setPatientData({
          name: data.personalDetails?.name || '',
          id: data.patientId || '',
          age: data.personalDetails?.age || '',
          gender: data.personalDetails?.gender || '',
          bloodType: data.initialMedicalHistory?.bloodGroup || '',
          allergies: data.initialMedicalHistory?.knownAllergies || ''
        });

        setAppointments(
          (data.recentAppointments || []).map(appt => ({
            date: appt.date,
            type: appt.diagnosis || appt.type || ''
          }))
        );
      } catch (e) {
        setLoading(false);
        return;
      }
      setLoading(false);
    }

    fetchAndDecryptPatientData();
  }, []);

  // Dummy implementations, replace with actual logic
  async function fetchBlobIDFromHedera(patientId) {
    const response = await axios("hhtp://localhost:5000/api/getBlobId", {patientId: patientId});
    if(response.data.blobId){
      return response.data.blobId;
    }
  }
  async function fetchEncryptedBlob(blobId) {

    // Fetch from your storage (IPFS, S3, etc.)
    // return await fetch(blobId).then(res => res.text());
    return "ENCRYPTED_BLOB_STRING";
  }

  return (
    <div className="patient-history-page">
      <Navbar />
      <div className="patient-container">
        <div className="patient-header">
          <h1 className="patient-title">
            Patient: {loading ? "Loading..." : (patientData?.name || "Unknown")}
          </h1>
        </div>

        <div className="patient-history-content">
          <div className="main-content">
            <div className="tab-content">
              {activeTab === 'ai-assistant' && (
                <div className="ai-assistant-content">
                  <div className="ai-cards-container">
                    <div className="ai-card potential-diagnoses">
                      <div className="card-header">
                        <svg className="card-icon diagnoses-icon" width="26" height="21" viewBox="0 0 26 21" fill="none">
                          <g clipPath="url(#clip0_143_1612)">
                            <path d="M20.15 10.5C20.5075 10.5 20.8 10.2047 20.8 9.84375C20.8 9.48281 20.5075 9.1875 20.15 9.1875C19.7925 9.1875 19.5 9.48281 19.5 9.84375C19.5 10.2047 19.7925 10.5 20.15 10.5ZM13 7.21875C14.9703 7.21875 16.575 5.59863 16.575 3.60938C16.575 1.62012 14.9703 0 13 0C11.0297 0 9.425 1.62012 9.425 3.60938C9.425 5.59863 11.0297 7.21875 13 7.21875ZM2.42937 14.9297C2.84375 15.5572 3.61969 15.6598 4.17219 15.3316C4.83031 14.9379 6.45531 14.0314 8.45 13.3383V17.0625H17.55V13.3424C19.5447 14.0314 21.1697 14.942 21.8278 15.3357C22.3803 15.6639 23.1562 15.5531 23.5706 14.9338L24.2937 13.8387C24.6512 13.2973 24.6025 12.4195 23.8875 11.9889C23.4041 11.6977 22.6809 11.2916 21.8116 10.865C20.67 12.7559 17.7734 11.5951 18.2488 9.42539C16.6278 8.90859 14.8322 8.53125 13 8.53125C10.6844 8.53125 8.41344 9.12598 6.5 9.85195C6.49187 11.5008 4.56625 12.4482 3.2825 11.3285C2.8275 11.5746 2.41719 11.8043 2.11656 11.9848C1.40156 12.4154 1.35281 13.2891 1.71031 13.8346L2.42937 14.9297ZM14.95 14.1094C15.4903 14.1094 15.925 14.5482 15.925 15.0938C15.925 15.6393 15.4903 16.0781 14.95 16.0781C14.4097 16.0781 13.975 15.6393 13.975 15.0938C13.975 14.5482 14.4097 14.1094 14.95 14.1094ZM11.05 10.1719C11.5903 10.1719 12.025 10.6107 12.025 11.1562C12.025 11.7018 11.5903 12.1406 11.05 12.1406C10.5097 12.1406 10.075 11.7018 10.075 11.1562C10.075 10.6107 10.5097 10.1719 11.05 10.1719ZM4.55 10.5C4.9075 10.5 5.2 10.2047 5.2 9.84375C5.2 9.48281 4.9075 9.1875 4.55 9.1875C4.1925 9.1875 3.9 9.48281 3.9 9.84375C3.9 10.2047 4.1925 10.5 4.55 10.5ZM25.35 18.375H0.65C0.2925 18.375 0 18.6703 0 19.0312V20.3438C0 20.7047 0.2925 21 0.65 21H25.35C25.7075 21 26 20.7047 26 20.3438V19.0312C26 18.6703 25.7075 18.375 25.35 18.375Z" fill="#007C05"/>
                          </g>
                          <defs>
                            <clipPath id="clip0_143_1612">
                              <rect width="26" height="21" fill="white"/>
                            </clipPath>
                          </defs>
                        </svg>
                        <h3 className="card-title">Potential Diagnoses</h3>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="medical-card chronic-card">
                  <div className="card-header">
                    <svg className="card-icon" width="30" height="30" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M11.3438 24.75C8.80208 24.2083 6.69292 22.9167 5.01625 20.875C3.33958 18.8333 2.50083 16.4583 2.5 13.75C2.5 10.625 3.59375 7.96875 5.78125 5.78125C7.96875 3.59375 10.625 2.5 13.75 2.5C16.875 2.5 19.5312 3.59375 21.7188 5.78125C23.9062 7.96875 25 10.625 25 13.75C25 14.6458 24.8958 15.5158 24.6875 16.36C24.4792 17.2042 24.1875 18.0008 23.8125 18.75H16.1875C14.8125 18.75 13.6458 19.2396 12.6875 20.2188C11.7292 21.1979 11.25 22.375 11.25 23.75C11.25 23.9167 11.2554 24.0833 11.2662 24.25C11.2771 24.4167 11.3029 24.5833 11.3438 24.75ZM16.25 18L18 16.25L15 13.25V7.5H12.5V14.25L16.25 18ZM16.25 26.25H23.75C24.4375 26.25 25.0263 26.005 25.5163 25.515C26.0063 25.025 26.2508 24.4367 26.25 23.75C26.2492 23.0633 26.0046 22.475 25.5163 21.985C25.0279 21.495 24.4392 21.25 23.75 21.25H16.25C15.5625 21.25 14.9742 21.495 14.485 21.985C13.9958 22.475 13.7508 23.0633 13.75 23.75C13.7492 24.4367 13.9942 25.0254 14.485 25.5163C14.9758 26.0071 15.5642 26.2517 16.25 26.25ZM16.25 25C15.8958 25 15.5992 24.88 15.36 24.64C15.1208 24.4 15.0008 24.1033 15 23.75C14.9992 23.3967 15.1192 23.1 15.36 22.86C15.6008 22.62 15.8975 22.5 16.25 22.5C16.6025 22.5 16.8996 22.62 17.1413 22.86C17.3829 23.1 17.5025 23.3967 17.5 23.75C17.4975 24.1033 17.3775 24.4004 17.14 24.6412C16.9025 24.8821 16.6058 25.0017 16.25 25ZM20 25C19.6458 25 19.3492 24.88 19.11 24.64C18.8708 24.4 18.7508 24.1033 18.75 23.75C18.7492 23.3967 18.8692 23.1 19.11 22.86C19.3508 22.62 19.6475 22.5 20 22.5C20.3525 22.5 20.6496 22.62 20.8912 22.86C21.1329 23.1 21.2525 23.3967 21.25 23.75C21.2475 24.1033 21.1275 24.4004 20.89 24.6412C20.6525 24.8821 20.3558 25.0017 20 25ZM23.75 25C23.3958 25 23.0992 24.88 22.86 24.64C22.6208 24.4 22.5008 24.1033 22.5 23.75C22.4992 23.3967 22.6192 23.1 22.86 22.86C23.1008 22.62 23.3975 22.5 23.75 22.5C24.1025 22.5 24.3996 22.62 24.6412 22.86C24.8829 23.1 25.0025 23.3967 25 23.75C24.9975 24.1033 24.8775 24.4004 24.64 24.6412C24.4025 24.8821 24.1058 25.0017 23.75 25Z" fill="#007C05"/>
                    </svg>
                    <h3 className="card-title">Chronic Conditions</h3>
                  </div>
                  <div className="card-content">
                    {chronicConditions.map((condition, index) => (
                      <div key={index} className="medical-record-item">
                        <div className="record-divider"></div>
                        <div className="record-details">
                          <h4 className="record-name">{condition.name}</h4>
                          <p className="record-verified">Verified by {condition.verifiedBy}</p>
                        </div>
                        <span className="record-date">{condition.date}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="medical-card procedures-card">
                  <div className="card-header">
                    <svg className="card-icon" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <g clipPath="url(#clip0_170_1894)">
                        <path fillRule="evenodd" clipRule="evenodd" d="M6.12059 3.03C6.27113 2.58432 6.55757 2.19703 6.93963 1.92258C7.3217 1.64814 7.78018 1.50035 8.25059 1.5H8.65259C9.17159 0.603 10.1406 0 11.2476 0H12.7476C13.8576 0 14.8326 0.603 15.3426 1.5H15.7446C16.215 1.50035 16.6735 1.64814 17.0556 1.92258C17.4376 2.19703 17.7241 2.58432 17.8746 3.03C18.8181 3.081 19.4796 3.1995 20.0346 3.4845C20.8793 3.91746 21.5666 4.60481 21.9996 5.4495C22.4901 6.4125 22.4901 7.6695 22.4901 10.1895V15.5595L20.9901 12.5595V10.1895C20.9901 8.904 20.9901 8.0295 20.9331 7.3545C20.8806 6.6975 20.7831 6.36 20.6631 6.126C20.3755 5.56154 19.9166 5.10262 19.3521 4.815C19.1181 4.695 18.7821 4.5975 18.1236 4.545L17.9901 4.5345V5.2395C17.9901 5.83624 17.753 6.40853 17.3311 6.83049C16.9091 7.25245 16.3368 7.4895 15.7401 7.4895H8.24009C7.64336 7.4895 7.07106 7.25245 6.6491 6.83049C6.22715 6.40853 5.99009 5.83624 5.99009 5.2395V4.5345L5.85659 4.545C5.19959 4.599 4.86209 4.6965 4.62809 4.815C4.06363 5.10262 3.60471 5.56154 3.31709 6.126C3.19709 6.36 3.09959 6.6975 3.04709 7.3545C2.99309 8.0295 2.99159 8.8995 2.99159 10.1895V16.7895C2.99159 18.075 2.99159 18.9495 3.04709 19.6245C3.10109 20.2815 3.19859 20.619 3.31709 20.853C3.60509 21.417 4.06409 21.876 4.62809 22.164C4.86209 22.284 5.19959 22.3815 5.85809 22.434C6.53309 22.4895 7.40309 22.491 8.69309 22.491H8.99609C9.02909 23.028 9.19859 23.544 9.47609 23.991H8.69159C6.17159 23.991 4.91159 23.991 3.95159 23.5005C3.10569 23.0692 2.41788 22.3814 1.98659 21.5355C1.49609 20.5725 1.49609 19.3155 1.49609 16.7955V10.1955C1.49609 7.6755 1.49609 6.4155 1.98659 5.4555C2.41955 4.61081 3.1069 3.92346 3.95159 3.4905C4.50959 3.2055 5.16659 3.0855 6.11159 3.0345L6.12059 3.03ZM9.09059 2.994C9.22224 2.994 9.35157 2.95934 9.46558 2.89351C9.57959 2.82769 9.67427 2.73301 9.74009 2.619L9.95609 2.244C10.0877 2.01548 10.2772 1.82568 10.5055 1.69375C10.7338 1.56181 10.9929 1.4924 11.2566 1.4925H12.7566C13.0201 1.49224 13.2791 1.56143 13.5074 1.6931C13.7357 1.82476 13.9253 2.01426 14.0571 2.2425L14.2731 2.6175C14.3389 2.73151 14.4336 2.82619 14.5476 2.89201C14.6616 2.95784 14.7909 2.9925 14.9226 2.9925H15.7566C15.9555 2.9925 16.1463 3.07152 16.2869 3.21217C16.4276 3.35282 16.5066 3.54359 16.5066 3.7425V5.2425C16.5066 5.44141 16.4276 5.63218 16.2869 5.77283C16.1463 5.91348 15.9555 5.9925 15.7566 5.9925H8.25659C8.05768 5.9925 7.86691 5.91348 7.72626 5.77283C7.58561 5.63218 7.50659 5.44141 7.50659 5.2425V3.7425C7.50659 3.54359 7.58561 3.35282 7.72626 3.21217C7.86691 3.07152 8.05768 2.9925 8.25659 2.9925L9.09059 2.994Z" fill="#007C05"/>
                        <path fillRule="evenodd" clipRule="evenodd" d="M10.6808 21.6L15.7508 11.475C16.3718 10.2345 18.1358 10.2345 18.7508 11.475L23.8208 21.6C23.9498 21.8567 24.0111 22.142 23.9989 22.429C23.9867 22.716 23.9015 22.9951 23.7513 23.24C23.6011 23.4848 23.3909 23.6872 23.1405 23.8281C22.8902 23.969 22.6081 24.0436 22.3208 24.045H12.1808C10.9298 24.045 10.1108 22.722 10.6808 21.6ZM18.3758 15.42C18.3758 14.625 17.7953 14.295 17.2508 14.295C16.7063 14.295 16.1258 14.628 16.1258 15.42C16.1258 16.212 16.4078 17.64 16.5008 18.045C16.5938 18.45 16.8368 18.795 17.2508 18.795C17.6648 18.795 17.8958 18.4545 18.0008 18.045C18.1058 17.6355 18.3758 16.2 18.3758 15.42ZM18.3758 21.045C18.3758 21.3434 18.2573 21.6295 18.0463 21.8405C17.8353 22.0515 17.5492 22.17 17.2508 22.17C16.9524 22.17 16.6663 22.0515 16.4553 21.8405C16.2443 21.6295 16.1258 21.3434 16.1258 21.045C16.1258 20.7466 16.2443 20.4605 16.4553 20.2495C16.6663 20.0385 16.9524 19.92 17.2508 19.92C17.5492 19.92 17.8353 20.0385 18.0463 20.2495C18.2573 20.4605 18.3758 20.7466 18.3758 21.045Z" fill="#007C05"/>
                      </g>
                      <defs>
                        <clipPath id="clip0_170_1894">
                          <rect width="24" height="24" fill="white"/>
                        </clipPath>
                      </defs>
                    </svg>
                    <h3 className="card-title">Past Procedures</h3>
                  </div>
                  <div className="card-content">
                    {pastProcedures.map((procedure, index) => (
                      <div key={index} className="medical-record-item">
                        <div className="record-divider"></div>
                        <div className="record-details">
                          <h4 className="record-name">{procedure.name}</h4>
                          <p className="record-verified">Verified by {procedure.verifiedBy}</p>
                        </div>
                        <span className="record-date">{procedure.date}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="sidebar">
            <div className="sidebar-card patient-profile-card">
              <div className="profile-avatar">
                <svg width="100" height="100" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="50" cy="50" r="50" fill="#D9D9D9"/>
                </svg>
              </div>
              <h3 className="profile-name">{loading ? "Loading..." : (patientData?.name || "Unknown")}</h3>
              <p className="profile-id">Patient ID: {loading ? "..." : (patientData?.id || "Unknown")}</p>
            </div>

            <div className="sidebar-card patient-details-card">
              <h3 className="details-title">Patient Details</h3>
              <div className="details-list">
                <div className="detail-item">
                  <span className="detail-label">Age</span>
                  <span className="detail-value">{loading ? "..." : (patientData?.age || "Unknown")}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Gender</span>
                  <span className="detail-value">{loading ? "..." : (patientData?.gender || "Unknown")}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Blood Type</span>
                  <span className="detail-value">{loading ? "..." : (patientData?.bloodType || "Unknown")}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Allergies</span>
                  <span className="detail-value">{loading ? "..." : (patientData?.allergies || "Unknown")}</span>
                </div>
              </div>
            </div>

            <div className="sidebar-card recent-appointments-card">
              <h3 className="appointments-title">Recent Appointments</h3>
              <div className="appointments-list">
                {loading ? (
                  <div>Loading...</div>
                ) : (
                  appointments.map((appointment, index) => (
                    <div key={index} className="appointment-item">
                      <div className="appointment-icon">
                        <svg width="50" height="50" viewBox="0 0 50 50" fill="none">
                          <circle cx="25" cy="25" r="25" fill="#BBF7D0"/>
                        </svg>
                        <svg className="calendar-icon" width="24" height="24" viewBox="0 0 24 24" fill="none">
                          <path d="M19 19H5V8H19M16 1V3H8V1H6V3H5C3.89 3 3 3.89 3 5V19C3 19.5304 3.21071 20.0391 3.58579 20.4142C3.96086 20.7893 4.46957 21 5 21H19C19.5304 21 20.0391 20.7893 20.4142 20.4142C20.7893 20.0391 21 19.5304 21 19V5C21 4.46957 20.7893 3.96086 20.4142 3.58579C20.0391 3.21071 19.5304 3 19 3H18V1M17 12H12V17H17V12Z" fill="#4CAF50"/>
                        </svg>
                      </div>
                      <div className="appointment-details">
                        <div className="appointment-date">{appointment.date}</div>
                        <div className="appointment-type">{appointment.type}</div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PatientHistory;
