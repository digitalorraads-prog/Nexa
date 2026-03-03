import { Link } from "react-router-dom";
import { useEffect, useState } from "react";

export default function NotFoundSection() {
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      setAnimate(true);
    }, 200);
  }, []);

  return (
    <section className="min-h-screen flex flex-col items-center justify-center bg-[#0c0c16] text-white relative overflow-hidden px-6 ">
      
      {/* Background Glow */}
      <div className="absolute -top-20 -left-20 w-80 h-80 bg-cyan-500/20 rounded-full blur-3xl animate-pulse " />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl animate-pulse" />

      {/* Content */}
      <div
        className={`text-center transition-all duration-1000 ${
          animate ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10 "
        }`}
      >
        <h1 className="text-7xl md:text-9xl font-extrabold bg-gradient-to-r from-cyan-400 to-blue-600 bg-clip-text text-transparent animate-bounce mt-25">
          404
        </h1>

        <h2 className="text-2xl md:text-3xl font-semibold mt-6 mb-4">
          Oops! Page Not Found
        </h2>

        <p className="text-gray-400 max-w-md mx-auto mb-8">
          The page you are looking for might have been removed,
          had its name changed, or is temporarily unavailable.
        </p>

        <Link
          to="/"
          className="px-6 py-3 rounded-full bg-gradient-to-r from-[#004C7D] to-[#158EB0] font-semibold hover:-translate-y-1 transition inline-block"
        >
          Back To Home
        </Link>
      </div>
    </section>
  );
}
