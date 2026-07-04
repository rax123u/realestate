import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import HeroSection from '../components/sections/HeroSection';
import HorizontalShowcase from '../components/sections/HorizontalShowcase';
import FeaturedProperties from '../components/sections/FeaturedProperties';
import StorytellingSection from '../components/sections/StorytellingSection';
import PropertyDetailsPreview from '../components/sections/PropertyDetailsPreview';
import TestimonialsSection from '../components/sections/TestimonialsSection';
import ContactSection from '../components/sections/ContactSection';

export default function HomePage() {
  return (
    <>
      <Navbar />
      <main className="w-full flex flex-col items-stretch">
        <div className="snap-slide">
          <HeroSection />
        </div>
        <div className="snap-slide">
          <HorizontalShowcase />
        </div>
        <div className="snap-slide">
          <FeaturedProperties />
        </div>
        <div className="snap-slide">
          <StorytellingSection />
        </div>
        <div className="snap-slide">
          <PropertyDetailsPreview />
        </div>
        <div className="snap-slide">
          <TestimonialsSection />
        </div>
        <div className="snap-slide flex flex-col justify-between">
          <ContactSection />
          <Footer />
        </div>
      </main>
    </>
  );
}
