import Navbar from '../components/Navbar';
import HeroSection from '../components/HeroSection';
import BenefitsSection from '../components/BenefitsSection';
import StepsSection from '../components/StepsSection';
import GlobalStatusBar from '../components/GlobalStatusBar';
import '../styles/App.css';
import { useState, useEffect } from 'react';
import LoadingPage_1 from './loadingpage_1';

const HomePage = () =>{ 
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 5000); // 5 seconds
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return <LoadingPage_1 tagline = "Your Health, Secured." />;
  }
  return <div className="homepage">
    <div className="homepage-header">
      <Navbar />
      <HeroSection />
    </div>
    {/* <GlobalStatusBar /> */}
    <BenefitsSection />
    <StepsSection />
  </div>
};

export default HomePage;
