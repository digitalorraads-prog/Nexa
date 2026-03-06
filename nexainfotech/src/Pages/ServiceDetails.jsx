import { useParams, Link } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import axios from "../Protected/axiosPublic";
import { motion, AnimatePresence } from "framer-motion";
import HeroSection from "../Component/sections/home/HeroSection";
import WhyChooseUs from "../Component/sections/home/WhyChooseUs";
import ServicesRibbon from "../Component/sections/services/ServicesRibbon";
import HomePortfolioSection from "../Component/sections/Portfolio/HomePortfolioSection";
import Pricing from "../Component/sections/home/Pricing";
import OurExperts from "../Component/sections/home/OurExperts";
import CallToAction from "../Component/sections/home/CallToAction";
import TestimonialsSection from "../Component/sections/home/TestimonialsSection";
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
  ChatBubbleLeftRightIcon,
  PhotoIcon
} from '@heroicons/react/24/outline';

export default function ServiceDetails() {
  const params = useParams();
  const [service, setService] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isVisible, setIsVisible] = useState({});
  const sectionRefs = useRef({});

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

  const formatPart = (part) => {
    return part
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  const renderFormattedText = (text) => {
    if (!text) return null;
    let formattedText = text
      .replace(/\*\*(.*?)\*\*/g, '<strong class="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500 font-extrabold">$1</strong>')
      .replace(/\*(.*?)\*/g, '<em class="text-gray-300 italic">$1</em>')
      .replace(/<span style="color:(.*?)">(.*?)<\/span>/g, '<span style="color:$1">$2</span>')
      .replace(/<u>(.*?)<\/u>/g, '<u class="underline decoration-cyan-500/50 underline-offset-4 decoration-2">$1</u>')
      .replace(/<a href="(.*?)" target="_blank" rel="noopener noreferrer" class="text-cyan-400 hover:text-cyan-300 underline">(.*?)<\/a>/g, '<a href="$1" target="_blank" rel="noopener noreferrer" class="text-cyan-400 hover:text-cyan-300 hover:underline decoration-cyan-400 underline-offset-4 transition-all font-medium">$2</a>');
    return <span dangerouslySetInnerHTML={{ __html: formattedText }} />;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#050508] flex items-center justify-center relative overflow-hidden">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center relative z-10 p-12 backdrop-blur-3xl bg-white/[0.02] rounded-[3rem] border border-white/10 shadow-2xl"
        >
          <div className="relative w-24 h-24 mx-auto mb-8">
            <div className="absolute inset-0 border-2 border-cyan-500/20 rounded-full"></div>
            <div className="absolute inset-0 border-t-2 border-cyan-400 rounded-full animate-spin"></div>
            <div className="absolute inset-4 border-2 border-blue-500/20 rounded-full"></div>
            <div className="absolute inset-4 border-b-2 border-blue-400 rounded-full animate-[spin_2s_linear_infinite_reverse]"></div>
          </div>
          <p className="text-xl font-black bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-blue-500 tracking-widest uppercase">
            Initializing Elite Interface
          </p>
        </motion.div>
      </div>
    );
  }

  if (error || !service) {
    return (
      <div className="min-h-screen bg-[#050508] flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center max-w-xl px-8"
        >
          <div className="text-[120px] mb-8 leading-none opacity-50">✦</div>
          <h2 className="text-6xl font-black text-white mb-6 tracking-tighter">404 <span className="text-cyan-500 text-xl font-mono align-top">ERR</span></h2>
          <p className="text-gray-400 text-xl font-medium mb-12 tracking-wide leading-relaxed">
            {error || "The requested service configuration is currently unavailable in this sector."}
          </p>
          <Link
            to="/services"
            className="inline-flex items-center gap-4 bg-white text-black px-10 py-5 rounded-2xl font-black uppercase tracking-widest text-sm hover:bg-cyan-400 transition-colors shadow-2xl shadow-white/5"
          >
            Reconnect to Catalog
          </Link>
        </motion.div>
      </div>
    );
  }

  const slugParts = parseSlugParts();
  const location = slugParts.length > 1 ? formatPart(slugParts[0]) : null;
  const serviceType = formatPart(slugParts[slugParts.length > 1 ? 1 : 0]);
  const isLocationBased = slugParts.length > 1;

  return (
    <div className="bg-[#050508] min-h-screen text-gray-200 selection:bg-cyan-500/30 overflow-x-hidden">
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-20%] left-[-10%] w-[1000px] h-[1000px] bg-cyan-500/[0.07] rounded-full blur-[150px] animate-[pulse_10s_ease-in-out_infinite]"></div>
        <div className="absolute bottom-[-20%] right-[-10%] w-[1000px] h-[1000px] bg-blue-600/[0.07] rounded-full blur-[150px] animate-[pulse_15s_ease-in-out_infinite_reverse] delay-2000"></div>
        <div className="absolute inset-0 bg-[url('/noise.png')] opacity-[0.015] mix-blend-overlay"></div>
      </div>

      <AnimatePresence>
        {isLocationBased && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="relative z-10 bg-[#0a0a16]/60 border-b border-white/5 backdrop-blur-3xl overflow-hidden py-8 lg:py-12"
          >
            <div className="container mx-auto px-5 lg:px-10">
              <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
                <div className="flex flex-col sm:flex-row items-center gap-8 lg:gap-16 w-full lg:w-auto">
                  <motion.div whileHover={{ scale: 1.05 }} className="flex items-center gap-6 group bg-white/[0.03] p-5 rounded-[2rem] border border-white/10 hover:border-cyan-500/40 transition-all duration-700 shadow-2xl">
                    <div className="relative w-16 h-16 rounded-2xl bg-gradient-to-br from-cyan-500/20 to-blue-600/20 border border-cyan-400/30 flex items-center justify-center">
                      <MapPinIcon className="w-8 h-8 text-cyan-400 group-hover:scale-110 transition-transform" />
                      <span className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 border-2 border-[#0a0a16] rounded-full animate-pulse shadow-[0_0_15px_#22c55e]"></span>
                    </div>
                    <div>
                      <span className="text-gray-500 text-[10px] font-black uppercase tracking-[0.3em] block mb-1">Operational Zone</span>
                      <span className="text-white font-black text-2xl lg:text-3xl tracking-tight italic">{location}</span>
                    </div>
                  </motion.div>
                  <div className="hidden sm:block w-px h-20 bg-gradient-to-b from-transparent via-white/10 to-transparent"></div>
                  <motion.div whileHover={{ scale: 1.05 }} className="flex items-center gap-6 group bg-white/[0.03] p-5 rounded-[2rem] border border-white/10 hover:border-blue-500/40 transition-all duration-700 shadow-2xl">
                    <div className="relative w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500/20 to-purple-600/20 border border-blue-400/30 flex items-center justify-center">
                      <WrenchScrewdriverIcon className="w-8 h-8 text-blue-400" />
                    </div>
                    <div>
                      <span className="text-gray-500 text-[10px] font-black uppercase tracking-[0.3em] block mb-1">Core Capability</span>
                      <span className="text-white font-black text-2xl lg:text-3xl tracking-tight italic">{serviceType}</span>
                    </div>
                  </motion.div>
                </div>
                <div className="flex flex-col sm:flex-row items-center gap-10">
                  <div className="text-center sm:text-right group">
                    <div className="flex items-center justify-center sm:justify-end gap-2 mb-2">
                      {[...Array(5)].map((_, i) => <StarIcon key={i} className="w-6 h-6 text-cyan-400 fill-cyan-400/20" />)}
                      <span className="text-white font-black text-3xl ml-3 tracking-tighter">4.9</span>
                    </div>
                    <span className="text-[10px] font-black text-gray-500 uppercase tracking-[0.4em]">Elite Certification</span>
                  </div>
                  <Link
                    to="/contact"
                    className="group relative inline-flex items-center gap-4 bg-white text-black px-12 py-5 rounded-2xl font-black transition-all duration-500 hover:scale-[1.05] shadow-[0_20px_60px_rgba(255,255,255,0.1)] overflow-hidden"
                  >
                    <span className="absolute inset-0 bg-cyan-400 translate-x-[-101%] group-hover:translate-x-0 transition-transform duration-700 ease-in-out"></span>
                    <span className="relative z-10 text-xs sm:text-sm uppercase tracking-widest">Initiate Discovery</span>
                    <ArrowRightIcon className="w-5 h-5 relative z-10 group-hover:translate-x-2 transition-transform duration-500" />
                  </Link>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <section className="relative z-10">
        <HeroSection
          customTitle={service.pageTitle}
          customDescription={service.miniDescription}
          customButtons={service.buttonText ? [{ text: service.buttonText, link: "/contact" }] : null}
          useApi={false}
        />
      </section>

      {(service.heroHeading?.text || service.heroParagraphs?.length > 0 || service.heroImage) && (
        <section className="relative z-10 py-24 lg:py-32 overflow-hidden">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-cyan-500/5 blur-[150px] rounded-full pointer-events-none"></div>
          <div className="container mx-auto px-5 lg:px-10">
            <div className={`grid ${service.heroImage ? 'lg:grid-cols-2 gap-16 lg:gap-24' : 'grid-cols-1 max-w-5xl mx-auto'} items-center`}>
              <motion.div
                initial={{ x: -100, opacity: 0 }}
                whileInView={{ x: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 1, ease: "circOut" }}
                className="order-2 lg:order-1"
              >
                <div className="relative p-px rounded-[3rem] bg-gradient-to-b from-white/10 to-transparent group/leftcard hover:from-white/20 transition-all duration-700 shadow-2xl">
                  <div className="bg-[#050508]/90 backdrop-blur-3xl p-10 md:p-14 rounded-[2.9rem] h-full relative overflow-hidden">
                    <div className="absolute -top-32 -right-32 w-64 h-64 bg-cyan-500/10 blur-[100px] rounded-full group-hover/leftcard:bg-cyan-400/20 transition-colors duration-700"></div>

                    <div className="inline-flex items-center gap-3 bg-white/[0.02] border border-white/5 px-5 py-2.5 rounded-full mb-10 backdrop-blur-sm shadow-[0_4px_20px_rgba(0,0,0,0.5)]">
                      <span className="relative flex h-2.5 w-2.5">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-cyan-500 shadow-[0_0_10px_#06b6d4]"></span>
                      </span>
                      <span className="text-[10px] font-black tracking-[0.3em] text-gray-300 uppercase">Premium Protocol</span>
                    </div>

                    {service.heroHeading?.text && (
                      <h2 className="text-4xl sm:text-5xl lg:text-[64px] font-black text-transparent bg-clip-text bg-gradient-to-br from-white via-gray-100 to-gray-500 leading-[1.1] tracking-tighter mb-12 drop-shadow-lg">
                        {service.heroHeading.text}
                      </h2>
                    )}

                    <div className="space-y-8 relative">
                      <div className="absolute left-[2px] top-2 bottom-2 w-[2px] bg-gradient-to-b from-cyan-400 via-blue-600 to-transparent rounded-full opacity-50"></div>
                      {service.heroParagraphs?.map((para, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, x: -10 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.15 + 0.3 }}
                          className="pl-8 relative group/para"
                        >
                          <div className="absolute left-0 top-3 w-1.5 h-1.5 rounded-full bg-cyan-400 opacity-0 group-hover/para:opacity-100 transition-opacity transform -translate-x-[2.5px] shadow-[0_0_10px_#22d3ee]"></div>
                          <p className="text-base sm:text-lg text-gray-300 leading-[1.8] font-medium tracking-wide" style={{ color: para.color }}>
                            {renderFormattedText(para.text)}
                          </p>
                        </motion.div>
                      ))}
                    </div>

                    <div className="flex flex-wrap gap-6 mt-14">
                      {service.buttonText && (
                        <Link to="/contact" className="group relative overflow-hidden inline-flex items-center gap-4 bg-white px-10 py-4 rounded-2xl text-[#050508] font-black uppercase text-xs tracking-widest hover:scale-105 transition-all duration-300 shadow-[0_0_30px_rgba(255,255,255,0.15)]">
                          <span className="relative z-10">{service.buttonText}</span>
                          <ArrowRightIcon className="w-5 h-5 relative z-10 group-hover:translate-x-2 transition-transform" />
                          <div className="absolute inset-0 bg-gradient-to-r from-cyan-300 to-white opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        </Link>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>

              {service.heroImage && (
                <motion.div
                  initial={{ x: 100, opacity: 0, scale: 0.9 }}
                  whileInView={{ x: 0, opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 1.2, ease: "circOut", delay: 0.2 }}
                  className="order-1 lg:order-2 w-full"
                >
                  <div className="relative group/img w-full">
                    {/* Magical Ambient Glow */}
                    <div className="absolute -inset-4 bg-gradient-to-tr from-cyan-500/30 via-blue-600/20 to-purple-500/30 rounded-[3rem] blur-3xl opacity-50 group-hover/img:opacity-80 group-hover/img:scale-105 transition-all duration-1000"></div>

                    <div className="relative rounded-[2.5rem] overflow-hidden border border-white/10 ring-1 ring-white/5 bg-[#0a0a16] shadow-2xl aspect-[4/5] lg:h-[700px]">
                      <img
                        src={service.heroImage}
                        className="w-full h-full object-cover transform scale-100 group-hover/img:scale-110 transition-transform duration-[3s] ease-out opacity-90 group-hover/img:opacity-100"
                        alt={service.heroImageAlt || service.pageTitle}
                      />

                      {/* Gradient overlay to make text pop */}
                      <div className="absolute inset-0 bg-gradient-to-t from-[#050508] via-[#050508]/20 to-transparent"></div>

                      {/* Floating Bottom Card */}
                      <div className="absolute bottom-6 left-6 right-6 lg:bottom-10 lg:left-10 lg:right-10 backdrop-blur-2xl bg-white/[0.04] border border-white/10 p-6 lg:p-8 rounded-[2rem] shadow-[0_20px_40px_rgba(0,0,0,0.8)] transform translate-y-4 group-hover/img:translate-y-0 opacity-90 group-hover/img:opacity-100 transition-all duration-700">
                        <div className="flex justify-between items-center sm:items-end gap-4">
                          <div className="flex-1">
                            <div className="inline-flex items-center gap-2 mb-3 px-3 py-1 bg-cyan-500/10 border border-cyan-500/20 rounded-full">
                              <ShieldCheckIcon className="w-3.5 h-3.5 text-cyan-400" />
                              <span className="text-cyan-400 text-[9px] sm:text-[10px] font-black uppercase tracking-[0.3em]">Verified Excellence</span>
                            </div>
                            <h3 className="text-2xl sm:text-3xl lg:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-300 leading-tight tracking-tight drop-shadow-lg">
                              {service.pageTitle}
                            </h3>
                          </div>

                          <div className="w-14 h-14 sm:w-16 sm:h-16 flex-shrink-0 bg-gradient-to-br from-cyan-400 to-blue-600 rounded-2xl flex items-center justify-center text-white font-black shadow-[0_0_30px_rgba(6,182,212,0.4)] group-hover/img:rotate-12 group-hover/img:scale-110 transition-transform duration-500 border border-white/20">
                            <SparklesIcon className="w-7 h-7 sm:w-8 sm:h-8" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </div>
          </div>
        </section>
      )}

      <div className="relative z-10">
        <WhyChooseUs />
        <CallToAction
          location={isLocationBased ? `in ${location}` : "for Your Business"}
          title={`Transform Your ${serviceType} Future`}
          description={`Engineering elite digital experiences through advanced ${serviceType.toLowerCase()} strategies.`}
          buttonText={service.buttonText || "Begin Integration"}
        />
        <CaseStudies />
        <HomePortfolioSection />
        <Pricing />
        <TestimonialsSection />
        <OurExperts />
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0 }}
        whileInView={{ opacity: 1, scale: 1 }}
        className="fixed bottom-10 right-10 z-[100]"
      >
        <Link to="/contact" className="w-20 h-20 bg-white shadow-2xl rounded-full flex items-center justify-center text-black hover:scale-110 active:scale-95 transition-all group overflow-hidden">
          <div className="absolute inset-0 bg-cyan-400 translate-y-full group-hover:translate-y-0 transition-transform duration-500"></div>
          <ChatBubbleLeftRightIcon className="w-9 h-9 relative z-10" />
        </Link>
      </motion.div>

      <style jsx>{`
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-spin-slow {
          animation: spin-slow 12s linear infinite;
        }
      `}</style>
    </div>
  );
}