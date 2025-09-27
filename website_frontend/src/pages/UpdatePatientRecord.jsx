import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import '../styles/UpdatePatientRecord.css';

const UpdatePatientRecord = () => {
  const [formData, setFormData] = useState({
    diagnosis: '',
    treatmentNotes: '',
    prescriptions: ''
  });

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = () => {
    // Handle form submission logic here
    console.log('Submitting patient record update:', formData);
  };

  return (
    <div className="update-patient-record-page">
      <Navbar />
      
      <div className="update-patient-record-container">
        <div className="update-header">
          <h1 className="update-title">Update Patient Record</h1>
          <p className="update-subtitle">Add new information to the patient's medical history.</p>
        </div>

        <div className="update-form-card">
          <div className="patient-info-header">
            <div className="patient-avatar">
              <svg width="100" height="100" viewBox="0 0 100 100" fill="none">
                <circle cx="50" cy="50" r="50" fill="#D9D9D9"/>
              </svg>
            </div>
            <div className="patient-details">
              <h2 className="patient-name">Dhruv Saxena</h2>
              <p className="patient-id">Patient ID: DS-548785</p>
            </div>
          </div>

          <div className="form-section">
            <label className="form-label">Diagnosis</label>
            <input
              type="text"
              className="form-input"
              placeholder="eg. Treatment Related"
              value={formData.diagnosis}
              onChange={(e) => handleInputChange('diagnosis', e.target.value)}
            />
          </div>

          <div className="form-section">
            <label className="form-label">Treatment Notes</label>
            <textarea
              className="form-textarea"
              placeholder="Describe the treatment plan and observations..."
              value={formData.treatmentNotes}
              onChange={(e) => handleInputChange('treatmentNotes', e.target.value)}
            />
          </div>

          <div className="form-section">
            <label className="form-label">Prescriptions</label>
            <textarea
              className="form-textarea prescription-textarea"
              placeholder="List medications, dosage, and frequency..."
              value={formData.prescriptions}
              onChange={(e) => handleInputChange('prescriptions', e.target.value)}
            />
          </div>

          <div className="form-divider"></div>

          <div className="approval-section">
            <div className="approval-info">
              <div className="approval-icon">
                <svg width="30" height="30" viewBox="0 0 30 30" fill="none">
                  <path d="M15 2.5C8.125 2.5 2.5 8.125 2.5 15C2.5 21.875 8.125 27.5 15 27.5C21.875 27.5 27.5 21.875 27.5 15C27.5 8.125 21.875 2.5 15 2.5ZM12.5 21.25L6.25 15L8.0125 13.2375L12.5 17.7125L21.9875 8.225L23.75 10L12.5 21.25Z" fill="#4CAF50"/>
                </svg>
              </div>
              <div className="approval-content">
                <h3 className="approval-title">Request Patient Approval</h3>
                <p className="approval-description">The patient will be notified to review and approve this update.</p>
              </div>
            </div>
            <button className="submit-button" onClick={handleSubmit}>
              Submit for approval
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UpdatePatientRecord;
