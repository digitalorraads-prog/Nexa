import { useState } from "react";
import axios from "axios";

export default function AdminRegister() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const { data } = await axios.post(
        "http://localhost:5000/api/admin/register",
        formData
      );

      alert("Registration Successful ✅");
      console.log(data);

      // Optional: Reset Form
      setFormData({
        name: "",
        email: "",
        password: "",
      });

    } catch (error) {
      alert(error.response?.data?.message || "Registration Failed ❌");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0c0c16] px-6 text-white">

      <div className="w-full max-w-5xl grid md:grid-cols-2 bg-[#111827] rounded-3xl shadow-2xl overflow-hidden">

        {/* LEFT SIDE - FORM */}
        <div className="p-12 flex flex-col justify-center">
          <h2 className="text-3xl font-bold mb-6">
            Admin <span className="text-cyan-400">Register</span>
          </h2>

          <p className="text-gray-400 mb-8">
            Create a new admin account to manage your dashboard.
          </p>

          <form onSubmit={handleSubmit} className="space-y-5">

            <input
              type="text"
              name="name"
              placeholder="Full Name"
              value={formData.name}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-xl bg-[#1f2937] border border-gray-700 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400 outline-none transition"
              required
            />

            <input
              type="email"
              name="email"
              placeholder="Email Address"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-xl bg-[#1f2937] border border-gray-700 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400 outline-none transition"
              required
            />

            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-xl bg-[#1f2937] border border-gray-700 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400 outline-none transition"
              required
            />

            <button
              type="submit"
              className="w-full bg-cyan-500 hover:bg-cyan-600 py-3 rounded-xl font-semibold transition"
            >
              Register
            </button>
          </form>
        </div>

        {/* RIGHT SIDE - DESIGN PANEL */}
        <div className="hidden md:flex items-center justify-center bg-gradient-to-br from-cyan-500/20 to-blue-600/20 backdrop-blur-xl p-12">

          <div className="text-center">
            <h2 className="text-3xl font-bold mb-4 text-cyan-400">
              Create Account
            </h2>

            <p className="text-gray-300 mb-6">
              Secure admin registration to manage blogs, services,
              and digital marketing campaigns.
            </p>

            <div className="w-24 h-24 mx-auto bg-cyan-500/20 rounded-full flex items-center justify-center text-4xl">
              📝
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
