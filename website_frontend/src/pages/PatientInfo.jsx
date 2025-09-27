import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import '../styles/PatientInfo.css';

const PatientInfo = () => {
  const [activeTab, setActiveTab] = useState('ai-assistant');
  const navigate = useNavigate();

  const patientData = {
    name: 'Dhruv Saxena',
    id: '123456',
    age: '25',
    gender: 'Male',
    bloodType: 'O+',
    allergies: 'None'
  };

  const appointments = [
    {
      date: '24-09-2025',
      type: 'Neurology Consultation'
    },
    {
      date: '24-09-2025',
      type: 'Neurology Consultation'
    }
  ];

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

  return (
    <div className="patient-page">
      <Navbar />
      
      <div className="patient-container">
        <div className="patient-header">
          <h1 className="patient-title">Patient: {patientData.name}</h1>
        </div>

        <div className="patient-content">
          <div className="main-content">
            <div className="tab-navigation">
              <button 
                className={`tab-btn ${activeTab === 'overview' ? 'active' : ''}`}
                onClick={() => setActiveTab('overview')}
              >
                Overview
              </button>
              <button 
                className={`tab-btn ${activeTab === 'medical-history' ? 'active' : ''}`}
                onClick={() => setActiveTab('medical-history')}
              >
                Medical History
              </button>
              <button 
                className={`tab-btn ${activeTab === 'ai-assistant' ? 'active' : ''}`}
                onClick={() => setActiveTab('ai-assistant')}
              >
                AI Assistant
              </button>
              <button
                className="update-record-btn"
                onClick={() => navigate('/update-patient-record')}
              >
                Update Record
              </button>
            </div>

            <div className="tab-content">
              {activeTab === 'ai-assistant' && (
                <div className="ai-assistant-content">
                  <div className="ai-section-header">
                    <h2 className="ai-title">AI Assistant</h2>
                    <p className="ai-description">
                      The AI assistant analyzes patient data to provide insights and support clinical decision-making. 
                      It can suggest potential diagnoses, recommend relevant tests, and flag potential drug interactions 
                      based on the patient's medical history.
                    </p>
                  </div>

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
                      <div className="card-content">
                        {potentialDiagnoses.map((diagnosis, index) => (
                          <div key={index} className="diagnosis-item">
                            <div className="item-indicator"></div>
                            <div className="item-content">
                              <h4 className="item-title">{diagnosis.title}</h4>
                              <p className="item-description">{diagnosis.description}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="ai-card recommended-tests">
                      <div className="card-header">
                        <svg className="card-icon tests-icon" width="26" height="26" viewBox="0 0 26 26" fill="none">
                          <path d="M16.9006 9.89299V3.89999H18.2006V1.29999H7.80055V3.89999H9.10055V9.89299L1.48255 22.737C1.36553 22.9344 1.30283 23.1592 1.30083 23.3886C1.29883 23.6181 1.35759 23.844 1.47115 24.0434C1.5847 24.2427 1.74901 24.4085 1.94738 24.5238C2.14574 24.6392 2.3711 24.6999 2.60055 24.7H23.4006C23.63 24.6999 23.8554 24.6392 24.0537 24.5238C24.2521 24.4085 24.4164 24.2427 24.53 24.0434C24.6435 23.844 24.7023 23.6181 24.7003 23.3886C24.6983 23.1592 24.6356 22.9344 24.5186 22.737L16.9006 9.89299ZM11.4406 11.037C11.6093 10.812 11.7006 10.5383 11.7006 10.257V3.89999H14.3006V10.257C14.3006 10.4903 14.3635 10.7193 14.4826 10.92L17.2646 15.6H8.73655L11.4406 11.037Z" fill="#007C05"/>
                        </svg>
                        <h3 className="card-title">Recommended Tests</h3>
                      </div>
                      <div className="card-content">
                        {recommendedTests.map((test, index) => (
                          <div key={index} className="test-item">
                            <div className="item-indicator"></div>
                            <div className="item-content">
                              <h4 className="item-title">{test.title}</h4>
                              <p className="item-description">{test.description}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="ai-card drug-interactions">
                      <div className="card-header">
                        <svg className="card-icon interactions-icon" width="26" height="26" viewBox="0 0 26 26" fill="none">
                          <path d="M12.9993 10.8333L17.3327 18.4166H8.66602L12.9993 10.8333Z" stroke="#007C05" strokeWidth="2" strokeLinecap="round"/>
                          <path d="M12.9993 4.33331L23.0202 21.6666H2.97852L12.9993 4.33331Z" stroke="#007C05" strokeWidth="2" strokeLinecap="round"/>
                        </svg>
                        <h3 className="card-title">Potential Drug Interactions</h3>
                      </div>
                      <div className="card-content">
                        {drugInteractions.map((interaction, index) => (
                          <div key={index} className="interaction-item">
                            <div className="item-indicator"></div>
                            <div className="item-content">
                              <h4 className="item-title">{interaction.title}</h4>
                              <p className="item-description">{interaction.description}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="sidebar">
            <div className="sidebar-card patient-profile">
              <div className="profile-avatar">
                <svg width="100" height="100" viewBox="0 0 100 100" fill="none">
                  <circle cx="50" cy="50" r="50" fill="#D9D9D9"/>
                </svg>
              </div>
              <h3 className="profile-name">{patientData.name}</h3>
              <p className="profile-id">Patient ID: {patientData.id}</p>
            </div>

            <div className="sidebar-card patient-details">
              <h3 className="details-title">Patient Details</h3>
              <div className="details-list">
                <div className="detail-item">
                  <span className="detail-label">Age</span>
                  <span className="detail-value">{patientData.age}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Gender</span>
                  <span className="detail-value">{patientData.gender}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Blood Type</span>
                  <span className="detail-value">{patientData.bloodType}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Allergies</span>
                  <span className="detail-value">{patientData.allergies}</span>
                </div>
              </div>
            </div>

            <div className="sidebar-card recent-appointments">
              <h3 className="appointments-title">Recent Appointments</h3>
              <div className="appointments-list">
                {appointments.map((appointment, index) => (
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
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PatientInfo;
