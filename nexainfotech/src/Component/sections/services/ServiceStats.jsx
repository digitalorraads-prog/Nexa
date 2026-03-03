// Component/sections/services/ServiceStats.jsx
export default function ServiceStats({ location, serviceType, isLocationBased }) {
  const stats = isLocationBased ? [
    { number: "150+", label: `Projects in ${location}` },
    { number: "50+", label: `Happy Clients in ${location}` },
    { number: "5+", label: "Years Experience" },
    { number: "95%", label: "Client Satisfaction" }
  ] : [
    { number: "500+", label: "Total Projects" },
    { number: "200+", label: "Happy Clients" },
    { number: "8+", label: "Years Experience" },
    { number: "98%", label: "Client Satisfaction" }
  ];

  return (
    <div className="container mx-auto px-5 py-12">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div key={index} className="bg-[#1a1a2e] p-6 rounded-xl border border-gray-800 text-center">
            <div className="text-3xl font-bold text-cyan-400 mb-2">{stat.number}</div>
            <div className="text-gray-400 text-sm">{stat.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}