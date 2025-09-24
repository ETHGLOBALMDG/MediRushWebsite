import Navbar from '../components/Navbar';
import HeroSection from '../components/HeroSection';
import BenefitsSection from '../components/BenefitsSection';
import StepsSection from '../components/StepsSection';
import '../styles/App.css';

const HomePage = () => (
  <div className="main-bg">
    <Navbar />
    <HeroSection />
    <BenefitsSection />
    <StepsSection />
  </div>
);

export default HomePage;
