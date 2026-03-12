import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import axios from "../../Protected/axios";

export default function AdminLayout({ children }) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [adminEmail, setAdminEmail] = useState("");
    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        // Optionally fetch admin email if needed for topbar
        const fetchAdmin = async () => {
            try {
                const response = await axios.get("/api/admin/check-auth");
                if (response.data.authenticated) {
                    setAdminEmail(response.data.admin?.email || "Admin");
                }
            } catch (err) {
                // Will be handled by ProtectedRoute, just ignore here
            }
        };
        fetchAdmin();
    }, []);

    const handleLogout = async () => {
        try {
            await axios.post("/api/admin/logout");
            localStorage.removeItem("navbarItems");
            localStorage.removeItem("user");
            navigate("/admin/login");
        } catch (error) {
            if (error.code === 'ERR_NETWORK') {
                localStorage.clear();
                navigate("/admin/login");
            }
        }
    };

    const menuItems = [
        { name: "Dashboard", path: "/admin/dashboard", icon: "📊" },
        { name: "Manage Blogs", path: "/admin/manage-blogs", icon: "📚" },
        { name: "Add Blog", path: "/admin/add-blog", icon: "✍️" },
        { name: "Manage Services", path: "/admin/services", icon: "🛠️" },
        { name: "Add Service", path: "/admin/add-service", icon: "➕" },
        { name: "Manage Portfolio", path: "/admin/manage-portfolio", icon: "🖼️" },
        { name: "Add Portfolio", path: "/admin/add-portfolio", icon: "🎨" },
        { name: "Edit Navbar", path: "/admin/navbar-editor", icon: "🔗" },
        { name: "Pages & Heroes", path: "/admin/hero", icon: "🎬" },
        { name: "SEO Users", path: "/admin/manage-seo-users", icon: "👥" },
        { name: "Contacts", path: "/admin/contact", icon: "📧" },
    ];

    return (
        <div className="min-h-screen bg-[#0c0c16] text-white flex">
            {/* Sidebar */}
            <div
                className={`fixed inset-y-0 left-0 bg-[#111827] border-r border-gray-800 transition-all duration-300 z-50 overflow-y-auto overflow-x-hidden ${isSidebarOpen ? "w-64" : "w-20"
                    }`}
            >
                <div className="flex items-center justify-between p-4 border-b border-gray-800 h-16">
                    <img
                        src="/nexa-infotech-logo.webp"
                        alt="Nexa Logo"
                        className={`h-8 transition-opacity duration-300 ${isSidebarOpen ? "opacity-100" : "opacity-0 hidden"
                            }`}
                    />
                    <button
                        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                        className="p-2 bg-gray-800 rounded-md hover:bg-gray-700 text-gray-300 flex-shrink-0"
                    >
                        {isSidebarOpen ? (
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" /></svg>
                        ) : (
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" /></svg>
                        )}
                    </button>
                </div>
                <nav className="p-4 space-y-2 mt-2">
                    {menuItems.map((item) => {
                        const isActive = location.pathname === item.path;
                        return (
                            <Link
                                key={item.path}
                                to={item.path}
                                className={`flex items-center px-3 py-3 rounded-lg transition-all duration-200 group ${isActive
                                    ? "bg-cyan-500/10 text-cyan-400 border border-cyan-500/30"
                                    : "text-gray-400 hover:bg-white/5 hover:text-white border border-transparent"
                                    }`}
                                title={!isSidebarOpen ? item.name : ""}
                            >
                                <span className="text-xl flex-shrink-0">{item.icon}</span>
                                <span
                                    className={`ml-3 whitespace-nowrap font-medium transition-all duration-300 ${isSidebarOpen ? "opacity-100 block" : "opacity-0 hidden"
                                        }`}
                                >
                                    {item.name}
                                </span>
                            </Link>
                        );
                    })}
                </nav>
            </div>

            {/* Main Content Area */}
            <div
                className={`flex-1 flex flex-col min-h-screen transition-all duration-300 ${isSidebarOpen ? "ml-64" : "ml-20"
                    }`}
            >
                {/* Top Navbar */}
                <header className="h-16 bg-[#111827] border-b border-gray-800 flex items-center justify-between px-6 sticky top-0 z-40">
                    <div className="text-gray-400">
                        <span className="text-sm font-medium">Hello, <span className="text-cyan-400">{adminEmail || "Admin"}</span></span>
                    </div>
                    <div className="flex items-center gap-4">
                        <Link
                            to="/"
                            target="_blank"
                            className="px-4 py-2 text-sm font-medium text-gray-300 bg-gray-800 rounded-lg hover:bg-gray-700 transition"
                        >
                            View Website
                        </Link>
                        <button
                            onClick={handleLogout}
                            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 transition"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
                            Logout
                        </button>
                    </div>
                </header>

                {/* Page Content */}
                <main className="flex-1 overflow-x-hidden p-6">
                    <div className="bg-[#0c0c16] rounded-xl relative">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
}
