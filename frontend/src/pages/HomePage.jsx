import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import HeroSection from '../components/sections/HeroSection';
import FeaturedProperties from '../components/sections/FeaturedProperties';
import HorizontalType from '../components/sections/HorizontalType';
import FeaturedDevelopment from '../components/sections/FeaturedDevelopment';
import LocationsSection from '../components/sections/LocationsSection';
import CategoriesSection from '../components/sections/CategoriesSection';
import JournalSection from '../components/sections/JournalSection';
import AboutSection from '../components/sections/AboutSection';
import TestimonialsSection from '../components/sections/TestimonialsSection';
import ContactSection from '../components/sections/ContactSection';

export default function HomePage() {
  return (
    <>
      <a className="skip-link" href="#hero">Skip to content</a>
      <Navbar />
      <main>
        <HeroSection />
        <FeaturedProperties />
        <HorizontalType />
        <FeaturedDevelopment />
        <LocationsSection />
        <CategoriesSection />
        <JournalSection />
        <AboutSection />
        <TestimonialsSection />
        <ContactSection />
      </main>
      <Footer />
    </>
  );
}
