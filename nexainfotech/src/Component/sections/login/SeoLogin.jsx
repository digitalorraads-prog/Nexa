import { useState } from "react";
import axios from "../../../Protected/axios";
import { useNavigate } from "react-router-dom";

export default function SeoLogin() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await axios.post("/api/seo/login", formData);
      alert("SEO Login Successful ✅");
      navigate("/seo/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed ❌");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0c0c16] px-6 text-white">
      <div className="w-full max-w-5xl grid md:grid-cols-2 bg-[#111827] rounded-3xl shadow-2xl overflow-hidden">
        <div className="p-12 flex flex-col justify-center border-r border-gray-800">
          <h2 className="text-3xl font-bold mb-6">
            SEO <span className="text-cyan-400">Panel Login</span>
          </h2>
          <p className="text-gray-400 mb-8">Sign in to manage page titles and meta descriptions.</p>
          {error && <div className="mb-4 p-3 bg-red-500/20 border border-red-500 rounded-lg text-red-400 text-sm">{error}</div>}
          <form onSubmit={handleSubmit} className="space-y-5">
            <input
              type="email"
              name="email"
              placeholder="SEO Email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-xl bg-[#1f2937] border border-gray-700 focus:border-cyan-400 outline-none transition"
              required
            />
            <input
              type="password"
              name="password"
              placeholder="SEO Password"
              value={formData.password}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-xl bg-[#1f2937] border border-gray-700 focus:border-cyan-400 outline-none transition"
              required
            />
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-cyan-500 hover:bg-cyan-600 py-4 rounded-xl font-bold transition flex items-center justify-center gap-2"
            >
              {loading ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div> : "Enter SEO Panel"}
            </button>
          </form>
        </div>
        <div className="hidden md:flex items-center justify-center bg-[#0c0c16]">
          <div className="text-center p-12">
            <div className="text-7xl mb-6">🔍</div>
            <h3 className="text-2xl font-bold text-cyan-400 mb-4">SEO Specialist</h3>
            <p className="text-gray-400">Take control of search rankings and meta optimization for Nexa Infotech.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
