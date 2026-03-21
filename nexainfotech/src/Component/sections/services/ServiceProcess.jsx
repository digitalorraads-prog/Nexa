// Component/sections/services/ServiceProcess.jsx
export default function ServiceProcess({ serviceType, location, isLocationBased }) {
  const steps = [
    { step: "01", title: "Discovery Call", desc: "We discuss your goals and requirements" },
    { step: "02", title: "Strategy", desc: "Custom strategy for your business" },
    { step: "03", title: "Execution", desc: "Expert team delivers results" },
    { step: "04", title: "Optimization", desc: "Continuous improvement and reporting" }
  ];

  return (
    <div className="py-16 bg-[#11111f]">
      <div className="container mx-auto px-5">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Our {serviceType} Process
            {isLocationBased && <span className="text-cyan-400"> in {location}</span>}
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            A systematic approach to deliver exceptional results for your business
          </p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((step, index) => (
            <div key={index} className="relative">
              <div className="bg-[#1a1a2e] p-6 rounded-xl border border-gray-800">
                <span className="text-4xl font-bold text-cyan-400/30">{step.step}</span>
                <h3 className="text-xl font-bold mt-2 mb-2">{step.title}</h3>
                <p className="text-gray-400 text-sm">{step.desc}</p>
              </div>
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-1/2 -right-3 text-2xl text-gray-600">→</div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
