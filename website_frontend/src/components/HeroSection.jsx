import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/HeroSection.css';
import { GlobalContext } from '../context/GlobalContextInstance';
import illustration from '../assets/illustration.png';


const HeroSection = () => {
  const { registrationStatus } = useContext(GlobalContext);
  const navigate = useNavigate();

  const handleDoctorRegistration = () => {
    navigate('/doctor-verification');
  };

  const handlePatientRegistration = () => {
    navigate('/patient-verification');
  };

  return (
    <section className="hero-section">
      <div className="hero-content">
        <h1>
          The Future of Healthcare is{' '}
          <span className="secure">Secure</span> and{' '}
          <span className="transparent">Transparent</span>
        </h1>
        <p>
          VeriMed leverages cutting-edge blockchain technology to put you in control
          of your medical records, verify healthcare professionals.
        </p>
        {registrationStatus === 'not registered' && (
          <div className="hero-buttons">
            <button className="get-started-btn" onClick={handleDoctorRegistration}>Register as Doctor</button>
            <button className="get-started-btn" onClick={handlePatientRegistration}>Register as Patient</button>
          </div>
        )}
      </div>
      <div className="hero-image">
        <img 
          src={illustration} 
          alt="Healthcare Illustration" 
        />
      </div>
    </section>
  );
};

export default HeroSection;
