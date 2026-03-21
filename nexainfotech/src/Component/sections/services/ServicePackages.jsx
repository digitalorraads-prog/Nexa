// Component/sections/services/ServicePackages.jsx
export default function ServicePackages({ serviceType, location, isLocationBased }) {
  const packages = [
    {
      name: "Starter",
      price: "$999",
      period: "/month",
      features: [
        "Basic strategy",
        "Monthly reports",
        "Email support",
        "1 revision"
      ]
    },
    {
      name: "Professional",
      price: "$1,999",
      period: "/month",
      features: [
        "Advanced strategy",
        "Weekly reports",
        "Priority support",
        "Unlimited revisions",
        "Dedicated manager"
      ],
      popular: true
    },
    {
      name: "Enterprise",
      price: "Custom",
      features: [
        "Full strategy",
        "Daily reports",
        "24/7 support",
        "Custom solutions",
        "Team training",
        "API access"
      ]
    }
  ];

  return (
    <div className="py-16 bg-[#11111f]">
      <div className="container mx-auto px-5">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            {serviceType} Packages
            {isLocationBased && <span className="text-cyan-400"> in {location}</span>}
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Choose the perfect plan for your business needs
          </p>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {packages.map((pkg, index) => (
            <div key={index} className={`bg-[#1a1a2e] p-8 rounded-xl border ${pkg.popular ? 'border-cyan-400' : 'border-gray-800'} relative`}>
              {pkg.popular && (
                <span className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-cyan-500 text-white px-3 py-1 rounded-full text-xs">
                  Most Popular
                </span>
              )}
              <h3 className="text-2xl font-bold mb-2">{pkg.name}</h3>
              <div className="mb-4">
                <span className="text-3xl font-bold">{pkg.price}</span>
                {pkg.period && <span className="text-gray-400">{pkg.period}</span>}
              </div>
              <ul className="space-y-3 mb-6">
                {pkg.features.map((feature, i) => (
                  <li key={i} className="flex items-center gap-2 text-gray-400">
                    <span className="text-cyan-400">✓</span>
                    {feature}
                  </li>
                ))}
              </ul>
              <button className="w-full py-3 bg-cyan-600 hover:bg-cyan-700 rounded-lg font-semibold transition">
                Get Started
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
