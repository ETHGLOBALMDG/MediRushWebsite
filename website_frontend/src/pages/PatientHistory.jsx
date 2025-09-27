import React from 'react';
import Navbar from '../components/Navbar';
import '../styles/PatientHistory.css';

const PatientHistory = () => {
  const patientData = {
    name: 'Dhruv Saxena',
    id: '123456',
    age: '25',
    gender: 'Male',
    bloodType: 'O+',
    allergies: 'None'
  };

  const allergies = [
    {
      name: 'Penicillin',
      verifiedBy: 'Dr. Emily Carter',
      date: 'Jan 10, 2022'
    },
    {
      name: 'Latex',
      verifiedBy: 'Dr. Emily Carter', 
      date: 'Mar 05, 2021'
    }
  ];

  const chronicConditions = [
    {
      name: 'Asthma',
      verifiedBy: 'Dr. Emily Carter',
      date: 'Ongoing since 2015'
    }
  ];

  const pastProcedures = [
    {
      name: 'Tonsillectomy',
      verifiedBy: 'Dr. Sarah Jenkins',
      date: 'Jul 22, 2019'
    },
    {
      name: 'Appendectomy',
      verifiedBy: 'Dr. Johnathan Miles',
      date: 'May 14, 2008'
    }
  ];

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

  return (
    <div className="patient-history-page">
      <Navbar />
      
      <div className="patient-history-container">
        <div className="patient-history-header">
          <h1 className="patient-history-title">Patient: {patientData.name}</h1>
          <button className="join-dao-btn">Join VeriMed DAO</button>
        </div>

        <div className="patient-history-content">
          <div className="main-content">
            <div className="medical-history-section">
              <h2 className="medical-history-title">Medical History</h2>
              <p className="medical-history-description">
                A comprehensive and verified record of your health journey.
              </p>

              <div className="medical-history-cards">
                <div className="medical-card allergies-card">
                  <div className="card-header">
                    <svg className="card-icon" width="30" height="30" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M13.75 7.5C13.75 6.8125 14.3125 6.25 15 6.25C15.6875 6.25 16.25 6.8125 16.25 7.5C16.25 8.1875 15.6875 8.75 15 8.75C14.3125 8.75 13.75 8.1875 13.75 7.5ZM10 11.25C10.6875 11.25 11.25 10.6875 11.25 10C11.25 9.3125 10.6875 8.75 10 8.75C9.3125 8.75 8.75 9.3125 8.75 10C8.75 10.6875 9.3125 11.25 10 11.25ZM7.5 6.25C7.5 5.5625 6.9375 5 6.25 5C5.5625 5 5 5.5625 5 6.25C5 6.9375 5.5625 7.5 6.25 7.5C6.9375 7.5 7.5 6.9375 7.5 6.25ZM11.25 5C11.9375 5 12.5 4.4375 12.5 3.75C12.5 3.0625 11.9375 2.5 11.25 2.5C10.5625 2.5 10 3.0625 10 3.75C10 4.4375 10.5625 5 11.25 5ZM18.75 5C19.4375 5 20 4.4375 20 3.75C20 3.0625 19.4375 2.5 18.75 2.5C18.0625 2.5 17.5 3.0625 17.5 3.75C17.5 4.4375 18.0625 5 18.75 5ZM23.75 5C23.0625 5 22.5 5.5625 22.5 6.25C22.5 6.9375 23.0625 7.5 23.75 7.5C24.4375 7.5 25 6.9375 25 6.25C25 5.5625 24.4375 5 23.75 5ZM18.75 10C18.75 10.6875 19.3125 11.25 20 11.25C20.6875 11.25 21.25 10.6875 21.25 10C21.25 9.3125 20.6875 8.75 20 8.75C19.3125 8.75 18.75 9.3125 18.75 10ZM23.125 16.3375C23.125 17.225 22.8 18.075 22.2625 18.75C22.7875 19.425 23.125 20.275 23.125 21.1625C23.125 23.325 21.3375 25.0875 19.175 25.0875L18.6375 25.05C18.05 26.4875 16.6375 27.5 15 27.5C13.3625 27.5 11.95 26.4875 11.3625 25.05L10.825 25.0875C8.65 25.0875 6.875 23.325 6.875 21.1625C6.875 20.275 7.2 19.425 7.7375 18.75C7.2125 18.075 6.875 17.225 6.875 16.3375C6.875 14.175 8.6625 12.4125 10.825 12.4125L11.3625 12.45C11.95 11.0125 13.3625 10 15 10C16.6375 10 18.05 11.0125 18.6375 12.45L19.175 12.4125C21.3375 12.4125 23.125 14.175 23.125 16.3375ZM9.375 16.3375C9.375 16.875 9.7125 17.375 10.2125 17.625L11.3125 18.125C11.4625 17.225 11.95 16.425 12.6375 15.8625L11.625 15.1625C11.4 15 11.125 14.9125 10.825 14.9125C10.0375 14.9125 9.375 15.55 9.375 16.3375ZM12.65 21.6375C11.95 21.075 11.4625 20.275 11.3125 19.375L10.2125 19.875C9.7125 20.125 9.375 20.625 9.375 21.15C9.375 21.9375 10.0375 22.575 10.825 22.575C11.1125 22.575 11.3875 22.5 11.6375 22.325L12.65 21.6375ZM16.425 23.625L16.2875 22.2625C15.8875 22.4125 15.45 22.5 15 22.5C14.55 22.5 14.125 22.4125 13.75 22.2625L13.575 23.625C13.6 24.375 14.225 25 15 25C15.775 25 16.4 24.375 16.425 23.625ZM16.425 13.875C16.4 13.125 15.775 12.5 15 12.5C14.225 12.5 13.6 13.125 13.575 13.875L13.75 15.2375C14.125 15.0875 14.55 15 15 15C15.45 15 15.8875 15.0875 16.2875 15.2375L16.425 13.875ZM20.625 21.15C20.625 20.625 20.2875 20.1 19.7875 19.8625L18.6875 19.3375C18.5375 20.2625 18.05 21.0625 17.3625 21.625L18.375 22.3375C18.6 22.5 18.875 22.5875 19.175 22.5875C19.9625 22.5875 20.625 21.95 20.625 21.15ZM20.625 16.3375C20.625 15.55 19.9625 14.9125 19.175 14.9125C18.8875 14.9125 18.6125 15 18.3625 15.1625L17.3375 15.8625C18.0375 16.425 18.525 17.225 18.675 18.125L19.775 17.625C20.2875 17.375 20.625 16.875 20.625 16.3375Z" fill="#007C05"/>
                    </svg>
                    <h3 className="card-title">Allergies</h3>
                  </div>
                  <div className="card-content">
                    {allergies.map((allergy, index) => (
                      <div key={index} className="medical-record-item">
                        <div className="record-divider"></div>
                        <div className="record-details">
                          <h4 className="record-name">{allergy.name}</h4>
                          <p className="record-verified">Verified by {allergy.verifiedBy}</p>
                        </div>
                        <span className="record-date">{allergy.date}</span>
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
              <h3 className="profile-name">{patientData.name}</h3>
              <p className="profile-id">Patient ID: {patientData.id}</p>
            </div>

            <div className="sidebar-card patient-details-card">
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

            <div className="sidebar-card recent-appointments-card">
              <h3 className="appointments-title">Recent Appointments</h3>
              <div className="appointments-list">
                {appointments.map((appointment, index) => (
                  <div key={index} className="appointment-item">
                    <div className="appointment-icon">
                      <svg width="50" height="50" viewBox="0 0 50 50" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <circle cx="25" cy="25" r="25" fill="#BBF7D0"/>
                      </svg>
                      <svg className="calendar-icon" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
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

export default PatientHistory;
