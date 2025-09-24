import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import DoctorModal from '../components/DoctorModal';
import '../styles/dashboard.css';

const Dashboard = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('speciality');
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const doctors = [
    {
      id: 1,
      name: 'Dr. Deenank Sharma',
      speciality: 'Neurology Practitioner',
      rating: 800,
      reviews: 95,
      avatar: '#DCFCE7'
    },
    {
      id: 2,
      name: 'Dr. Deenank Sharma',
      speciality: 'Neurology Practitioner',
      rating: 800,
      reviews: 95,
      avatar: '#DCFCE7'
    },
    {
      id: 3,
      name: 'Dr. Deenank Sharma',
      speciality: 'Neurology Practitioner',
      rating: 800,
      reviews: 95,
      avatar: '#DCFCE7'
    },
    {
      id: 4,
      name: 'Dr. Deenank Sharma',
      speciality: 'Neurology Practitioner',
      rating: 800,
      reviews: 95,
      avatar: '#DCFCE7'
    }
  ];

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleFilterClick = (filter) => {
    setActiveFilter(filter);
  };

  const handleDoctorClick = (doctor) => {
    setSelectedDoctor(doctor);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedDoctor(null);
  };

  return (
    <div className="dashboard-page">
      <Navbar />
      <div className="dashboard-container">
        <div className="dashboard-hero">
          <h1 className="dashboard-title">Find Your Verified Doctor</h1>
          <p className="dashboard-subtitle">
            Access a decentralized network of trusted healthcare professionals. Search with confidence.
          </p>
        </div>

        <div className="search-section">
          <div className="search-bar">
            <svg className="search-icon" width="30" height="30" viewBox="0 0 30 30" fill="none">
              <path d="M24.5 26.25L16.625 18.375C16 18.875 15.2813 19.2708 14.4688 19.5625C13.6563 19.8542 12.7917 20 11.875 20C9.60417 20 7.6825 19.2133 6.11 17.64C4.5375 16.0667 3.75083 14.145 3.75 11.875C3.74917 9.605 4.53583 7.68333 6.11 6.11C7.68417 4.53667 9.60583 3.75 11.875 3.75C14.1442 3.75 16.0663 4.53667 17.6413 6.11C19.2163 7.68333 20.0025 9.605 20 11.875C20 12.7917 19.8542 13.6562 19.5625 14.4688C19.2708 15.2812 18.875 16 18.375 16.625L26.25 24.5L24.5 26.25ZM11.875 17.5C13.4375 17.5 14.7658 16.9533 15.86 15.86C16.9542 14.7667 17.5008 13.4383 17.5 11.875C17.4992 10.3117 16.9525 8.98375 15.86 7.89125C14.7675 6.79875 13.4392 6.25167 11.875 6.25C10.3108 6.24833 8.98292 6.79542 7.89125 7.89125C6.79958 8.98708 6.2525 10.315 6.25 11.875C6.2475 13.435 6.79458 14.7633 7.89125 15.86C8.98792 16.9567 10.3158 17.5033 11.875 17.5Z" fill="black" fillOpacity="0.5"/>
            </svg>
            <input
              type="text"
              placeholder="Search by name, speciality, or condition..."
              value={searchQuery}
              onChange={handleSearchChange}
              className="search-input"
            />
          </div>

          <div className="filter-buttons">
            <button 
              className={`filter-btn ${activeFilter === 'speciality' ? 'active' : ''}`}
              onClick={() => handleFilterClick('speciality')}
            >
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <g clipPath="url(#clip0_107_824)">
                  <path d="M5.1251 10C5.3751 10.75 5.50011 11.375 5.50011 11.375C6.50011 13 7.7501 12.75 7.7501 13.625C7.7501 14 7.5001 14.375 7.1251 14.5L10.0001 16.75L12.8751 14.625C12.5001 14.375 12.2501 14.125 12.2501 13.75C12.2501 12.75 13.5001 13.125 14.5001 11.5C14.5001 11.5 14.7501 11 14.8751 10.125C15.2501 8.75 15.6251 6.25 15.5001 5H13.6251C13.6251 4.625 13.7501 4.25 13.7501 3.75H15.1251C14.7501 2 13.8751 1.25 12.3751 0.875C11.7501 0.375 10.8751 0 10.0001 0C9.1251 0 8.2501 0.375 7.6251 0.875C6.1251 1.25 5.37511 2 4.87511 3.75H6.25011C6.25011 4.25 6.3751 4.625 6.5001 5H4.5001C4.3751 6.25 4.7501 8.75 5.1251 10ZM14.0001 10.625L13.6251 11L13.0001 11.75C12.5001 12.375 12.0001 12.75 11.2501 12.875L10.7501 13C10.2501 13.125 9.6251 13.125 9.0001 13L8.50011 12.875C7.75011 12.625 7.12511 12.25 6.62511 11.5L6.37511 11L6.00011 10.625L5.1251 10L9.0001 8.875C9.6251 8.75 10.2501 8.625 10.8751 8.875L14.8751 10L14.0001 10.625ZM7.5001 3.75C7.5001 2.375 8.6251 1.25 10.0001 1.25C11.3751 1.25 12.5001 2.375 12.5001 3.75C12.5001 5.125 11.3751 6.25 10.0001 6.25C8.6251 6.25 7.5001 5.125 7.5001 3.75Z" fill="black"/>
                  <path d="M19.375 17.75C17.75 14.75 16.125 15.25 14.5 15H14.375L10 18.25L5.625 15H5.5C3.75 15.125 2.25 14.75 0.625 17.75C0.375 18.25 0.125 19.125 0 20H20C19.875 19.125 19.625 18.25 19.375 17.75Z" fill="black"/>
                </g>
                <defs>
                  <clipPath id="clip0_107_824">
                    <rect width="20" height="20" fill="white"/>
                  </clipPath>
                </defs>
              </svg>
              Speciality
            </button>
            
            <button 
              className={`filter-btn ${activeFilter === 'location' ? 'active' : ''}`}
              onClick={() => handleFilterClick('location')}
            >
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M10.0003 9.58335C9.44779 9.58335 8.91789 9.36386 8.52719 8.97316C8.13649 8.58246 7.91699 8.05255 7.91699 7.50002C7.91699 6.94749 8.13649 6.41758 8.52719 6.02688C8.91789 5.63618 9.44779 5.41669 10.0003 5.41669C10.5529 5.41669 11.0828 5.63618 11.4735 6.02688C11.8642 6.41758 12.0837 6.94749 12.0837 7.50002C12.0837 7.77361 12.0298 8.04452 11.9251 8.29728C11.8204 8.55004 11.6669 8.7797 11.4735 8.97316C11.28 9.16661 11.0503 9.32007 10.7976 9.42477C10.5448 9.52947 10.2739 9.58335 10.0003 9.58335ZM10.0003 1.66669C8.45323 1.66669 6.9695 2.28127 5.87554 3.37523C4.78157 4.46919 4.16699 5.95292 4.16699 7.50002C4.16699 11.875 10.0003 18.3334 10.0003 18.3334C10.0003 18.3334 15.8337 11.875 15.8337 7.50002C15.8337 5.95292 15.2191 4.46919 14.1251 3.37523C13.0312 2.28127 11.5474 1.66669 10.0003 1.66669Z" fill="black" fillOpacity="0.6"/>
              </svg>
              Location
            </button>
            
            <button 
              className={`filter-btn ${activeFilter === 'availability' ? 'active' : ''}`}
              onClick={() => handleFilterClick('availability')}
            >
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M9.125 15.2917L6.16667 12.3334L7.375 11.125L9.125 12.875L12.625 9.37502L13.8333 10.5834L9.125 15.2917ZM4.16667 18.3334C3.70833 18.3334 3.31611 18.1703 2.99 17.8442C2.66389 17.5181 2.50056 17.1256 2.5 16.6667V5.00002C2.5 4.54169 2.66333 4.14946 2.99 3.82335C3.31667 3.49724 3.70889 3.33391 4.16667 3.33335H5V1.66669H6.66667V3.33335H13.3333V1.66669H15V3.33335H15.8333C16.2917 3.33335 16.6842 3.49669 17.0108 3.82335C17.3375 4.15002 17.5006 4.54224 17.5 5.00002V16.6667C17.5 17.125 17.3369 17.5175 17.0108 17.8442C16.6847 18.1709 16.2922 18.3339 15.8333 18.3334H4.16667ZM4.16667 16.6667H15.8333V8.33335H4.16667V16.6667Z" fill="black" fillOpacity="0.6"/>
              </svg>
              Availability
            </button>
          </div>
        </div>

        <div className="doctors-section">
          <h2 className="section-title">Top Rated Specialists</h2>
          <div className="doctors-grid">
            {doctors.map((doctor) => (
              <div key={doctor.id} className="doctor-card" onClick={() => handleDoctorClick(doctor)}>
                <div className="doctor-avatar">
                  <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                    <path d="M15.9996 5.48572C17.3939 5.48572 18.7311 6.03959 19.717 7.0255C20.7029 8.0114 21.2568 9.34858 21.2568 10.7429C21.2568 12.1371 20.7029 13.4743 19.717 14.4602C18.7311 15.4461 17.3939 16 15.9996 16C14.6054 16 13.2682 15.4461 12.2823 14.4602C11.2964 13.4743 10.7425 12.1371 10.7425 10.7429C10.7425 9.34858 11.2964 8.0114 12.2823 7.0255C13.2682 6.03959 14.6054 5.48572 15.9996 5.48572ZM15.9996 18.6286C21.8088 18.6286 26.5139 20.9811 26.5139 23.8857V26.5143H5.48535V23.8857C5.48535 20.9811 10.1905 18.6286 15.9996 18.6286Z" fill="black"/>
                  </svg>
                </div>
                <div className="doctor-info">
                  <h3 className="doctor-name">{doctor.name}</h3>
                  <p className="doctor-speciality">{doctor.speciality}</p>
                  <div className="doctor-rating">
                    <div className="rating-badge">
                      <span className="rating-number">{doctor.rating}</span>
                    </div>
                    <svg className="star-icon" width="12" height="11" viewBox="0 0 12 11" fill="none">
                      <path d="M4.11 8.5829L6 7.48289L7.89 8.59737L7.395 6.51316L9.06 5.12368L6.87 4.93553L6 2.96711L5.13 4.92105L2.94 5.10921L4.605 6.51316L4.11 8.5829ZM2.295 11L3.27 6.93289L0 4.19737L4.32 3.83553L6 0L7.68 3.83553L12 4.19737L8.73 6.93289L9.705 11L6 8.84342L2.295 11Z" fill="#4CAF50"/>
                    </svg>
                    <span className="reviews-count">{doctor.reviews} reviews</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <DoctorModal
        doctor={selectedDoctor}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />
    </div>
  );
};

export default Dashboard;
