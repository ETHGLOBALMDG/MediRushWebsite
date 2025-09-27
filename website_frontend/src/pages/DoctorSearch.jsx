import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import '../styles/DoctorSearch.css';
import axios from 'axios';
// import { config } from '../config/wagmiConfig';

import LoadingPage from './loadingpage_1.jsx';
import { getSearchDoctor } from '../api/getSearchDoctor.js';

const DoctorSearch = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [doctors,setDoctors] = useState(null);
  // const [activeFilter, setActiveFilter] = useState('speciality');
  // const [selectedDoctor, setSelectedDoctor] = useState(null);
  // const [isModalOpen, setIsModalOpen] = useState(false);

 

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const searchDoctors = async (query) => {    
    // const response = await axios.get('http://localhost:5000/api/searchDoctor', {params: {query: query}});
    // setDoctors(response.data)
    const mockDoctors = [
      {
        id: 1,
        name: "Dr. Alice Smith",
        speciality: "Cardiology",
        reputation: 4.8,
      },
      {
        id: 2,
        name: "Dr. Bob Johnson",
        speciality: "Dermatology",
        reputation: 4.5,
      },
      {
        id: 3,
        name: "Dr. Carol Lee",
        speciality: "Neurology",
        reputation: 4.9,
      },
    ];
    setDoctors({ data: mockDoctors });
  }


  // const handleDoctorClick = (doctor) => {
  //   setSelectedDoctor(doctor);
  //   setIsModalOpen(true);
  // };

  // const handleCloseModal = () => {
  //   setIsModalOpen(false);
  //   setSelectedDoctor(null);
  // };


  const handleSearch = async () => {
    setLoading(true);
    try {
      const data = await getSearchDoctor(searchQuery);
      const doctorsArray = data.doctors || data.results || [];
      setDoctors(Array.isArray(doctorsArray) ? doctorsArray : []);
    } catch (err) {
      setDoctors([]);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <LoadingPage tagline="Getting it ready..." />;
  }

  return (
    <div className="doctor-search-page">
      <Navbar />
      <div className="doctor-search-container">
        <div className="doctor-search-hero">
          <h1 className="doctor-search-title">Find Your Verified Doctor</h1>
          <p className="doctor-search-subtitle">
            Access a decentralized network of trusted healthcare professionals. Search with confidence.
          </p>
        </div>

        <div className="search-section" style={{display:'flex', flexDirection:'row', justifyContent:'center'}}>
          <div className="search-bar">
            <svg className="search-icon" width="30" height="30" viewBox="0 0 30 30" fill="none">
              <path d="M24.5 26.25L16.625 18.375C16 18.875 15.2813 19.2708 14.4688 19.5625C13.6563 19.8542 12.7917 20 11.875 20C9.60417 20 7.6825 19.2133 6.11 17.64C4.5375 16.0667 3.75083 14.145 3.75 11.875C3.74917 9.605 4.53583 7.68333 6.11 6.11C7.68417 4.53667 9.60583 3.75 11.875 3.75C14.1442 3.75 16.0663 4.53667 17.6413 6.11C19.2163 7.68333 20.0025 9.605 20 11.875C20 12.7917 19.8542 13.6562 19.5625 14.4688C19.2708 15.2812 18.875 16 18.375 16.625L26.25 24.5L24.5 26.25ZM11.875 17.5C13.4375 17.5 14.7658 16.9533 15.86 15.86C16.9542 14.7667 17.5008 13.4383 17.5 11.875C17.4992 10.3117 16.9525 8.98375 15.86 7.89125C14.7675 6.79875 13.4392 6.25167 11.875 6.25C10.3108 6.24833 8.98292 6.79542 7.89125 7.89125C6.79958 8.98708 6.2525 10.315 6.25 11.875C6.2475 13.435 6.79458 14.7633 7.89125 15.86C8.98792 16.9567 10.3158 17.5033 11.875 17.5Z" fill="black" fillOpacity="0.5"/>
            </svg>
            <input
              type="text"
              placeholder="Specify your conditions ..." 
              value={searchQuery}
              onChange={handleSearchChange}
              className="search-input"
            />
          </div>
          <button
            style={{marginLeft:'10px',paddingTop:'41px',paddingBottom:'41px',fontSize:'250%'}}
            onClick={() => searchDoctors(searchQuery)}
            className="get-started-btn"
          >
            Search
          </button>
        </div>

        {doctors && (
          <div className="doctors-section">
            <h2 className="section-title">Search Results</h2>
            <div className="doctors-grid">
              {doctors.data.map((doctor) => (
                <div>
                <div key={doctor.id} className="doctor-card">
                  <div className="doctor-avatar">
                    <svg width="32" height="32" viewBox="0 0 32 32" fill="none"></svg>
                      <path d="M15.9996 5.48572C17.3939 5.48572 18.7311 6.03959 19.717 7.0255C20.7029 8.0114 21.2568 9.34858 21.2568 10.7429C21.2568 12.1371 20.7029 13.4743 19.717 14.4602C18.7311 15.4461 17.3939 16 15.9996 16C14.6054 16 13.2682 15.4461 12.2823 14.4602C11.2964 13.4743 10.7425 12.1371 10.7425 10.7429C10.7425 9.34858 11.2964 8.0114 12.2823 7.0255C13.2682 6.03959 14.6054 5.48572 15.9996 5.48572ZM15.9996 18.6286C21.8088 18.6286 26.5139 20.9811 26.5139 23.8857V26.5143H5.48535V23.8857C5.48535 20.9811 10.1905 18.6286 15.9996 18.6286Z" fill="black"/>
                    {/* </svg> */}
                  </div>
                  <div className="doctor-info">
                    <h3 className="doctor-name">{doctor.name}</h3>
                    <p className="doctor-speciality">Speciality: {doctor.speciality}</p>
                    <p className="doctor-reputation">Reputation: {doctor.reputation}</p>
                  </div>
                </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DoctorSearch;
