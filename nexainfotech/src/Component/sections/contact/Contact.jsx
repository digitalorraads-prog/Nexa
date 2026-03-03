import { useState } from "react";
import axios from "../../../Protected/axios"; // 👈 custom axios instance import karo

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
      // ✅ FIXED: "/api/contact" use karo (singular), "/api/contacts" nahi
      const response = await axios.post("/api/contact", formData);
      
      console.log("Response:", response.data); // Debug ke liye

      alert("Message Sent Successfully 🚀");

      setFormData({
        name: "",
        phone: "",
        email: "",
        message: "",
      });

    } catch (error) {
      console.error("Contact form error:", error);
      // Better error message
      const errorMsg = error.response?.data?.message || "Failed to send message ❌";
      alert(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="relative bg-[#0f0f1a] min-h-screen text-white py-28 px-6">

      <div className="max-w-6xl mx-auto">

        {/* Heading */}
        <div className="text-center mb-20">
          <h1 className="text-5xl font-extrabold text-cyan-400 mb-4">
            Get In Touch
          </h1>
          <p className="text-gray-400 text-lg">We'd love to hear from you</p>
        </div>

        <div className="grid md:grid-cols-2 gap-16 items-stretch">

          {/* LEFT SIDE */}
          <div className="relative rounded-3xl overflow-hidden border border-white/10 h-full">

            {/* Background with overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-cyan-900/20 to-purple-900/20"></div>
            
            <img
              src="https://images.unsplash.com/photo-1521791136064-7986c2920216?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
              alt="office"
              className="absolute inset-0 w-full h-full object-cover"
              onError={(e) => {
                e.target.src = "https://via.placeholder.com/800x600/1a1a2e/ffffff?text=Contact+Us";
              }}
            />

            <div className="absolute inset-0 bg-black/70 backdrop-blur-sm"></div>

            <div className="relative z-10 p-10 flex flex-col justify-between h-full">

              <div>

                {/* Clickable Logo */}
                <div className="flex justify-center mb-10">
                  <a
                    href="https://nexainfotech.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:scale-105 transition duration-300"
                  >
                    <img
                      src="https://nexainfotech.com/wp-content/uploads/2022/06/nexa-infotech-logo.png"
                      alt="Company Logo"
                      className="h-20 object-contain"
                      onError={(e) => {
                        e.target.src = "https://via.placeholder.com/200x80/0f0f1a/cyan?text=NEXA";
                      }}
                    />
                  </a>
                </div>

                <h3 className="text-3xl font-semibold text-cyan-400 mb-8 text-center">
                  Contact Information
                </h3>

                <div className="space-y-8">

                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-cyan-500/20 rounded-lg flex items-center justify-center">
                      <span className="text-cyan-400 text-xl">📍</span>
                    </div>
                    <div>
                      <p className="text-gray-400 text-sm mb-1">Address</p>
                      <p className="text-lg">Your Company Name, India</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-cyan-500/20 rounded-lg flex items-center justify-center">
                      <span className="text-cyan-400 text-xl">📞</span>
                    </div>
                    <div>
                      <p className="text-gray-400 text-sm mb-1">Phone</p>
                      <p className="text-lg">
                        <a href="tel:+919876543210" className="hover:text-cyan-400 transition">
                          +91 98765 43210
                        </a>
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-cyan-500/20 rounded-lg flex items-center justify-center">
                      <span className="text-cyan-400 text-xl">✉</span>
                    </div>
                    <div>
                      <p className="text-gray-400 text-sm mb-1">Email</p>
                      <p className="text-lg">
                        <a href="mailto:info@yourcompany.com" className="hover:text-cyan-400 transition">
                          info@yourcompany.com
                        </a>
                      </p>
                    </div>
                  </div>

                </div>
              </div>

              <div className="mt-10 pt-6 border-t border-white/10">
                <p className="text-gray-400 text-sm text-center">
                  ⏰ We usually respond within 24 hours
                </p>
              </div>

            </div>
          </div>

          {/* RIGHT SIDE FORM */}
          <form
            onSubmit={handleSubmit}
            className="bg-white/5 p-10 rounded-3xl border border-white/10 backdrop-blur-md h-full flex flex-col"
          >
            <div className="space-y-6">

              <div>
                <label className="block mb-2 text-sm font-medium text-gray-300">
                  Full Name <span className="text-cyan-400">*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="John Doe"
                  className="w-full px-5 py-3 bg-[#141428] border border-white/10 rounded-xl focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition text-white placeholder-gray-500"
                />
              </div>

              <div>
                <label className="block mb-2 text-sm font-medium text-gray-300">
                  Phone Number <span className="text-cyan-400">*</span>
                </label>
                <input
                  type="tel"
                  name="phone"
                  required
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="+91 98765 43210"
                  className="w-full px-5 py-3 bg-[#141428] border border-white/10 rounded-xl focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition text-white placeholder-gray-500"
                />
              </div>

              <div>
                <label className="block mb-2 text-sm font-medium text-gray-300">
                  Email Address <span className="text-cyan-400">*</span>
                </label>
                <input
                  type="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="john@example.com"
                  className="w-full px-5 py-3 bg-[#141428] border border-white/10 rounded-xl focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition text-white placeholder-gray-500"
                />
              </div>

              <div>
                <label className="block mb-2 text-sm font-medium text-gray-300">
                  Message <span className="text-cyan-400">*</span>
                </label>
                <textarea
                  name="message"
                  rows="4"
                  required
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Tell us about your project..."
                  className="w-full px-5 py-3 bg-[#141428] border border-white/10 rounded-xl focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition text-white placeholder-gray-500 resize-none"
                ></textarea>
              </div>

            </div>

            <button
              type="submit"
              disabled={loading}
              className="mt-8 w-full py-4 rounded-full bg-gradient-to-r from-cyan-600 to-blue-600 font-semibold text-white hover:from-cyan-500 hover:to-blue-500 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Sending...
                </span>
              ) : (
                "Send Message →"
              )}
            </button>

            {/* Trust Badge */}
            <p className="text-xs text-center text-gray-500 mt-4">
              Your information is safe with us. We never share your data.
            </p>
          </form>

        </div>
      </div>
    </section>
  );
}