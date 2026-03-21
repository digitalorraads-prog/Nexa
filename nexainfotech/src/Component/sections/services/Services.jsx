import { useEffect, useRef, useState } from "react";

export default function Services() {
  const services = [
    {
      title: "Search Engine Optimization",
      desc: "Rank higher on Google and drive organic traffic with proven SEO strategies.",
      icon: "🚀",
    },
    {
      title: "Social Media Marketing",
      desc: "Grow your brand presence across Instagram, Facebook & LinkedIn.",
      icon: "📱",
    },
    {
      title: "Google Ads & PPC",
      desc: "High-converting paid ad campaigns with maximum ROI.",
      icon: "💰",
    },
    {
      title: "Brand Strategy",
      desc: "Build a strong identity that connects with your audience.",
      icon: "🎯",
    },
    {
      title: "Web Development",
      desc: "Modern, fast and responsive websites that convert visitors.",
      icon: "💻",
    },
    {
      title: "Performance Marketing",
      desc: "Data-driven marketing campaigns that scale your business.",
      icon: "📊",
    },
  ];

  const sectionRef = useRef(null);
  const [visible, setVisible] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  /* Scroll Reveal */
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setVisible(true);
      },
      { threshold: 0.2 }
    );

    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  /* Parallax Mouse Effect */
  const handleMouseMove = (e) => {
    const { clientX, clientY } = e;
    setMousePos({
      x: (clientX - window.innerWidth / 2) / 40,
      y: (clientY - window.innerHeight / 2) / 40,
    });
  };

  return (
    <section
      ref={sectionRef}
      onMouseMove={handleMouseMove}
      className="relative py-14 bg-[#111122] text-white overflow-hidden"
    >
      {/* Animated Background Glow */}
      <div className="absolute -top-20 -left-20 w-72 h-72 bg-cyan-500/20 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl animate-pulse" />

      {/* Heading */}
      <div
        className={`text-center mb-16 px-6 transition-all duration-1000 ${
          visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
        }`}
      >
        <h2 className="text-4xl md:text-5xl font-extrabold mb-4">
          Our{" "}
          <span className="bg-linear-to-r from-cyan-400 via-blue-500 to-purple-500 bg-clip-text text-transparent animate-gradient-x">
            Services
          </span>
        </h2>
        <p className="text-gray-400 max-w-2xl mx-auto">
          We provide full-scale digital solutions to grow your business globally.
        </p>
      </div>

      {/* Services Grid */}
      <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 lg:grid-cols-3 gap-10">
        {services.map((service, index) => (
          <div
            key={index}
            className={`relative group p-8 rounded-2xl bg-white/5 backdrop-blur-xl
              border border-white/10 transition-all duration-700
              hover:-translate-y-4 hover:scale-105
              hover:shadow-2xl hover:shadow-cyan-500/30
              ${
                visible
                  ? "opacity-100 translate-y-0 scale-100"
                  : "opacity-0 translate-y-16 scale-95"
              }`}
            style={{
              transitionDelay: `${index * 200}ms`,
              transform: `translate(${mousePos.x}px, ${mousePos.y}px)`,
            }}
          >
            {/* Gradient Glow Border */}
            <div className="absolute inset-0 rounded-2xl bg-linear-to-r from-cyan-400 via-blue-500 to-purple-500 opacity-0 group-hover:opacity-25 blur-xl transition duration-500"></div>

            {/* Icon */}
            <div className="relative text-4xl mb-6 transition-all duration-500 group-hover:scale-125 group-hover:rotate-6">
              {service.icon}
            </div>

            <h3 className="relative text-xl font-bold mb-4 group-hover:text-cyan-400 transition">
              {service.title}
            </h3>

            <p className="relative text-gray-400 text-sm leading-relaxed">
              {service.desc}
            </p>

            {/* Animated Bottom Line */}
            <div className="relative mt-6 h-1 w-0 bg-linear-to-r from-cyan-400 to-blue-600 transition-all duration-500 group-hover:w-full"></div>
          </div>
        ))}
      </div>
    </section>
  );
}
