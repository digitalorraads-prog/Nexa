import HeroSection from "../Component/Sections/Home/HeroSection";
import ServicesRibbon from "../Component/Sections/Services/ServicesRibbon";
import WhyChooseUs from "../Component/Sections/Home/WhyChooseUs";
// import Services from "../Component/Sections/Services/Services";
import Pricing from "../Component/Sections/Home/Pricing";
import TestimonialsSection from "../Component/Sections/Home/TestimonialsSection";
import OurExperts from "../Component/Sections/Home/OurExperts";
import CallToAction from "../Component/Sections/Home/CallToAction";
import HomePortfolioSection from "../Component/sections/Portfolio/HomePortfolioSection";
import ServicesLocation from "../Component/sections/services/ServicesLocation";


function HomePage() {
  return (
    <div className="pt-10">
      <HeroSection />
      <ServicesRibbon />
      <ServicesLocation/>
      <WhyChooseUs />
      <HomePortfolioSection/>
      <Pricing />
      <TestimonialsSection />
      <OurExperts />
      <CallToAction />
    </div>
  );
}

export default HomePage;
