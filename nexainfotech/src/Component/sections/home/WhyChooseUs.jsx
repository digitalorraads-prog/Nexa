import { useEffect, useRef, useState } from "react";

export default function WhyChooseUs() {
  const sectionRef = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setVisible(true);
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  const features = [
    {
      number: "01",
      icon: "👑",
      title: "Premium Quality",
      desc: "We deliver quality services that bring new life to your business with timely execution.",
    },
    {
      number: "02",
      icon: "🧠",
      title: "Dedicated Experts",
      desc: "Our hardworking team loves challenging projects and provides innovative solutions.",
    },
    {
      number: "03",
      icon: "🚀",
      title: "Amazing Results",
      desc: "We ensure measurable growth and complete satisfaction with every project.",
    },
    {
      number: "04",
      icon: "💰",
      title: "Affordable Pricing",
      desc: "Our work speaks louder than words. Pay only when you are satisfied.",
    },
    {
      number: "05",
      icon: "⚡",
      title: "Innovations",
      desc: "We use latest technologies so your business stays future-ready.",
    },
    {
      number: "06",
      icon: "📞",
      title: "24/7 Support",
      desc: "End-to-end support with fast response and zero delays.",
    },
  ];

  return (
    <section
      ref={sectionRef}
      className="relative py-16 bg-[#0a0a14] text-white overflow-hidden"
    >
      {/* Animated Background with Particles Effect */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-72 h-72 bg-cyan-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-72 h-72 bg-blue-600/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-purple-600/5 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>

      {/* Grid Pattern Overlay */}
      <div className="absolute inset-0 opacity-20">
        <div className="h-full w-full" style={{
          backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.05) 1px, transparent 0)',
          backgroundSize: '40px 40px'
        }}></div>
      </div>

      {/* Heading with Floating Animation */}
      <div
        className={`text-center mb-16 px-6 transition-all duration-1000 ${
          visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
        }`}
      >
        <span className="inline-block px-4 py-2 rounded-full bg-cyan-500/10 text-cyan-400 text-sm font-semibold mb-4 backdrop-blur-sm border border-cyan-500/20">
          ✦ WHY CHOOSE US ✦
        </span>
        <h2 className="text-4xl md:text-5xl font-bold mb-4">
          We Deliver{" "}
          <span className="bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 bg-clip-text text-transparent bg-size-200 animate-gradient">
            Excellence
          </span>
        </h2>
        <p className="text-gray-400 max-w-2xl mx-auto text-lg">
          Discover what makes us different and why our clients trust us with their most important projects
        </p>
      </div>

      {/* Grid - Container Chota Kiya */}
      <div className="max-w-6xl mx-auto px-4 grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {features.map((item, index) => (
          <div
            key={index}
            className={`group relative p-6 rounded-2xl bg-gradient-to-br from-white/[0.07] to-white/[0.02] backdrop-blur-xl border border-white/10
              transition-all duration-500 hover:duration-300
              hover:scale-105 hover:-translate-y-2
              hover:shadow-[0_20px_40px_-15px_rgba(6,182,212,0.3)]
              hover:border-cyan-500/30
              ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-20"}`}
            style={{ 
              transitionDelay: `${index * 100}ms`,
              animation: visible ? `float 3s ease-in-out ${index * 0.2}s infinite` : 'none'
            }}
          >
            {/* Hover Glow Effect */}
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-cyan-500/0 via-cyan-500/0 to-blue-500/0 group-hover:from-cyan-500/10 group-hover:via-blue-500/10 group-hover:to-purple-500/10 transition-all duration-500"></div>
            
            {/* Number with Icon Combined */}
            <div className="flex items-start justify-between mb-4">
          
              <div className="text-3xl transform transition-all duration-300 group-hover:scale-110 group-hover:rotate-3">
                {item.icon}
              </div>
            </div>

            {/* Title */}
            <h3 className="text-lg font-bold mb-3 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-cyan-400 group-hover:to-blue-400 group-hover:bg-clip-text transition-all duration-300">
              {item.title}
            </h3>

            {/* Description */}
            <p className="text-gray-400 text-sm leading-relaxed mb-4 group-hover:text-gray-300 transition-colors duration-300">
              {item.desc}
            </p>

            {/* Animated Progress Line */}
            <div className="relative h-1 bg-white/5 rounded-full overflow-hidden">
              <div className="absolute inset-y-0 left-0 w-0 bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 rounded-full transition-all duration-500 group-hover:w-full"></div>
            </div>

            {/* Corner Accent */}
            <div className="absolute top-0 right-0 w-12 h-12 overflow-hidden">
              <div className="absolute top-0 right-0 w-12 h-12 bg-gradient-to-br from-cyan-500/20 to-transparent transform rotate-45 translate-x-6 -translate-y-6 group-hover:translate-x-4 group-hover:-translate-y-4 transition-transform duration-500"></div>
            </div>
          </div>
        ))}
      </div>

      {/* Add custom keyframes for animations */}
      <style jsx>{`
        @keyframes gradient {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        
        @keyframes float {
          0% { transform: translateY(0px); }
          50% { transform: translateY(-5px); }
          100% { transform: translateY(0px); }
        }
        
        .animate-gradient {
          background-size: 200% 200%;
          animation: gradient 3s ease infinite;
        }
      `}</style>
    </section>
 );
}