import HeroSection from "../Component/sections/home/HeroSection";
import ServicesRibbon from "../Component/sections/services/ServicesRibbon";
import WhyChooseUs from "../Component/sections/home/WhyChooseUs";
// import Services from "../Component/sections/services/Services";
import Pricing from "../Component/sections/home/Pricing";
import TestimonialsSection from "../Component/sections/home/TestimonialsSection";
import OurExperts from "../Component/sections/home/OurExperts";
import CallToAction from "../Component/sections/home/CallToAction";
import HomePortfolioSection from "../Component/sections/Portfolio/HomePortfolioSection";
import ServicesLocation from "../Component/sections/services/ServicesLocation";


function HomePage() {
  return (
    <div className="pt-10">
      <HeroSection className="mt-[40px]" />
      <ServicesRibbon />
      {/* <ServicesLocation /> */}
      <WhyChooseUs />
      <HomePortfolioSection />
      <Pricing />
      <TestimonialsSection />
      <OurExperts />
      <CallToAction />
    </div>
  );
}

export default HomePage;
