import { useEffect, useRef, useState } from "react";

export default function ServicesNYC() {
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

  const services = [
    {
      icon: "🏙️",
      title: "High Quality",
      desc: "We believe that investing in customer service and product quality is the key to long-term business success and we will not let that trust break.",
      color: "from-cyan-400 to-blue-500"
    },
    {
      icon: "👥",
      title: "Creative Team",
      desc: "Team is the backbone of any organization, so we have carefully created our creative team. Our team has the ability to make your dreams come true.",
      color: "from-blue-400 to-purple-500"
    },
    {
      icon: "📈",
      title: "Amazing Results",
      desc: "We value your time as well as our time because time is the most important thing in our life. And in this way we are able to bring amazing results.",
      color: "from-purple-400 to-pink-500"
    }
  ];

  return (
    <section
      ref={sectionRef}
      className="relative py-20 bg-[#0a0a14] text-white overflow-hidden"
    >
      {/* NYC Skyline Background Effect */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-cyan-500/20 to-transparent"></div>
        <div className="absolute bottom-0 left-0 w-full" style={{
          height: '2px',
          background: 'repeating-linear-gradient(90deg, transparent, transparent 20px, rgba(6,182,212,0.3) 20px, rgba(6,182,212,0.3) 40px)'
        }}></div>
        {/* Building silhouettes */}
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute bottom-0 w-8 bg-gradient-to-t from-cyan-500/10 to-transparent"
            style={{
              left: `${i * 5}%`,
              height: `${Math.random() * 100 + 50}px`,
              width: `${Math.random() * 20 + 10}px`,
            }}
          ></div>
        ))}
      </div>

      {/* Animated Lights */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-64 h-64 bg-yellow-500/5 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl animate-pulse delay-700"></div>
      </div>

      {/* Content */}
      <div className="relative max-w-7xl mx-auto px-6">
        {/* Header */}
        <div
          className={`text-center mb-16 transition-all duration-1000 ${
            visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`}
        >
          {/* NYC Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 backdrop-blur-sm border border-white/10 mb-6">
            <span className="text-xl">🗽</span>
            <span className="text-sm font-semibold text-cyan-400">SERVICES WE PROVIDE IN NEW YORK CITY</span>
            <span className="text-xl">🗽</span>
          </div>

          {/* Main Heading */}
          <h2 className="text-4xl md:text-6xl font-bold mb-6">
            The Benefits Of{" "}
            <span className="bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 bg-clip-text text-transparent bg-size-200 animate-gradient">
              Working With Us
            </span>
          </h2>

          {/* Decorative Line */}
          <div className="flex justify-center items-center gap-4">
            <div className="w-12 h-0.5 bg-gradient-to-r from-transparent via-cyan-400 to-transparent"></div>
            <div className="w-2 h-2 rotate-45 bg-cyan-400 animate-pulse"></div>
            <div className="w-12 h-0.5 bg-gradient-to-r from-transparent via-cyan-400 to-transparent"></div>
          </div>
        </div>

        {/* Services Grid */}
        <div className="grid md:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <div
              key={index}
              className={`group relative transition-all duration-700 ${
                visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-20"
              }`}
              style={{ transitionDelay: `${index * 200}ms` }}
            >
              {/* Card with Hover Effects */}
              <div className="relative p-8 h-full bg-gradient-to-br from-white/[0.07] to-white/[0.02] backdrop-blur-xl rounded-2xl border border-white/10 overflow-hidden
                hover:scale-105 hover:-translate-y-2 transition-all duration-300
                hover:shadow-[0_20px_40px_-15px_rgba(6,182,212,0.5)]">
                
                {/* Animated Background Gradient on Hover */}
                <div className={`absolute inset-0 bg-gradient-to-r ${service.color} opacity-0 group-hover:opacity-10 transition-opacity duration-500`}></div>
                
                {/* Icon with NYC Theme */}
                <div className="relative mb-6">
                  <div className="text-5xl mb-2 transform group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
                    {service.icon}
                  </div>
                  {/* Statue of Liberty Torch Effect for first card */}
                  {index === 0 && (
                    <div className="absolute -top-2 -right-2 w-4 h-4">
                      <div className="absolute inset-0 bg-yellow-400 rounded-full animate-ping opacity-75"></div>
                      <div className="absolute inset-1 bg-yellow-400 rounded-full"></div>
                    </div>
                  )}
                </div>

                {/* Title with Gradient on Hover */}
                <h3 className="text-2xl font-bold mb-4 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-cyan-400 group-hover:to-blue-400 group-hover:bg-clip-text transition-all duration-300">
                  {service.title}
                </h3>

                {/* Description */}
                <p className="text-gray-400 leading-relaxed mb-6 group-hover:text-gray-300 transition-colors duration-300">
                  {service.desc}
                </p>

                {/* NYC Skyline Progress Bar */}
                <div className="relative h-1 bg-white/5 rounded-full overflow-hidden">
                  <div className={`absolute inset-y-0 left-0 w-0 bg-gradient-to-r ${service.color} rounded-full transition-all duration-500 group-hover:w-full`}></div>
                </div>

                {/* Building Icon at Bottom */}
                <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-20 transition-opacity duration-500">
                  <span className="text-4xl">🏢</span>
                </div>

                {/* Corner Accent */}
                <div className="absolute top-0 right-0 w-16 h-16 overflow-hidden">
                  <div className={`absolute top-0 right-0 w-16 h-16 bg-gradient-to-br ${service.color} opacity-20 transform rotate-45 translate-x-8 -translate-y-8 group-hover:translate-x-6 group-hover:-translate-y-6 transition-transform duration-500`}></div>
                </div>
              </div>

              {/* Glowing Dot */}
              <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-1 h-1">
                <div className="absolute inset-0 bg-cyan-400 rounded-full animate-ping"></div>
                <div className="absolute inset-0 bg-cyan-400 rounded-full"></div>
              </div>
            </div>
          ))}
        </div>

        {/* NYC Taxi Animation */}
        <div className="relative mt-16 h-16 overflow-hidden">
          <div className="absolute left-0 animate-taxi">
            <div className="flex items-center gap-2">
              <span className="text-3xl">🚕</span>
              <span className="text-sm text-yellow-400 font-semibold">NEW YORK CITY</span>
              <span className="text-3xl">🗽</span>
            </div>
          </div>
        </div>
      </div>

      {/* Custom Animations */}
      <style jsx>{`
        @keyframes gradient {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        
        @keyframes taxi {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100vw); }
        }
        
        .animate-gradient {
          background-size: 200% 200%;
          animation: gradient 3s ease infinite;
        }
        
        .animate-taxi {
          animation: taxi 15s linear infinite;
        }
      `}</style>
    </section>
  );
}