import { useEffect, useRef, useState } from "react";

export default function OurExperts() {
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

  const experts = [
    {
      name: "Jeffrey Brown",
      role: "Graphic Designer",
      quote:
        "There are three responses to a piece of design – Yes, No and WOW! Wow is the one we are aiming for.",
      img: "https://randomuser.me/api/portraits/men/45.jpg",
    },
    {
      name: "Ann Richmond",
      role: "Website Designer",
      quote:
        "Your website is the center of your digital eco-system, like a brick and mortar location.",
      img: "https://randomuser.me/api/portraits/women/68.jpg",
    },
    {
      name: "Alex Greenfield",
      role: "Digital Marketing",
      quote:
        "Like a website is the heart, digital marketing is the heartbeat of that website.",
      img: "https://randomuser.me/api/portraits/men/32.jpg",
    },
  ];

  return (
    <section
      ref={sectionRef}
      className="relative py-18 bg-[#0f0f1c] text-white overflow-hidden"
    >
      {/* Glow Background */}
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-cyan-500/20 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl animate-pulse"></div>

      {/* Heading */}
      <div
        className={`text-center mb-20 px-6 transition-all duration-1000 ${
          visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
        }`}
      >
        <h2 className="text-4xl md:text-6xl font-extrabold mb-4">
          Our{" "}
          <span className="bg-linear-to-r from-cyan-400 to-blue-600 bg-clip-text text-transparent">
            Experts
          </span>
        </h2>

        <h3 className="text-xl text-gray-300 mb-4">
          Web Development Agency in India
        </h3>

        <p className="text-gray-400 max-w-2xl mx-auto">
          We like helping people achieve their dreams just like they helped us by trusting us.
        </p>
      </div>

      {/* Experts Grid */}
      <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 lg:grid-cols-3 gap-12">
        {experts.map((expert, index) => (
          <div
            key={index}
            className={`group relative p-8 rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10
              transition-all duration-700 transform hover:-translate-y-6
              hover:shadow-[0_0_40px_rgba(34,211,238,0.4)]
              ${
                visible
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-20"
              }`}
            style={{ transitionDelay: `${index * 150}ms` }}
          >
            {/* Profile Image */}
            <div className="relative w-28 h-28 mx-auto mb-6">
              <img
                src={expert.img}
                alt={expert.name}
                className="w-full h-full object-cover rounded-full border-4 border-cyan-400/40 transition duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 rounded-full bg-cyan-400/10 blur-xl opacity-0 group-hover:opacity-100 transition"></div>
            </div>

            {/* Name */}
            <h3 className="text-xl font-bold text-center mb-1 group-hover:text-cyan-400 transition">
              {expert.name}
            </h3>

            {/* Role */}
            <p className="text-center text-sm text-gray-400 mb-4">
              {expert.role}
            </p>

            {/* Quote */}
            <p className="text-gray-300 text-sm leading-relaxed text-center italic">
              "{expert.quote}"
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
