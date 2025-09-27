import React from 'react';
import '../styles/BenefitsSection.css';

const ShieldIcon = () => (
  <svg width="30" height="30" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M14.0006 0.2494C14.6507 0.0415412 15.3493 0.0415412 15.9994 0.2494L25.8431 3.3994C26.5057 3.61126 27.0838 4.02819 27.4939 4.59C27.9041 5.15181 28.1251 5.82943 28.125 6.52502V13.125C28.125 16.0613 27.525 19.0913 25.6819 21.9038C23.8387 24.7125 20.835 27.1782 16.2469 29.1319C15.8525 29.2995 15.4285 29.3859 15 29.3859C14.5715 29.3859 14.1475 29.2995 13.7531 29.1319C9.165 27.1782 6.16125 24.7125 4.31813 21.9038C2.475 19.0913 1.875 16.0613 1.875 13.125V6.52502C1.87494 5.82943 2.09594 5.15181 2.5061 4.59C2.91625 4.02819 3.49433 3.61126 4.15688 3.3994L14.0006 0.2494ZM15.1444 2.92877C15.0511 2.89879 14.9508 2.89879 14.8575 2.92877L5.01375 6.07877C4.91909 6.10898 4.83648 6.16848 4.77784 6.24869C4.7192 6.3289 4.68757 6.42567 4.6875 6.52502V13.125C4.6875 15.6713 5.20312 18.1238 6.66937 20.3625C8.13937 22.6013 10.6462 24.75 14.8556 26.5444C14.9014 26.5635 14.9504 26.5733 15 26.5733C15.0496 26.5733 15.0986 26.5635 15.1444 26.5444C19.3537 24.7519 21.8606 22.5994 23.3306 20.3607C24.7969 18.1238 25.3125 15.675 25.3125 13.125V6.52502C25.312 6.42599 25.2802 6.32964 25.2216 6.24981C25.163 6.16997 25.0806 6.11076 24.9862 6.08065L15.1444 2.92877ZM16.4062 8.90627V14.5313C16.4062 14.9042 16.2581 15.2619 15.9944 15.5256C15.7306 15.7894 15.373 15.9375 15 15.9375C14.627 15.9375 14.2694 15.7894 14.0056 15.5256C13.7419 15.2619 13.5938 14.9042 13.5938 14.5313V8.90627C13.5938 8.53331 13.7419 8.17563 14.0056 7.91191C14.2694 7.64818 14.627 7.50002 15 7.50002C15.373 7.50002 15.7306 7.64818 15.9944 7.91191C16.2581 8.17563 16.4062 8.53331 16.4062 8.90627ZM16.875 19.6875C16.875 20.1848 16.6775 20.6617 16.3258 21.0133C15.9742 21.365 15.4973 21.5625 15 21.5625C14.5027 21.5625 14.0258 21.365 13.6742 21.0133C13.3225 20.6617 13.125 20.1848 13.125 19.6875C13.125 19.1902 13.3225 18.7133 13.6742 18.3617C14.0258 18.0101 14.5027 17.8125 15 17.8125C15.4973 17.8125 15.9742 18.0101 16.3258 18.3617C16.6775 18.7133 16.875 19.1902 16.875 19.6875Z" fill="#4CAF50"/>
  </svg>
);

const benefits = [
  {
    title: 'Secure Patient Records',
    desc: 'Your health data is encrypted and stored on the blockchain. You own your data and grant access to providers on your terms, ensuring unparalleled privacy and security.'
  },
  {
    title: 'Secure Patient Records',
    desc: 'Your health data is encrypted and stored on the blockchain. You own your data and grant access to providers on your terms, ensuring unparalleled privacy and security.'
  },
  {
    title: 'Secure Patient Records',
    desc: 'Your health data is encrypted and stored on the blockchain. You own your data and grant access to providers on your terms, ensuring unparalleled privacy and security.'
  }
];

const BenefitsSection = () => (
  <section className="benefits-section">
    <h2>Revolutionizing Healthcare with Trust</h2>
    <p>Discover the core benefits of the VeriMed ecosystem</p>
    <div className="benefits-cards">
      {benefits.map((benefit, index) => (
        <div className="benefit-card" key={index}>
          <div className="benefit-icon">
            <div className="icon-circle">
              <ShieldIcon />
            </div>
          </div>
          <h3>{benefit.title}</h3>
          <p>{benefit.desc}</p>
        </div>
      ))}
    </div>
  </section>
);

export default BenefitsSection;
