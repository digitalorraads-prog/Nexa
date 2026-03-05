// src/pages/admin/AdminDashboardPage.jsx
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "../../Protected/axios";

function AdminDashboardPage() {
  const navigate = useNavigate();
  const [adminEmail, setAdminEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [authChecking, setAuthChecking] = useState(true);

  // Check if admin is logged in
  useEffect(() => {
    const checkAuth = async () => {
      try {

        const response = await axios.get("/api/admin/check-auth");


        if (response.data.authenticated) {
          setAdminEmail(response.data.admin?.email || "Admin");

        } else {
          console.log("User not authenticated, redirecting to login");
          navigate("/admin/login");
        }
      } catch (error) {
        console.error("Auth check failed:", error);

        // Agar error 401 hai to bhi login pe bhejo
        if (error.response?.status === 401) {
          navigate("/admin/login");
        } else {
          // Network error ya koi aur issue
          alert("Server connection failed. Please check if backend is running.");
        }
      } finally {
        setAuthChecking(false);
      }
    };

    checkAuth();
  }, [navigate]);

  const handleLogout = async () => {
    setLoading(true);
    try {
      console.log("Logging out...");
      const response = await axios.post("/api/admin/logout");
      console.log("Logout response:", response.data);

      // Clear any local storage
      localStorage.removeItem("navbarItems");
      localStorage.removeItem("user");

      // Redirect to login
      navigate("/admin/login");
    } catch (error) {
      console.error("Logout error:", error);

      // Agar network error hai to bhi force logout kar do
      if (error.code === 'ERR_NETWORK') {
        alert("Network error. Logging out locally.");
        localStorage.clear();
        navigate("/admin/login");
      } else {
        alert("Logout failed. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  // Agar auth checking ho rahi hai to loading dikhao
  if (authChecking) {
    return (
      <div className="min-h-screen bg-[#0c0c16] flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400">Checking authentication...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0c0c16] text-white px-8 py-24">
      {/* Header with Welcome and Logout Button */}
      <div className="flex justify-between items-center mb-12">
        <div>
          <h1 className="text-3xl font-bold">
            Admin <span className="text-cyan-400">Dashboard</span>
          </h1>
          <p className="text-gray-400 mt-2">
            Welcome back, <span className="text-cyan-400">{adminEmail}</span>!
            Manage your website content from here.
          </p>
        </div>

        {/* Logout Button */}
        <button
          onClick={handleLogout}
          disabled={loading}
          className="flex items-center gap-2 px-6 py-3 bg-red-600 hover:bg-red-700 rounded-lg font-medium transition disabled:opacity-50"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
            />
          </svg>
          {loading ? "Logging out..." : "Logout"}
        </button>
      </div>

      {/* Dashboard Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        <DashboardCard
          title="Manage Blogs"
          link="/admin/manage-blogs"
          description="Edit or delete existing blog posts"
          icon="📚"
        />
        <DashboardCard
          title="Manage Contacts"
          link="/admin/contact"
          description="View and respond to contact inquiries"
          icon="📧"
        />

        <DashboardCard
          title="Manage Services"
          link="/admin/services"
          description="Update or remove existing services"
          icon="🛠️"
        />

        <DashboardCard
          title="Edit Navbar"
          link="/admin/navbar-editor"
          description="Customize navigation menu items"
          icon="🔗"
        />
        <DashboardCard
          title="Manage Portfolio"
          link="/admin/manage-portfolio"
          description="Organize your portfolio items"
          icon="🖼️"
        />
        <DashboardCard
          title="Hero Section Manager"
          link="/admin/hero"
          description="Update the hero section content and images"
          icon="🎬"
        />
        <DashboardCard
          title="Pages Editor"
          link="/admin/pages"
          description="Edit static pages like About Us, Contact, etc."
          icon="📄"
        />
      </div>

      {/* Footer */}
      <div className="mt-12 pt-6 border-t border-gray-800 text-center text-gray-500 text-sm">
        <p>© 2024 Nexa Infotech. All rights reserved.</p>
      </div>
    </div>
  );
}

// Updated DashboardCard with icon and description
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
        {description || `Click here to manage ${title.toLowerCase()}.`}
      </p>
    </Link>
  );
}

export default AdminDashboardPage;