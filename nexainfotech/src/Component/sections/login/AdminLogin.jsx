import { useState } from "react";
import axios from "../../../Protected/axios"; // 👈 axios instance use karo
import { useNavigate } from "react-router-dom";

export default function AdminLogin() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(""); // Optional: Add error state for better UX

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    // Clear error when user starts typing
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await axios.post("/api/admin/login", formData);
      
      // You could store user data in context/localStorage if needed
      // localStorage.setItem("admin", JSON.stringify(response.data.user));
      
      alert("Login Successful ✅");
      navigate("/admin/dashboard");

    } catch (err) {
      // More specific error handling
      if (err.response?.status === 401) {
        setError("Invalid email or password");
      } else if (err.response?.status === 403) {
        setError("Account locked. Please contact support.");
      } else if (err.code === "ERR_NETWORK") {
        setError("Network error. Please check your connection.");
      } else {
        setError("Login failed. Please try again.");
      }
      
      // You can keep the alert or remove it since we have error state
      // alert("Invalid Credentials ❌");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0c0c16] px-6 text-white">
      <div className="w-full max-w-5xl grid md:grid-cols-2 bg-[#111827] rounded-3xl shadow-2xl overflow-hidden">
        
        {/* Left side - Login Form */}
        <div className="p-12 flex flex-col justify-center">
          <h2 className="text-3xl font-bold mb-6">
            Admin <span className="text-cyan-400">Login</span>
          </h2>

          <p className="text-gray-400 mb-8">
            Sign in to manage your dashboard and website content.
          </p>

          {/* Error Message */}
          {error && (
            <div className="mb-4 p-3 bg-red-500/20 border border-red-500 rounded-lg text-red-400 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <input
              type="email"
              name="email"
              placeholder="Email Address"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-xl bg-[#1f2937] border border-gray-700 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400 outline-none transition"
              required
              disabled={loading}
            />

            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-xl bg-[#1f2937] border border-gray-700 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400 outline-none transition"
              required
              disabled={loading}
            />

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-cyan-500 hover:bg-cyan-600 py-3 rounded-xl font-semibold transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Logging in...
                </>
              ) : (
                "Login"
              )}
            </button>

            {/* Optional: Forgot password link */}
            <div className="text-center mt-4">
              <button 
                type="button"
                onClick={() => alert("Please contact admin to reset password")}
                className="text-sm text-gray-400 hover:text-cyan-400 transition"
              >
                Forgot Password?
              </button>
            </div>
          </form>
        </div>

        {/* Right side - Welcome Message */}
        <div className="hidden md:flex items-center justify-center bg-gradient-to-br from-cyan-500/20 to-blue-600/20 backdrop-blur-xl p-12">
          <div className="text-center">
            <h2 className="text-3xl font-bold mb-4 text-cyan-400">
              Welcome Back!
            </h2>

            <p className="text-gray-300 mb-6">
              Secure admin access to manage blogs, services,
              and digital marketing campaigns.
            </p>

            <div className="w-24 h-24 mx-auto bg-cyan-500/20 rounded-full flex items-center justify-center text-4xl">
              🔐
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}