import React from 'react';
import '../styles/StepsSection.css';

const steps = [
  {
    number: 1,
    title: 'Create Your Identity',
    desc: 'Securely set up your decentralized health profile by connecting your crypto wallet.'
  },
  {
    number: 2,
    title: 'Own Your Data',
    desc: 'Upload medical records to your secure vault. You control who sees your data, and when.'
  },
  {
    number: 3,
    title: 'Connect with Trust',
    desc: 'Engage with a network of verified doctors and trace your prescriptions with full transparency.'
  }
];

const StepsSection = () => (
  <section className="steps-section">
    <div className="steps-header">
      <h2>Simple Steps to a Secure Health Future</h2>
      <p>Your journey to decentralized healthcare, simplified.</p>
    </div>
    
    <div className="steps-numbers">
      {steps.map((step) => (
        <div className="step-number" key={step.number}>
          {step.number}
        </div>
      ))}
    </div>
    
    <div className="steps-cards">
      {steps.map((step) => (
        <div className="step-card" key={step.number}>
          <h3>{step.title}</h3>
          <p>{step.desc}</p>
        </div>
      ))}
    </div>
  </section>
);

export default StepsSection;
