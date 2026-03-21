import { useState } from "react";
import axios from "../../../Protected/axios"; // 👈 custom axios instance

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    message: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axios.post("/api/contact", formData);
      console.log("Response:", response.data);
      alert(response.data.message || "Message Sent Successfully 🚀");
      setFormData({
        name: "",
        phone: "",
        email: "",
        message: "",
      });
    } catch (error) {
      console.error("Contact form error:", error);
      let errorMsg = error.response?.data?.message || "Failed to send message ❌";
      
      if (error.code === 'ECONNABORTED') {
        errorMsg = "Request timed out. Please check your internet or try again later. ⏳";
      } else if (!error.response) {
        errorMsg = "Server unreachable. Please try again later. 🌐";
      }
      
      alert(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="relative bg-[#030712] min-h-screen text-white py-28 px-6 overflow-hidden">
      {/* Font Awesome 6 CDN - Add this in your index.html or here */}
      <link
        rel="stylesheet"
        href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css"
      />

      {/* Animated particles */}
      <div className="particles fixed top-0 left-0 w-full h-full z-0 overflow-hidden">
        {[...Array(12)].map((_, i) => (
          <div
            key={i}
            className="particle absolute w-1 h-1 bg-cyan-400/20 rounded-full"
            style={{
              left: `${[10, 20, 30, 40, 50, 60, 70, 80, 90, 95, 15, 75][i]}%`,
              width: `${[6, 3, 5, 4, 7, 3, 5, 4, 6, 3, 5, 4][i]}px`,
              height: `${[6, 3, 5, 4, 7, 3, 5, 4, 6, 3, 5, 4][i]}px`,
              background:
                i === 1 || i === 5 || i === 11
                  ? "rgba(37, 99, 235, 0.2)"
                  : i === 3 || i === 7 || i === 9
                    ? "rgba(168, 85, 247, 0.2)"
                    : "rgba(6, 182, 212, 0.2)",
              animation: `floatParticle ${[12, 15, 10, 18, 14, 16, 11, 19, 13, 17, 20, 22][i]
                }s infinite linear`,
            }}
          />
        ))}
      </div>

      {/* Gradient orbs */}
      <div className="gradient-orb fixed top-[-30%] right-[-10%] w-[600px] h-[600px] rounded-full bg-gradient-to-r from-cyan-400/15 via-blue-600/10 to-transparent blur-[60px] z-0 animate-orbFloat" />
      <div className="gradient-orb-2 fixed bottom-[-20%] left-[-10%] w-[500px] h-[500px] rounded-full bg-gradient-to-r from-purple-500/12 via-cyan-400/8 to-transparent blur-[60px] z-0 animate-orbFloatReverse" />

      <div className="container max-w-6xl mx-auto relative z-10 flex items-center min-h-[calc(100vh-112px)]">
        <div className="glass-master w-full bg-[rgba(10,15,25,0.6)] backdrop-blur-[20px] border border-white/5 rounded-[48px] p-12 md:p-[60px] shadow-2xl relative overflow-hidden">
          {/* Shimmer line */}
          <div className="absolute top-0 left-[-50%] w-[200%] h-px bg-gradient-to-r from-transparent via-white/10 via-cyan-400/30 to-transparent animate-shimmer" />

          {/* Header */}
          <div className="contact-header text-center max-w-[600px] mx-auto mb-12">
            <div className="live-badge inline-flex items-center gap-2.5 px-5 py-2 bg-cyan-400/10 border border-cyan-400/20 rounded-full mb-6 backdrop-blur">
              <span className="live-dot w-2 h-2 bg-cyan-400 rounded-full animate-pulseShadow" />
              <span className="text-white text-sm font-medium tracking-wide">
                WE'RE HERE TO HELP
              </span>
            </div>
            <h1 className="text-5xl md:text-6xl font-extrabold mb-4 text-white tracking-tight drop-shadow-lg">
              Get In Touch
            </h1>
            <p className="text-white/80 text-lg md:text-xl max-w-[450px] mx-auto">
              Got a question?  We'd love to hear from you.
            </p>
            <div className="gradient-underline w-[120px] h-1 mx-auto mt-6 rounded bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500 bg-[size:300%] animate-gradientMove" />
          </div>

          {/* Contact Cards */}
          <div className="contact-cards grid grid-cols-1 md:grid-cols-3 gap-5 mb-12">
            {/* Call Card */}
            <div className="contact-card bg-white/3 border border-white/5 rounded-[28px] p-7 text-center transition-all duration-300 hover:-translate-y-2 hover:border-cyan-400/30 hover:shadow-[0_20px_30px_-10px_rgba(0,0,0,0.5)] relative overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-br from-cyan-400/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-cyan-400 via-blue-500 to-transparent translate-x-[-100%] group-hover:translate-x-full transition-transform duration-1000" />

              <div className="card-icon w-[65px] h-[65px] mx-auto mb-[18px] bg-cyan-400/10 rounded-full flex items-center justify-center text-2xl text-cyan-400 border border-cyan-400/20 transition-all duration-400 relative group-hover:bg-transparent group-hover:text-white group-hover:scale-110 group-hover:rotate-180 group-hover:border-transparent">
                <div className="absolute inset-[-3px] rounded-full bg-gradient-to-br from-cyan-400 to-blue-500 opacity-0 group-hover:opacity-100 transition-opacity -z-10" />
                <i className="fas fa-phone text-2xl"></i>
              </div>
              <h3 className="text-xl font-semibold mb-2 text-white">Call us</h3>
              <p>
                <a href="tel:+919896384224" className="text-white/80 hover:text-cyan-400 transition text-sm">
                  +91 98963 84224
                </a>
              </p>

            </div>

            {/* Email Card */}
            <div className="contact-card bg-white/3 border border-white/5 rounded-[28px] p-7 text-center transition-all duration-300 hover:-translate-y-2 hover:border-cyan-400/30 hover:shadow-[0_20px_30px_-10px_rgba(0,0,0,0.5)] relative overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-br from-cyan-400/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-cyan-400 via-blue-500 to-transparent translate-x-[-100%] group-hover:translate-x-full transition-transform duration-1000" />

              <div className="card-icon w-[65px] h-[65px] mx-auto mb-[18px] bg-cyan-400/10 rounded-full flex items-center justify-center text-2xl text-cyan-400 border border-cyan-400/20 transition-all duration-400 relative group-hover:bg-transparent group-hover:text-white group-hover:scale-110 group-hover:rotate-180 group-hover:border-transparent">
                <div className="absolute inset-[-3px] rounded-full bg-gradient-to-br from-cyan-400 to-blue-500 opacity-0 group-hover:opacity-100 transition-opacity -z-10" />
                <i className="fas fa-envelope text-2xl"></i>
              </div>
              <h3 className="text-xl font-semibold mb-2 text-white">Email us</h3>
              <p>
                <a href="mailto:info@nexainfotech.com" className="text-white/80 hover:text-cyan-400 transition text-sm">
                  info@nexainfotech.com
                </a>
              </p>
            </div>

            {/* WhatsApp Card */}
            <div className="contact-card bg-white/3 border border-white/5 rounded-[28px] p-7 text-center transition-all duration-300 hover:-translate-y-2 hover:border-cyan-400/30 hover:shadow-[0_20px_30px_-10px_rgba(0,0,0,0.5)] relative overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-br from-cyan-400/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-cyan-400 via-blue-500 to-transparent translate-x-[-100%] group-hover:translate-x-full transition-transform duration-1000" />

              <div className="card-icon w-[65px] h-[65px] mx-auto mb-[18px] bg-cyan-400/10 rounded-full flex items-center justify-center text-2xl text-cyan-400 border border-cyan-400/20 transition-all duration-400 relative group-hover:bg-transparent group-hover:text-white group-hover:scale-110 group-hover:rotate-180 group-hover:border-transparent">
                <div className="absolute inset-[-3px] rounded-full bg-gradient-to-br from-cyan-400 to-blue-500 opacity-0 group-hover:opacity-100 transition-opacity -z-10" />
                <i className="fab fa-whatsapp text-2xl"></i>
              </div>
              <h3 className="text-xl font-semibold mb-2 text-white">WhatsApp</h3>
              <p>
                <a href="https://wa.me/+919896384224" className="text-white/80 hover:text-cyan-400 transition text-sm">
                  +91 98963 84224
                </a>
              </p>

            </div>
          </div>

          {/* Form Section */}
          <div className="form-section mt-12 pt-12 border-t border-white/5">
            <form onSubmit={handleSubmit}>
              <div className="form-row grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
                {/* Name Field */}
                <div className="form-group relative mb-6">
                  <div className="input-wrapper relative flex items-center">
                    <i className="fas fa-user absolute left-[18px] text-cyan-400 opacity-70 z-10 text-lg"></i>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Full name"
                      required
                      className="w-full py-[18px] pl-[52px] pr-[18px] bg-white/2 border border-white/5 rounded-[20px] text-white placeholder-white/25 shadow-inner focus:outline-none focus:border-cyan-400 focus:bg-cyan-400/5 focus:ring-4 focus:ring-cyan-400/10"
                    />
                  </div>
                </div>

                {/* Email Field */}
                <div className="form-group relative mb-6">
                  <div className="input-wrapper relative flex items-center">
                    <i className="fas fa-envelope absolute left-[18px] text-cyan-400 opacity-70 z-10 text-lg"></i>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="Email address"
                      required
                      className="w-full py-[18px] pl-[52px] pr-[18px] bg-white/2 border border-white/5 rounded-[20px] text-white placeholder-white/25 shadow-inner focus:outline-none focus:border-cyan-400 focus:bg-cyan-400/5 focus:ring-4 focus:ring-cyan-400/10"
                    />
                  </div>
                </div>
              </div>

              {/* Phone Number Field */}
              <div className="form-group relative mb-6">
                <div className="input-wrapper relative flex items-center">
                  <i className="fas fa-phone absolute left-[18px] text-cyan-400 opacity-70 z-10 text-lg"></i>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="Phone number"
                    required
                    className="w-full py-[18px] pl-[52px] pr-[18px] bg-white/2 border border-white/5 rounded-[20px] text-white placeholder-white/25 shadow-inner focus:outline-none focus:border-cyan-400 focus:bg-cyan-400/5 focus:ring-4 focus:ring-cyan-400/10"
                  />
                </div>
              </div>



              {/* Message Field */}
              <div className="form-group relative mb-6">
                <div className="input-wrapper relative flex items-start">
                  <i className="fas fa-message absolute left-[18px] top-[22px] text-cyan-400 opacity-70 z-10 text-lg"></i>
                  <textarea
                    name="message"
                    rows="4"
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Your message"
                    required
                    className="w-full py-[18px] pl-[52px] pr-[18px] bg-white/2 border border-white/5 rounded-[20px] text-white placeholder-white/25 shadow-inner focus:outline-none focus:border-cyan-400 focus:bg-cyan-400/5 focus:ring-4 focus:ring-cyan-400/10 resize-none"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-[18px] px-10 bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500 bg-[length:200%] border-none rounded-[30px] text-white text-lg font-semibold cursor-pointer transition-all duration-400 relative overflow-hidden shadow-[0_10px_25px_-5px_rgba(34,211,238,0.3)] hover:-translate-y-1 hover:scale-[1.02] hover:shadow-[0_20px_35px_-5px_rgba(34,211,238,0.5)] disabled:opacity-50 disabled:cursor-not-allowed group"
              >
                <span className="absolute top-0 left-[-100%] w-full h-full bg-gradient-to-r from-transparent via-white/30 to-transparent transition-all duration-600 group-hover:left-full" />
                <span className="flex items-center justify-center gap-3">
                  {loading ? (
                    <>
                      <svg
                        className="animate-spin h-5 w-5 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        />
                      </svg>
                      Sending...
                    </>
                  ) : (
                    <>
                      Send message
                      <i className="fas fa-paper-plane text-xl transition-transform group-hover:translate-x-2 group-hover:rotate-12"></i>
                    </>
                  )}
                </span>
              </button>
            </form>
          </div>


        </div>
      </div>

      {/* Keyframe animations */}
      <style jsx>{`
        @keyframes floatParticle {
          0% { transform: translateY(100vh) translateX(0); opacity: 0; }
          10% { opacity: 0.8; }
          90% { opacity: 0.8; }
          100% { transform: translateY(-100vh) translateX(100px); opacity: 0; }
        }
        @keyframes orbFloat {
          0%, 100% { transform: translate(0, 0) scale(1); }
          50% { transform: translate(30px, 20px) scale(1.1); }
        }
        .animate-orbFloat {
          animation: orbFloat 20s ease-in-out infinite;
        }
        .animate-orbFloatReverse {
          animation: orbFloat 25s ease-in-out infinite reverse;
        }
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        .animate-shimmer {
          animation: shimmer 8s infinite;
        }
        @keyframes pulseShadow {
          0%, 100% { opacity: 1; transform: scale(1); box-shadow: 0 0 12px #22d3ee; }
          50% { opacity: 0.5; transform: scale(1.3); box-shadow: 0 0 20px #22d3ee; }
        }
        .animate-pulseShadow {
          animation: pulseShadow 1.5s ease infinite;
        }
        @keyframes gradientMove {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        .animate-gradientMove {
          animation: gradientMove 4s ease infinite;
        }
        .duration-600 {
          transition-duration: 600ms;
        }
        .duration-1000 {
          transition-duration: 1000ms;
        }
        .group-hover\\:rotate-180 {
          transition: transform 0.4s ease;
        }
        .group:hover .group-hover\\:rotate-180 {
          transform: rotate(180deg);
        }
        .group:hover .group-hover\\:translate-x-2 {
          transform: translateX(0.5rem);
        }
        .group:hover .group-hover\\:rotate-12 {
          transform: rotate(12deg);
        }
        .hover\\:scale-\\[1\\.02\\]:hover {
          transform: scale(1.02);
        }
      `}</style>
    </section>
  );
}