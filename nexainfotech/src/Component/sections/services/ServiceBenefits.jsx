// Component/sections/services/ServiceBenefits.jsx
export default function ServiceBenefits({ serviceType, location, isLocationBased }) {
  const benefits = [
    {
      icon: "🚀",
      title: "Fast Results",
      desc: `Quick turnaround time for ${serviceType} projects`
    },
    {
      icon: "💡",
      title: "Expert Team",
      desc: `Specialized ${serviceType} experts with years of experience`
    },
    {
      icon: "📊",
      title: "Data-Driven",
      desc: "All decisions backed by data and analytics"
    },
    {
      icon: "🎯",
      title: "Custom Strategy",
      desc: `Tailored ${serviceType} solutions for your business`
    },
    {
      icon: "🤝",
      title: "Ongoing Support",
      desc: "24/7 support and regular performance updates"
    },
    {
      icon: "💰",
      title: "ROI Focused",
      desc: "Maximum return on your investment guaranteed"
    }
  ];

  return (
    <div className="py-16">
      <div className="container mx-auto px-5">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Benefits of Our {serviceType} Services
            {isLocationBased && <span className="text-cyan-400"> in {location}</span>}
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Why businesses choose us for their {serviceType.toLowerCase()} needs
          </p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {benefits.map((benefit, index) => (
            <div key={index} className="bg-[#1a1a2e] p-6 rounded-xl border border-gray-800 hover:border-cyan-400/50 transition">
              <span className="text-4xl mb-3 block">{benefit.icon}</span>
              <h3 className="text-xl font-bold mb-2">{benefit.title}</h3>
              <p className="text-gray-400">{benefit.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
