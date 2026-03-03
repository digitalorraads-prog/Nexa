// Done
import { useParams, Link } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import axios from "../Protected/axiosPublic"; // ✅ Correct - using custom axios instance
import HeroSection from "../Component/sections/home/HeroSection";
import WhyChooseUs from "../Component/Sections/Home/WhyChooseUs";
import ServicesRibbon from "../Component/Sections/Services/ServicesRibbon";
import HomePortfolioSection from "../Component/sections/Portfolio/HomePortfolioSection";
import Pricing from "../Component/Sections/Home/Pricing";
import OurExperts from "../Component/Sections/Home/OurExperts";
import CallToAction from "../Component/Sections/Home/CallToAction";
import TestimonialsSection from "../Component/Sections/Home/TestimonialsSection";
import CaseStudies from "../Component/sections/services/CaseStudies";
import { 
  HomeIcon,
  ChevronRightIcon,
  MapPinIcon,
  WrenchScrewdriverIcon,
  SparklesIcon,
  CheckCircleIcon,
  StarIcon,
  ClockIcon,
  UserGroupIcon,
  BriefcaseIcon,
  ArrowRightIcon,
  ShieldCheckIcon,
  PhoneIcon,
  ChatBubbleLeftRightIcon
} from '@heroicons/react/24/outline';
import ServicesLocation from "../Component/sections/services/ServicesLocation";

export default function ServiceDetails() {
  const params = useParams();
  const [service, setService] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isVisible, setIsVisible] = useState({});
  const sectionRefs = useRef({});

  // Intersection Observer for scroll animations
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible((prev) => ({ ...prev, [entry.target.dataset.section]: true }));
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
    );

    Object.values(sectionRefs.current).forEach((ref) => {
      if (ref) observer.observe(ref);
    });

    return () => observer.disconnect();
  }, [service]);

  // Construct full slug from params
  const getFullSlug = () => {
    const { slug, city, serviceName, subService, "*": restPath } = params;
    
    if (city && serviceName) {
      return subService ? `${city}/${serviceName}/${subService}` : `${city}/${serviceName}`;
    } else if (slug && restPath) {
      return `${slug}/${restPath}`;
    } else {
      return slug;
    }
  };

  // Parse slug to get city and service parts
  const parseSlugParts = () => {
    if (!service?.slug) return [];
    return service.slug.split('/');
  };

  useEffect(() => {
    const fetchService = async () => {
      try {
        setLoading(true);
        const fullSlug = getFullSlug();
        
        if (!fullSlug) {
          setError("Invalid service URL");
          setLoading(false);
          return;
        }

        // ✅ Fixed: Using axios with relative path
        const response = await axios.get(`/api/services/slug/${encodeURIComponent(fullSlug)}`);
        
        if (response.data.success) {
          setService(response.data.data);
          setError(null);
        } else {
          setError(response.data.message || "Service not found");
        }
      } catch (err) {
        console.error("Error fetching service:", err);
        setError(err.response?.data?.message || "Failed to load service");
      } finally {
        setLoading(false);
      }
    };

    fetchService();
  }, [params]);

  // Format part for display
  const formatPart = (part) => {
    return part
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  // Function to render formatted text with HTML
  const renderFormattedText = (text) => {
    if (!text) return null;
    
    // Replace **text** with <strong>text</strong>
    let formattedText = text.replace(/\*\*(.*?)\*\*/g, '<strong class="text-cyan-400">$1</strong>');
    // Replace *text* with <em>text</em>
    formattedText = formattedText.replace(/\*(.*?)\*/g, '<em class="text-gray-300 italic">$1</em>');
    
    return <span dangerouslySetInnerHTML={{ __html: formattedText }} />;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0a0a0f] via-[#0d0d1a] to-[#0a0a0f] flex items-center justify-center">
        <div className="text-center relative">
          {/* Animated rings */}
          <div className="absolute inset-0 w-32 h-32 mx-auto">
            <div className="absolute inset-0 border-4 border-cyan-500/30 rounded-full animate-ping"></div>
            <div className="absolute inset-2 border-4 border-blue-500/30 rounded-full animate-ping animation-delay-300"></div>
          </div>
          
          {/* Main spinner */}
          <div className="relative w-32 h-32 mx-auto mb-8">
            <div className="absolute inset-0 border-4 border-cyan-500/20 rounded-full"></div>
            <div className="absolute inset-0 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin"></div>
            <div className="absolute inset-4 border-4 border-blue-500/20 rounded-full"></div>
            <div className="absolute inset-4 border-4 border-blue-500 border-t-transparent rounded-full animate-spin animation-delay-150"></div>
          </div>
          
          <p className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400 text-lg font-medium animate-pulse">
            Loading Your Service Experience
          </p>
        </div>
      </div>
    );
  }

  if (error || !service) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0a0a0f] via-[#0d0d1a] to-[#0a0a0f] flex items-center justify-center">
        <div className="text-center max-w-md px-4 relative">
          {/* Decorative elements */}
          <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 to-blue-500/10 blur-3xl -z-10"></div>
          
          <div className="relative">
            <div className="text-8xl mb-6 animate-bounce">🔮</div>
            <h2 className="text-4xl font-bold mb-4">
              <span className="bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                404
              </span>
            </h2>
            <h3 className="text-2xl font-bold text-white mb-3">Service Not Found</h3>
            <p className="text-gray-400 mb-8 text-lg">
              {error || "The service you're looking for has vanished into the digital void..."}
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                to="/services" 
                className="group relative inline-flex items-center justify-center gap-2 bg-gradient-to-r from-cyan-500 to-blue-500 text-white px-8 py-4 rounded-xl font-semibold transition-all transform hover:scale-105 hover:shadow-2xl hover:shadow-cyan-500/25 overflow-hidden"
              >
                <span className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform"></span>
                <span className="relative">Explore Services</span>
                <ArrowRightIcon className="w-5 h-5 relative group-hover:translate-x-1 transition-transform" />
              </Link>
              
              <Link 
                to="/" 
                className="group inline-flex items-center justify-center gap-2 bg-gray-800/50 backdrop-blur-sm text-white px-8 py-4 rounded-xl font-semibold transition-all hover:bg-gray-800 border border-gray-700"
              >
                <HomeIcon className="w-5 h-5" />
                <span>Back Home</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const slugParts = parseSlugParts();
  
  // HeroSection props
  const heroProps = {
    customTitle: service.pageTitle,
    customDescription: service.miniDescription,
    customButtons: service.buttonText ? [{ text: service.buttonText, link: "/contact" }] : null,
    useApi: false
  };

  // Determine if this is a location-based service
  const isLocationBased = slugParts.length > 1;
  const location = isLocationBased ? formatPart(slugParts[0]) : null;
  const serviceType = formatPart(slugParts[isLocationBased ? 1 : 0]);

  return (
    <div className="bg-gradient-to-br from-[#0a0a0f] via-[#0d0d1a] to-[#0a0a0f] min-h-screen">
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse animation-delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] border border-cyan-500/5 rounded-full"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] border border-blue-500/5 rounded-full"></div>
      </div>

      {/* Breadcrumb Navigation - Glassmorphism style */}
      <div className="relative z-10 bg-black/40 backdrop-blur-xl border-b border-white/10 py-6">
        <div className="container mx-auto px-5">
          <nav className="flex items-center space-x-3 text-sm">
            <Link to="/" className="group flex items-center gap-2 text-gray-400 hover:text-cyan-400 transition-all">
              <HomeIcon className="w-4 h-4 group-hover:scale-110 transition-transform" />
              <span>Home</span>
            </Link>
            <ChevronRightIcon className="w-4 h-4 text-gray-600" />
            <Link to="/services" className="text-gray-400 hover:text-cyan-400 transition-colors">
              Services
            </Link>
            
            {slugParts.map((part, index) => (
              <div key={index} className="flex items-center space-x-3">
                <ChevronRightIcon className="w-4 h-4 text-gray-600" />
                <span className={
                  index === slugParts.length - 1 
                    ? "bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent font-semibold"
                    : "text-gray-400"
                }>
                  {formatPart(part)}
                </span>
              </div>
            ))}
          </nav>
        </div>
      </div>

      {/* Location Badge with Enhanced Design */}
      {isLocationBased && (
        <div className="relative z-10 bg-gradient-to-r from-cyan-500/10 via-blue-500/10 to-purple-500/10 border-b border-white/10 overflow-hidden">
          <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
          <div className="container mx-auto px-5 py-5">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-6 flex-wrap">
                <div className="flex items-center gap-3 group">
                  <div className="relative">
                    <MapPinIcon className="w-6 h-6 text-cyan-400 group-hover:scale-110 transition-transform" />
                    <span className="absolute -top-1 -right-1 w-2 h-2 bg-green-400 rounded-full animate-ping"></span>
                  </div>
                  <div>
                    <span className="text-gray-400 text-sm block">Service Location</span>
                    <span className="text-white font-bold text-lg">{location}</span>
                  </div>
                </div>
                
                <div className="w-px h-10 bg-white/10 hidden md:block"></div>
                
                <div className="flex items-center gap-3">
                  <WrenchScrewdriverIcon className="w-6 h-6 text-blue-400" />
                  <div>
                    <span className="text-gray-400 text-sm block">Service Type</span>
                    <span className="text-white font-bold text-lg">{serviceType}</span>
                  </div>
                </div>
              </div>
              
              {/* Quick Stats */}
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <StarIcon className="w-5 h-5 text-yellow-400" />
                  <span className="text-white">4.9</span>
                  <span className="text-gray-400">(250+ reviews)</span>
                </div>
                <Link 
                  to="/contact" 
                  className="group flex items-center gap-2 bg-gradient-to-r from-cyan-500 to-blue-500 text-white px-5 py-2.5 rounded-xl font-semibold text-sm transition-all hover:shadow-lg hover:shadow-cyan-500/25"
                >
                  <PhoneIcon className="w-4 h-4" />
                  <span>Get Quote</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Enhanced Hero Section with Floating Elements */}
      <section 
        ref={el => sectionRefs.current['hero'] = el}
        data-section="hero"
        className={`relative z-10 transition-all duration-1000 transform ${
          isVisible['hero'] ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
        }`}
      >
        <HeroSection 
          customTitle={service.pageTitle}
          customDescription={service.miniDescription}
          customButtons={heroProps.customButtons}
          useApi={false}
        />
      </section>
     
      {/* Rich Content Section with Modern Layout */}
      {(service.heroHeading?.text || service.heroParagraphs?.length > 0 || service.heroImage) && (
        <section className="relative z-10 py-24 overflow-hidden">
          {/* Background Elements */}
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-cyan-500/5 to-transparent"></div>
          
          <div className="container mx-auto px-5">
            <div 
              ref={el => sectionRefs.current['content'] = el}
              data-section="content"
              className={`transition-all duration-1000 delay-200 transform ${
                isVisible['content'] ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
              }`}
            >
              <div className={`grid ${service.heroImage ? 'lg:grid-cols-2 gap-16' : 'grid-cols-1'} items-start`}>
                {/* Content Side */}
                <div className="space-y-8">
                  {/* Badge */}
                  <div className="inline-flex items-center gap-2 bg-gradient-to-r from-cyan-500/10 to-blue-500/10 backdrop-blur-sm border border-cyan-500/20 px-6 py-3 rounded-full">
                    <SparklesIcon className="w-5 h-5 text-cyan-400 animate-pulse" />
                    <span className="text-sm font-medium bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                      What We Offer
                    </span>
                  </div>

                  {/* Dynamic Heading */}
                  {service.heroHeading?.text && (
                    <div className="relative">
                      <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
                        <span className="bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                          {service.heroHeading.text}
                        </span>
                      </h1>
                      {/* Decorative line */}
                      <div className="absolute -bottom-4 left-0 w-24 h-1 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full"></div>
                    </div>
                  )}

                  {/* Dynamic Paragraphs */}
                  {service.heroParagraphs?.map((para, index) => (
                    <div
                      key={index}
                      className="relative group"
                    >
                      <div className="absolute -left-4 top-0 w-1 h-0 bg-gradient-to-b from-cyan-500 to-blue-500 group-hover:h-full transition-all duration-500"></div>
                      <p 
                        className="text-gray-300 text-lg leading-relaxed pl-6"
                        style={{
                          color: para.color || '#d1d5db',
                          fontSize: para.fontSize || '1.125rem',
                          fontWeight: para.fontWeight,
                          fontStyle: para.fontStyle,
                        }}
                      >
                        {renderFormattedText(para.text)}
                      </p>
                    </div>
                  ))}

                  {/* CTA Buttons */}
                  <div className="flex flex-wrap gap-4 pt-6">
                    {service.buttonText && (
                      <Link
                        to="/contact"
                        className="group relative inline-flex items-center gap-3 bg-gradient-to-r from-cyan-500 to-blue-500 text-white px-8 py-4 rounded-xl font-semibold transition-all transform hover:scale-105 hover:shadow-2xl hover:shadow-cyan-500/25 overflow-hidden"
                      >
                        <span className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform"></span>
                        <span className="relative">{service.buttonText}</span>
                        <ArrowRightIcon className="w-5 h-5 relative group-hover:translate-x-2 transition-transform" />
                      </Link>
                    )}
                    
                    <Link
                      to="/portfolio"
                      className="group inline-flex items-center gap-3 bg-white/5 backdrop-blur-sm text-white px-8 py-4 rounded-xl font-semibold transition-all hover:bg-white/10 border border-white/10"
                    >
                      <span>View Our Work</span>
                      <BriefcaseIcon className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                    </Link>
                  </div>
                </div>

                {/* Image Side with 3D Effect */}
                {service.heroImage && (
                  <div className="relative group">
                    {/* Decorative elements */}
                    <div className="absolute -inset-4 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-2xl opacity-0 group-hover:opacity-20 blur-2xl transition-opacity duration-500"></div>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent rounded-2xl z-10"></div>
                    
                    {/* Main image */}
                    <div className="relative transform group-hover:scale-105 transition-all duration-700">
                      <img
                        src={service.heroImage}
                        alt={service.heroImageAlt || service.pageTitle}
                        className="rounded-2xl shadow-2xl border border-white/10 w-full h-auto"
                        onError={(e) => {
                          e.target.src = 'https://via.placeholder.com/800x600?text=Service+Image';
                        }}
                      />
                      
                      {/* Floating badge */}
                      <div className="absolute -bottom-6 -left-6 bg-gradient-to-r from-cyan-500 to-blue-500 p-4 rounded-xl shadow-2xl transform group-hover:rotate-3 transition-transform">
                        <div className="flex items-center gap-3">
                          <ShieldCheckIcon className="w-8 h-8 text-white" />
                          <div>
                            <div className="text-white text-sm">Trusted by</div>
                            <div className="text-white font-bold text-xl">500+ Clients</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Static Components with Spacing */}
      <div className="relative z-10 space-y-16">
        <ServicesLocation />
        <WhyChooseUs />
        
        {/* Enhanced CallToAction */}
        <CallToAction 
          location={isLocationBased ? `in ${location}` : "for Your Business"}
          title={`Ready to Transform Your ${serviceType} Business`}
          description={isLocationBased 
            ? `Let's create powerful digital strategies for your ${serviceType.toLowerCase()} business in ${location} that drive real growth and exceed expectations`
            : "Let's create powerful digital strategies that drive real growth and exceed expectations"}
          buttonText={service.buttonText || "Start Your Journey"}
        />
        
        <CaseStudies />
        <HomePortfolioSection />
        <Pricing />
        <TestimonialsSection />
        <OurExperts />
      </div>

      {/* Floating Contact Button */}
      <div className="fixed bottom-8 right-8 z-50">
        <Link
          to="/contact"
          className="group relative flex items-center gap-3 bg-gradient-to-r from-cyan-500 to-blue-500 text-white px-6 py-4 rounded-full shadow-2xl hover:shadow-cyan-500/25 transition-all hover:scale-110"
        >
          <span className="absolute inset-0 bg-white/20 rounded-full animate-ping opacity-75"></span>
          <ChatBubbleLeftRightIcon className="w-6 h-6 relative" />
          <span className="relative font-semibold">Let's Talk</span>
        </Link>
      </div>
    </div>
  );
}