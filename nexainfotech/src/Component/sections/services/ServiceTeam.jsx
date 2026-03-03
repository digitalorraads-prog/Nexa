// Component/sections/services/ServiceTeam.jsx
export default function ServiceTeam({ serviceType, location, isLocationBased }) {
  const team = [
    { name: "Alex Johnson", role: "Lead Strategist", image: "/team1.jpg" },
    { name: "Sarah Chen", role: "Senior Expert", image: "/team2.jpg" },
    { name: "Mike Williams", role: "Project Manager", image: "/team3.jpg" },
    { name: "Emma Davis", role: "Creative Director", image: "/team4.jpg" }
  ];

  return (
    <div className="py-16 bg-[#11111f]">
      <div className="container mx-auto px-5">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Our {serviceType} Experts
            {isLocationBased && <span className="text-cyan-400"> in {location}</span>}
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Meet the dedicated team handling your {serviceType.toLowerCase()} needs
          </p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {team.map((member, index) => (
            <div key={index} className="text-center">
              <div className="w-32 h-32 mx-auto mb-4 rounded-full bg-gradient-to-r from-cyan-500 to-blue-500 p-1">
                <div className="w-full h-full rounded-full bg-[#1a1a2e] flex items-center justify-center text-4xl">
                  👤
                </div>
              </div>
              <h3 className="font-bold text-lg">{member.name}</h3>
              <p className="text-gray-400 text-sm">{member.role}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}