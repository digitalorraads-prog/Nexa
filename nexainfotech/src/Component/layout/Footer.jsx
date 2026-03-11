import { useEffect, useRef, useState } from "react";
import { Facebook, Instagram, MessageCircle, Globe, ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function Footer() {
  const footerRef = useRef(null);
  const [visible, setVisible] = useState(false);
  const [showMore, setShowMore] = useState(false);


  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setVisible(true);
      },
      { threshold: 0.2 }
    );

    if (footerRef.current) observer.observe(footerRef.current);
    return () => observer.disconnect();
  }, []);

  const quickLinks = [
    { name: "Home", link: "/" },
    { name: "About", link: "/about" },
    { name: "Blogs", link: "/blog" },
    { name: "Contact", link: "/contact" },
  ];

  const services = [
    { name: "Website designing", link: "/professional-website-design-services" },
    { name: "SEO Services", link: "/professional-seo-services" },
    { name: "PPC Management", link: "/ppc-management-services" },
    { name: "Social Media Marketing", link: "/social-media-marketing" },
  ];

  const additionalServices = [
    { name: "Graphic Designing", link: "/creative-graphic-design-services" },
    { name: "Logo Designing", link: "/logo-designing" },
    { name: "Video and Youtube Advertising", link: "/video-and-youtube-advertising" },
    { name: "Local Business Promotion", link: "/local-business-promotion-services" },
  ];

  const socialLinks = [
    { icon: <Globe size={20} />, link: "https://nexainfotech.com/" },
    { icon: <Facebook size={20} />, link: "#" },
    { icon: <Instagram size={20} />, link: "https://nexainfotech.com/" },
    { icon: <MessageCircle size={20} />, link: "https://wa.me/919896384224" },
  ];

  return (
    <footer
      ref={footerRef}
      className="relative bg-[#05050a] text-white pt-24 pb-12 overflow-hidden border-t border-white/5"
    >
      {/* Premium Background Effects */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-cyan-500/10 rounded-full blur-[120px] -translate-y-1/2 animate-pulse" />
      <div className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-blue-600/10 rounded-full blur-[150px] translate-y-1/2 animate-pulse" />
      
      <div
        className={`relative max-w-7xl mx-auto px-6 transition-all duration-1000 ease-out ${
          visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
        }`}
      >
        <div className="grid md:grid-cols-4 gap-12 mb-20">
          
          {/* Logo + About */}
          <div className="space-y-6">
            <img
              src="/nexa-infotech-logo.webp"
              alt="Nexa Infotech"
              className="h-14 w-auto object-contain hover:scale-105 transition-transform duration-300"
            />
            <p className="text-gray-200 text-sm leading-relaxed max-w-xs transition-colors duration-300 hover:text-white">
              We empower brands with cutting-edge digital marketing strategies
              and bespoke, high-performance web experiences that drive growth.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-8 bg-gradient-to-r from-white to-gray-200 bg-clip-text text-transparent">
              Quick Links
            </h4>
            <ul className="space-y-4">
              {quickLinks.map((item, i) => (
                <li key={i} className="group overflow-hidden">
                  <a
                    href={item.link}
                    className="text-gray-200 hover:text-cyan-400 text-sm transition-all duration-300 flex items-center gap-2"
                  >
                    <span className="w-0 group-hover:w-2 h-[1px] bg-cyan-400 transition-all duration-300"></span>
                    {item.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-lg font-semibold mb-8 bg-gradient-to-r from-white to-gray-200 bg-clip-text text-transparent">
              Services
            </h4>
            <ul className="space-y-4">
              {services.map((item, i) => (
                <li key={i} className="group overflow-hidden">
                  <a
                    href={item.link}
                    className="text-sm text-gray-200 hover:text-cyan-400 transition-all duration-300 flex items-center gap-2"
                  >
                    <span className="w-0 group-hover:w-2 h-[1px] bg-cyan-400 transition-all duration-300"></span>
                    {item.name}
                  </a>
                </li>
              ))}
              
              <li>
                <button 
                  onClick={() => setShowMore(!showMore)}
                  className="text-gray-200 hover:text-cyan-400 text-sm transition-all duration-300 flex items-center gap-2 group cursor-pointer"
                >
                  <ChevronDown size={14} className={`transition-transform duration-300 ${showMore ? "rotate-180 text-cyan-400" : ""}`} />
                  <span className={showMore ? "text-cyan-400" : ""}>{showMore ? "Show Less" : "More Services"}</span>
                </button>
              </li>

              <AnimatePresence>
                {showMore && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                    className="overflow-hidden space-y-4"
                  >
                    {additionalServices.map((item, i) => (
                      <div key={i} className="group overflow-hidden">
                        <a
                          href={item.link}
                          className="text-sm text-gray-200 hover:text-cyan-400 transition-all duration-300 flex items-center gap-2"
                        >
                          <span className="w-0 group-hover:w-2 h-[1px] bg-cyan-400 transition-all duration-300"></span>
                          {item.name}
                        </a>
                      </div>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </ul>
          </div>

          {/* Social Links */}
          <div>
            <h4 className="text-lg font-semibold mb-8 bg-gradient-to-r from-white to-gray-200 bg-clip-text text-transparent">
              Connect With Us
            </h4>
            <div className="flex flex-wrap gap-4">
              {socialLinks.map((item, i) => (
                <a
                  key={i}
                  href={item.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-12 h-12 flex items-center justify-center rounded-2xl
                  bg-white/[0.03] border border-white/[0.08] backdrop-blur-2xl
                  hover:bg-cyan-500/20 hover:border-cyan-400/50 hover:text-cyan-400
                  transition-all duration-500 hover:-translate-y-2 group shadow-lg"
                >
                  <span className="text-xl group-hover:scale-110 transition-transform duration-300">
                    {item.icon}
                  </span>
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-white/[0.08] pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-gray-400 text-[13px] tracking-wide">
          <p>© {new Date().getFullYear()} Nexa Infotech. Crafted for Excellence.</p>
          <div className="flex gap-6">
            <a href="/privacy-policy" className="hover:text-white transition-colors duration-300">Privacy Policy</a>
            <a href="/terms-of-service" className="hover:text-white transition-colors duration-300">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
