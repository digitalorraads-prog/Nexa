import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";


export default function Pricing() {
  const sectionRef = useRef(null);
  const [visible, setVisible] = useState(false);

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

  const plans = [
    {
      title: "SEO",
      oldPrice: 250,
      price: 150,
      duration: "Monthly",
      features: [
        "Content Optimization",
        "On-Page Optimization",
        "Initial Keyword Ranking",
      ],
    },
    {
      title: "WEB DESIGN",
      oldPrice: 300,
      price: 200,
      duration: "Per Website",
      features: [
        "Up to 5 Pages Content",
        "SEO Friendly Website",
        "Responsive Design",
      ],
    },
    {
      title: "GRAPHIC DESIGN",
      oldPrice: 150,
      price: 100,
      duration: "Per Month",
      features: [
        "1 Logo",
        "Social Media Post",
        "Brochure",
      ],
    },
    {
      title: "SOCIAL MEDIA",
      oldPrice: 150,
      price: 100,
      duration: "Monthly",
      features: [
        "Instagram",
        "Facebook",
        "LinkedIn",
      ],
    },
  ];

  return (
    <section
      ref={sectionRef}
      className="relative py-28 bg-[#0f0f1c] text-white overflow-hidden"
    >
      {/* Glow Background */}
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-cyan-500/20 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl animate-pulse"></div>

      {/* Heading */}
      <div
        className={`text-center mb-20 px-6 transition-all duration-1000 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`}
      >
        <h2 className="text-4xl md:text-6xl font-extrabold mb-6">
          Our{" "}
          <span className="bg-gradient-to-r from-cyan-400 to-blue-600 bg-clip-text text-transparent">
            Pricing Plans
          </span>
        </h2>
        <p className="text-gray-400 max-w-2xl mx-auto">
          Choose a plan that fits your business goals and scale with confidence.
        </p>
      </div>

      {/* Pricing Grid */}
      <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 lg:grid-cols-4 gap-10">
        {plans.map((plan, index) => (
          <div
            key={index}
            className={`relative group p-8 rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10
              transition-all duration-700 transform hover:-translate-y-6
              hover:shadow-[0_0_40px_rgba(34,211,238,0.4)]
              ${visible
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-20"
              }`}
            style={{ transitionDelay: `${index * 150}ms` }}
          >
            {/* Popular Badge */}
            <div className="absolute -top-4 right-4 bg-gradient-to-r from-cyan-400 to-blue-600 text-black text-xs font-bold px-3 py-1 rounded-full shadow-lg">
              Popular
            </div>

            {/* Title */}
            <h3 className="text-xl font-bold mb-4 group-hover:text-cyan-400 transition">
              {plan.title}
            </h3>

            {/* Price */}
            <div className="mb-6">
              <span className="text-gray-400 line-through text-lg">
                ${plan.oldPrice}
              </span>
              <div className="text-4xl font-extrabold text-cyan-400">
                ${plan.price}
              </div>
              <div className="text-sm text-gray-400">{plan.duration}</div>
            </div>

            {/* Features */}
            <ul className="space-y-3 mb-6 text-sm text-gray-300">
              {plan.features.map((feature, i) => (
                <li key={i} className="flex items-center gap-2">
                  <span className="text-cyan-400">✔</span> {feature}
                </li>
              ))}
            </ul>

            {/* Button */}
            <Link to="/contact" className="w-full py-3 px-5 rounded-full bg-gradient-to-r from-[#004C7D] to-[#158EB0] font-semibold transition hover:scale-105">
              Know More
            </Link>
          </div>
        ))}
      </div>
    </section>
  );
}
