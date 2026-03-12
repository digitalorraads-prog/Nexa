import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "../../Protected/axios";

function SeoDashboard() {
  const navigate = useNavigate();
  const [userEmail, setUserEmail] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get("/api/seo/check-auth");
        setUserEmail(response.data.user.email);
      } catch (err) {
        navigate("/seo/login");
      }
    };
    fetchUser();
  }, [navigate]);

  return (
    <div className="bg-[#0c0c16] text-white p-6 rounded-xl border border-gray-800 shadow-xl">
      {/* Header */}
      <div className="mb-10">
        <h1 className="text-3xl font-bold">
          SEO <span className="text-cyan-400">Dashboard</span>
        </h1>
        <p className="text-gray-400 mt-2">
          Welcome back, <span className="text-cyan-400">{userEmail}</span>! 
          Manage your website's search engine presence here.
        </p>
      </div>

      {/* Dashboard Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        <DashboardCard
          title="SEO Manager"
          link="/admin/seo"
          description="Update meta titles and descriptions for all pages."
          icon="🔍"
        />
      </div>
    </div>
  );
}

// Reusable DashboardCard to match AdminDashboard
function DashboardCard({ title, link, description, icon }) {
  return (
    <Link
      to={link}
      className="bg-[#111827] p-8 rounded-2xl shadow-xl hover:shadow-cyan-500/20 hover:scale-105 transition duration-300 border border-gray-800 hover:border-cyan-400 group"
    >
      <div className="flex items-start justify-between mb-4">
        <span className="text-3xl">{icon}</span>
        <svg
          className="w-5 h-5 text-gray-500 group-hover:text-cyan-400 group-hover:translate-x-1 transition-all"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </div>
      <h2 className="text-xl font-semibold text-cyan-400 mb-2">
        {title}
      </h2>
      <p className="text-gray-400 text-sm">
        {description}
      </p>
    </Link>
  );
}

export default SeoDashboard;
