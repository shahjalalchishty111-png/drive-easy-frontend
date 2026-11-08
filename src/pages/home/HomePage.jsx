import HeroSection from './HeroSection';
import FeaturedCars from './FeaturedCars';
import HowItWorks from './HowItWorks';
import Perks from './Perks';
import Testimonials from './Testimonials';
import CtaSection from './CtaSection';

export default function HomePage() {
  return (
    <div className="overflow-hidden">
      <HeroSection />
      <FeaturedCars />
      <HowItWorks />
      <Perks />
      <Testimonials />
      <CtaSection />
    </div>
  );
}
