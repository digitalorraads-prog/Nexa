import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";

/* Animated Counter Component */
function Counter({ target, duration = 2000 }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let start = 0;
    const end = parseInt(target);
    const incrementTime = 20;
    const totalSteps = duration / incrementTime;
    const step = end / totalSteps;

    const timer = setInterval(() => {
      start += step;
      if (start >= end) {
        start = end;
        clearInterval(timer);
      }
      setCount(Math.floor(start));
    }, incrementTime);

    return () => clearInterval(timer);
  }, [target, duration]);

  return <span>{count}+</span>;
}

export default function AboutSection() {
  const sectionRef = useRef(null);
  const [visible, setVisible] = useState(false);

  /* Scroll Reveal Animation */
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
        }
      },
      { threshold: 0.2 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <>


      <section
        ref={sectionRef}
        className="min-h-screen bg-[#0c0c16] text-white pt-32 pb-20 px-6 relative overflow-hidden"
      >
        {/* Background Glow Effects */}
        <div className="absolute -top-20 -left-20 w-80 h-80 bg-cyan-500/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl animate-pulse" />

        {/* About Content */}
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-center">
          
          {/* Left Content */}
          <div
            className={`transition-all duration-1000 ${
              visible ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-10"
            }`}
          >
            <h1 className="text-4xl md:text-5xl font-extrabold mb-6">
              About{" "}
              <span className="bg-gradient-to-r from-cyan-400 to-blue-600 bg-clip-text text-transparent">
                Our Company
              </span>
            </h1>

            <p className="text-gray-400 leading-relaxed mb-6">
              We are a results-driven digital marketing and web development agency 
              dedicated to helping businesses grow online. Our team combines creativity, 
              technology, and data to deliver measurable success.
            </p>

            <p className="text-gray-400 leading-relaxed mb-8">
              From SEO and performance marketing to custom website development, 
              we craft strategies that elevate brands and maximize ROI.
            </p>

            <Link to="/contact" className="px-6 py-3 rounded-full bg-gradient-to-r from-[#004C7D] to-[#158EB0] font-semibold hover:-translate-y-1 transition">
              Contact Us
            </Link>
          </div>

          {/* Right Image */}
          <div
            className={`transition-all duration-1000 delay-300 ${
              visible ? "opacity-100 translate-x-0" : "opacity-0 translate-x-10"
            }`}
          >
            <img
              src="https://images.unsplash.com/photo-1556761175-b413da4baf72"
              alt="Team Work"
              className="rounded-2xl shadow-2xl"
            />
          </div>
        </div>

        {/* Stats Section */}
        <div className="max-w-6xl mx-auto mt-24 grid md:grid-cols-3 gap-8 text-center">
          {[
            { number: 150, label: "Projects Completed" },
            { number: 100, label: "Happy Clients" },
            { number: 5, label: "Years Experience" },
          ].map((item, index) => (
            <div
              key={index}
              className="p-8 rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 hover:-translate-y-3 transition duration-500"
            >
              <h2 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-blue-600 bg-clip-text text-transparent">
                <Counter target={item.number} />
              </h2>
              <p className="text-gray-400 mt-2">{item.label}</p>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
