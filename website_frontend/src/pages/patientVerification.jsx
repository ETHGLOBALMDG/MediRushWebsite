import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import '../styles/patientVerification.css';

const PatientVerification = () => {
  const [formData, setFormData] = useState({
    name: '',
    dateOfBirth: '',
    email: '',
    contactNumber: '',
    knownAllergies: '',
    chronicConditions: ''
  });

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = () => {
    console.log('Submit patient profile:', formData);
  };

  const handleCancel = () => {
    setFormData({
      name: '',
      dateOfBirth: '',
      email: '',
      contactNumber: '',
      knownAllergies: '',
      chronicConditions: ''
    });
  };

  return (
    <div className="patient-verification-page">
      <Navbar />
      
      <div className="patient-verification-content">
        <div className="patient-verification-header">
          <div className="security-icon">
            <svg width="50" height="60" viewBox="0 0 50 60" fill="none">
              <path d="M25 45.7143C23.3424 45.7143 21.7527 45.1122 20.5806 44.0406C19.4085 42.969 18.75 41.5155 18.75 40C18.75 36.8286 21.5312 34.2857 25 34.2857C26.6576 34.2857 28.2473 34.8878 29.4194 35.9594C30.5915 37.031 31.25 38.4845 31.25 40C31.25 41.5155 30.5915 42.969 29.4194 44.0406C28.2473 45.1122 26.6576 45.7143 25 45.7143ZM43.75 54.2857V25.7143H6.25V54.2857H43.75ZM43.75 20C45.4076 20 46.9973 20.602 48.1694 21.6737C49.3415 22.7453 50 24.1988 50 25.7143V54.2857C50 55.8012 49.3415 57.2547 48.1694 58.3263C46.9973 59.398 45.4076 60 43.75 60H6.25C4.5924 60 3.00268 59.398 1.83058 58.3263C0.65848 57.2547 0 55.8012 0 54.2857V25.7143C0 22.5429 2.78125 20 6.25 20H9.375V14.2857C9.375 10.4969 11.0212 6.86328 13.9515 4.18419C16.8817 1.5051 20.856 0 25 0C27.0519 0 29.0837 0.369511 30.9794 1.08744C32.8751 1.80536 34.5976 2.85764 36.0485 4.18419C37.4995 5.51074 38.6504 7.08559 39.4356 8.81881C40.2208 10.552 40.625 12.4097 40.625 14.2857V20H43.75ZM25 5.71429C22.5136 5.71429 20.129 6.61734 18.3709 8.2248C16.6127 9.83225 15.625 12.0124 15.625 14.2857V20H34.375V14.2857C34.375 12.0124 33.3873 9.83225 31.6291 8.2248C29.871 6.61734 27.4864 5.71429 25 5.71429Z" fill="black"/>
            </svg>
          </div>

          <h1 className="patient-verification-title">Create Your Patient Profile</h1>
          <p className="patient-verification-subtitle">
            Your information is encrypted and stored securely on the blockchain. Please provide your details below.
          </p>
        </div>

        <div className="patient-form-container">
          <div className="personal-details-section">
            <h2 className="section-title">Personal Details</h2>
            <p className="section-subtitle">This Information will be encrypted and stored securely</p>

            <div className="form-grid">
              <div className="form-group">
                <label className="form-label">Name</label>
                <input
                  type="text"
                  name="name"
                  className="form-input"
                  placeholder="eg. Dhruv"
                  value={formData.name}
                  onChange={handleInputChange}
                />
              </div>
              
              <div className="form-group">
                <label className="form-label">Date of Birth</label>
                <input
                  type="text"
                  name="dateOfBirth"
                  className="form-input"
                  placeholder="mm/dd/yyyy"
                  value={formData.dateOfBirth}
                  onChange={handleInputChange}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Email Address</label>
                <input
                  type="email"
                  name="email"
                  className="form-input"
                  placeholder="eg. abc@gmail.com"
                  value={formData.email}
                  onChange={handleInputChange}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Contact Number</label>
                <input
                  type="tel"
                  name="contactNumber"
                  className="form-input"
                  placeholder="eg. 987654321"
                  value={formData.contactNumber}
                  onChange={handleInputChange}
                />
              </div>
            </div>
          </div>

          <div className="divider"></div>

          <div className="medical-history-section">
            <h2 className="section-title">Initial Medical History</h2>

            <div className="form-grid">
              <div className="form-group">
                <label className="form-label">Known Allergies</label>
                <textarea
                  name="knownAllergies"
                  className="form-textarea"
                  placeholder="eg. Penicillin"
                  value={formData.knownAllergies}
                  onChange={handleInputChange}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Chronic Conditions</label>
                <textarea
                  name="chronicConditions"
                  className="form-textarea"
                  placeholder="eg. Asthma"
                  value={formData.chronicConditions}
                  onChange={handleInputChange}
                />
              </div>
            </div>
          </div>

          <div className="form-actions">
            <button className="cancel-btn" onClick={handleCancel}>
              Cancel
            </button>
            <button className="submit-btn" onClick={handleSubmit}>
              <svg className="check-icon" width="18" height="18" viewBox="0 0 20 20" fill="none">
                <path d="M12.8429 1.03526C13.1238 0.970706 13.4178 0.995206 13.6841 1.10536C13.9504 1.2155 14.1758 1.40584 14.329 1.64993L15.7081 3.85191C15.8193 4.02927 15.9692 4.17916 16.1466 4.29036L18.3486 5.66955C18.5932 5.82264 18.784 6.04818 18.8944 6.31477C19.0048 6.58137 19.0294 6.87576 18.9646 7.15697L18.3819 9.68779C18.3349 9.89233 18.3349 10.1049 18.3819 10.3094L18.9646 12.8416C19.0287 13.1224 19.0039 13.4162 18.8935 13.6822C18.7831 13.9483 18.5927 14.1733 18.3486 14.3263L16.1466 15.7068C15.9692 15.818 15.8193 15.9679 15.7081 16.1453L14.329 18.3473C14.176 18.5916 13.9506 18.7822 13.6843 18.8926C13.418 19.003 13.1239 19.0277 12.8429 18.9633L10.3107 18.3806C10.1066 18.3338 9.89459 18.3338 9.6905 18.3806L7.15828 18.9633C6.87728 19.0277 6.58319 19.003 6.31688 18.8926C6.05057 18.7822 5.82526 18.5916 5.67226 18.3473L4.29307 16.1453C4.18147 15.9678 4.03109 15.8179 3.85323 15.7068L1.65263 14.3276C1.40829 14.1746 1.21767 13.9493 1.10727 13.683C0.996866 13.4167 0.972156 13.1226 1.03657 12.8416L1.61794 10.3094C1.66495 10.1049 1.66495 9.89233 1.61794 9.68779L1.03519 7.15697C0.970589 6.87562 0.995352 6.58112 1.10603 6.31451C1.2167 6.0479 1.40777 5.82244 1.65263 5.66955L3.85323 4.29036C4.03109 4.17932 4.18147 4.02942 4.29307 3.85191L5.67226 1.64993C5.82537 1.4061 6.05053 1.21594 6.31654 1.10581C6.58256 0.995674 6.87624 0.971018 7.1569 1.03526L9.6905 1.61663C9.89459 1.66342 10.1066 1.66342 10.3107 1.61663L12.8429 1.03526Z" stroke="black" strokeWidth="1.5"/>
                <path d="M6.55176 10.7425L9.37535 13.4467L13.4477 6.55078" stroke="black" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Save and Secure Profile
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PatientVerification;
