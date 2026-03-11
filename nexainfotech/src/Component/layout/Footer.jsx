import { useEffect, useRef, useState } from "react";

export default function Footer() {
  const footerRef = useRef(null);
 const [visible, setVisible] = useState(false);


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
    { name: "Services", link: "/services" },
    { name: "About", link: "/about" },
    { name: "Contact", link: "/contact" },
  ];

  const services = [
    { name: "SEO Optimization", link: "#services" },
    { name: "Social Media Marketing", link: "/services" },
    { name: "Google Ads", link: "#services" },
    { name: "Web Development", link: "#services" },
  ];

  const socialLinks = [
    { icon: "🌐", link: "https://yourwebsite.com" },
    { icon: "📘", link: "https://facebook.com" },
    { icon: "📸", link: "https://instagram.com" },
    { icon: "💼", link: "https://linkedin.com" },
  ];

  return (
    <footer
      ref={footerRef}
      className="relative bg-[#0b0b17] text-white pt-20 pb-10 overflow-hidden"
    >
      {/* Glow Effects */}
      <div className="absolute -top-20 left-0 w-72 h-72 bg-cyan-500/20 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl animate-pulse" />

      <div
        className={`relative max-w-7xl mx-auto px-6 transition-all duration-1000 ${
          visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
        }`}
      >
        <div className="grid md:grid-cols-4 gap-10 mb-16">
          
          {/* Logo + About */}
          <div>
            <img
              src="/nexa-infotech-logo.webp"
              alt="Logo"
              className="h-12 mb-4"
            />
            <p className="text-gray-400 text-sm leading-relaxed">
              We help brands grow with powerful digital marketing strategies
              and high-converting websites.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-bold mb-4">Quick Links</h4>
            <ul className="space-y-3 text-gray-400 text-sm">
              {quickLinks.map((item, i) => (
                <li key={i}>
                  <a
                    href={item.link}
                    className="hover:text-cyan-400 transition-colors duration-300"
                  >
                    {item.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="font-bold mb-4">Services</h4>
            <ul className="space-y-3 text-gray-400 text-sm">
              {services.map((item, i) => (
                <li key={i}>
                  <a
                    href={item.link}
                    className="hover:text-cyan-400 transition-colors duration-300"
                  >
                    {item.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Social Links */}
          <div>
            <h4 className="font-bold mb-4">Follow Us</h4>
            <div className="flex gap-4">
              {socialLinks.map((item, i) => (
                <a
                  key={i}
                  href={item.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 flex items-center justify-center rounded-full
                  bg-white/5 border border-white/10 backdrop-blur-xl
                  hover:bg-cyan-500/20 hover:border-cyan-400
                  transition-all duration-300 hover:-translate-y-2"
                >
                  {item.icon}
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-white/10 pt-6 text-center text-gray-500 text-sm">
          © {new Date().getFullYear()} Nexa Infotech. All Rights Reserved.
        </div>
      </div>
    </footer>
  );
}
