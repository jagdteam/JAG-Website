import AboutSection from '@/components/AboutSection';
import AccountabilitySection from '@/components/AccountabilitySection';
import ContactSection from '@/components/ContactSection';
import Footer from '@/components/Footer';
import HeroSection from '@/components/HeroSection';
import Navigation from '@/components/Navigation';
import PageTransition from '@/components/PageTransition';
import ProductSection from '@/components/ProductSection';
import TeamSection from '@/components/TeamSection';
import ParallaxBackground from '@/components/shaders/ParallaxBackground';

const Index = () => {
  return (
    <PageTransition>
      <ParallaxBackground />
      <div className="min-h-screen relative z-0">
        <Navigation />
        <HeroSection />
        <ProductSection />
        <AccountabilitySection />
        <TeamSection />
        <AboutSection />
        <ContactSection />
        <Footer />
      </div>
    </PageTransition>
  );
};

export default Index;
