import { useEffect, useRef, useState } from "react";

export default function Testimonials() {
  const testimonials = [
    {
      name: "Rahul Sharma",
      role: "Startup Founder",
      review:
        "Their SEO strategy boosted our traffic by 300% in just 4 months. Highly recommended!",
      avatar: "https://randomuser.me/api/portraits/men/32.jpg",
    },
    {
      name: "Priya Verma",
      role: "E-commerce Owner",
      review:
        "Our sales doubled after running their PPC campaigns. Incredible ROI and support.",
      avatar: "https://randomuser.me/api/portraits/women/44.jpg",
    },
    {
      name: "Amit Singh",
      role: "Marketing Head",
      review:
        "Professional team with strong strategy execution. They truly understand branding.",
      avatar: "https://randomuser.me/api/portraits/men/65.jpg",
    },
  ];

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

  return (
    <section
      ref={sectionRef}
      className="relative py-24 bg-[#0d0d1a] text-white overflow-hidden"
    >
      <div className="absolute -top-20 -right-20 w-72 h-72 bg-cyan-500/20 rounded-full blur-3xl animate-pulse" />

      {/* Heading */}
      <div
        className={`text-center mb-16 px-6 transition-all duration-1000 ${
          visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
        }`}
      >
        <h2 className="text-4xl md:text-5xl font-extrabold mb-4">
          Client{" "}
          <span className="bg-linear-to-r from-cyan-400 to-blue-600 bg-clip-text text-transparent">
            Testimonials
          </span>
        </h2>
        <p className="text-gray-400 max-w-2xl mx-auto">
          What our happy clients say about our digital marketing expertise.
        </p>
      </div>

      {/* Testimonials Grid */}
      <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-2 lg:grid-cols-3 gap-10">
        {testimonials.map((item, index) => (
          <div
            key={index}
            className={`p-8 rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10
              transition-all duration-700 hover:-translate-y-3 hover:shadow-2xl hover:shadow-cyan-500/20
              ${
                visible
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-16"
              }`}
            style={{ transitionDelay: `${index * 150}ms` }}
          >
            <p className="text-gray-300 text-sm leading-relaxed mb-6">
              “{item.review}”
            </p>

            <div className="flex items-center gap-4">
              <img
                src={item.avatar}
                alt={item.name}
                className="w-12 h-12 rounded-full border border-cyan-400"
              />
              <div>
                <h4 className="font-bold">{item.name}</h4>
                <p className="text-gray-400 text-xs">{item.role}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
