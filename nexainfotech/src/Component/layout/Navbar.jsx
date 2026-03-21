// src/components/Navbar.jsx
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axiosPublic from "../../Protected/axiosPublic";
import axiosProtected from "../../Protected/axios"; // For auth checks and logout

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenu, setMobileMenu] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [activeSubDropdown, setActiveSubDropdown] = useState(null);
  const [activeSubSubDropdown, setActiveSubSubDropdown] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [navItems, setNavItems] = useState([]);
  const [loading, setLoading] = useState(true);

  // Load navbar from DATABASE (backend)
  useEffect(() => {

    loadNavbarFromDatabase();
  }, []);

  // Load from database
  const loadNavbarFromDatabase = async () => {
    try {
      setLoading(true);
      const response = await axiosPublic.get("/api/navbar");


      if (response.data.success) {
        // Database se data mil gaya
        setNavItems(response.data.data);
        // Backup in localStorage
        localStorage.setItem("navbarItems", JSON.stringify(response.data.data));
      } else {
        // Database se data nahi mila to localStorage try karo
        loadNavbarFromStorage();
      }
    } catch (error) {
      console.error("Error loading navbar from database:", error);
      // Fallback to localStorage
      loadNavbarFromStorage();
    } finally {
      setLoading(false);
    }
  };

  // Load from localStorage (fallback)
  const loadNavbarFromStorage = () => {
    try {
      const saved = localStorage.getItem("navbarItems");
      console.log("Loaded from storage:", saved);

      if (saved) {
        setNavItems(JSON.parse(saved));
      } else {
        // Default items
        const defaultItems = [
          { id: "1", name: "Home", path: "/", type: "link" },
          { id: "2", name: "Blog", path: "/blog", type: "link" },

          { id: "4", name: "About", path: "/about", type: "link" },
          { id: "5", name: "Contact", path: "/contact", type: "link" },
        ];
        setNavItems(defaultItems);
        localStorage.setItem("navbarItems", JSON.stringify(defaultItems));
      }
    } catch (error) {
      console.error("Error loading navbar:", error);
    }
  };

  // Listen for storage changes (other tabs)
  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === 'navbarItems') {
        try {
          setNavItems(JSON.parse(e.newValue));
        } catch (error) {
          console.error("Error parsing storage change:", error);
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  // Listen for custom event (same tab)
  useEffect(() => {
    const handleCustomEvent = (e) => {
      console.log("Custom event received:", e.detail);
      setNavItems(e.detail);
    };

    window.addEventListener('navbarUpdated', handleCustomEvent);
    return () => window.removeEventListener('navbarUpdated', handleCustomEvent);
  }, []);

  // Check if admin is logged in
  useEffect(() => {
    axiosProtected
      .get("/api/admin/check-auth")
      .then((res) => {
        if (res.data.authenticated) {
          setIsAdmin(true);
          setIsLoggedIn(true); // Keep isLoggedIn updated
        } else {
          setIsAdmin(false);
          setIsLoggedIn(false); // Keep isLoggedIn updated
          localStorage.removeItem("isAdmin");
        }
      })
      .catch(() => {
        setIsAdmin(false);
        setIsLoggedIn(false); // Keep isLoggedIn updated
        localStorage.removeItem("isAdmin");
      });
  }, []);

  // Check if SEO is logged in
  useEffect(() => {
    axiosProtected
      .get("/api/seo/check-auth")
      .then((res) => {
        if (res.data.authenticated) {
          setIsSeo(true);
          setIsLoggedIn(true);
        } else {
          setIsSeo(false);
          localStorage.removeItem("isSeo");
        }
      })
      .catch(() => {
        setIsSeo(false);
        localStorage.removeItem("isSeo");
      });
  }, []);

  // Scroll effect
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = mobileMenu ? "hidden" : "";
    return () => (document.body.style.overflow = "");
  }, [mobileMenu]);

  const handleLogout = async () => {
    try {
      await axiosProtected.post("/api/admin/logout");
      setIsLoggedIn(false); // Set isLoggedIn to false on logout
      setIsAdmin(false);
      setIsSeo(false); // Also clear SEO state on admin logout
      localStorage.removeItem("isAdmin");
      localStorage.removeItem("isSeo");
      window.location.href = "/";
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const closeAll = () => {
    setMobileMenu(false);
    setActiveDropdown(null);
    setActiveSubDropdown(null);
    setActiveSubSubDropdown(null);
  };

  const linkClass = "hover:text-cyan-400 transition";
  const buttonClass = "px-2 py-2 rounded-full transition duration-300";

  // Loading state
  if (loading) {
    return (
      <header className="fixed top-0 w-full z-50 bg-[#0c0c16] text-white flex justify-between items-center px-6 lg:px-8 py-4 border-b border-white/10">
        <img
          src="/nexa-infotech-logo.webp"
          alt="Nexa Infotech Logo"
          className="h-8 lg:h-12"
        />
        <div className="h-8 w-8 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin"></div>
      </header>
    );
  }

  return (
    <>
      <header
        className={`fixed top-0 w-full z-50 text-white flex justify-between items-center px-6 lg:px-8 py-4 transition-all duration-300 ${scrolled ? "bg-[#0c0c16] shadow-lg" : "bg-black/40 backdrop-blur-xl"
          } border-b border-white/10`}
      >
        {/* Logo */}
        <Link to="/" onClick={closeAll}>
          <img
            src="/nexa-infotech-logo.webp"
            alt="Nexa Infotech Logo"
            className="h-8 lg:h-12"
          />
        </Link>

        {/* Desktop Menu */}
        <nav className="hidden lg:flex gap-6 font-medium items-center">
          {navItems.map((item) => (
            <div key={item.id} className="relative group">
              {item.type === "dropdown" ? (
                <>
                  <button
                    className={`${linkClass} flex items-center gap-1`}
                    onClick={() => setActiveDropdown(activeDropdown === item.id ? null : item.id)}
                  >
                    {item.name}
                    <svg
                      className={`w-4 h-4 transition-transform duration-200 ${activeDropdown === item.id ? "rotate-180" : ""
                        }`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>

                  {/* Dropdown Menu */}
                  <div className={`absolute left-0 mt-2 w-48 bg-[#1a1a2e] rounded-lg shadow-xl border border-white/10 overflow-hidden transition-all duration-200 ${activeDropdown === item.id ? "opacity-100 visible" : "opacity-0 invisible group-hover:visible group-hover:opacity-100"
                    }`}>
                    {item.dropdown?.map((dropItem) => (
                      <div key={dropItem.id} className="relative group/sub">
                        {dropItem.type === "dropdown" ? (
                          <div className="flex justify-between items-center px-4 py-3 hover:bg-cyan-600 transition cursor-pointer">
                            {dropItem.name} <span className="text-[10px]">▶</span>
                            <div className="absolute top-0 left-full w-48 bg-[#1a1a2e] rounded-lg shadow-xl border border-white/10 overflow-hidden hidden group-hover/sub:block z-50">
                              {dropItem.dropdown?.map(ss => (
                                <div key={ss.id} className="relative group/ss">
                                  {ss.type === "dropdown" ? (
                                    <div className="flex justify-between items-center px-4 py-3 hover:bg-cyan-600 transition cursor-pointer">
                                      {ss.name} <span className="text-[10px]">▶</span>
                                      <div className="absolute top-0 left-full w-48 bg-[#1a1a2e] rounded-lg shadow-xl border border-white/10 overflow-hidden hidden group-hover/ss:block z-50">
                                        {ss.dropdown?.map(sss => (
                                          <Link
                                            key={sss.id}
                                            to={sss.path || "#"}
                                            onClick={closeAll}
                                            className="block px-4 py-3 hover:bg-cyan-600 hover:text-white transition"
                                          >
                                            {sss.name}
                                          </Link>
                                        ))}
                                      </div>
                                    </div>
                                  ) : (
                                    <Link
                                      to={ss.path || "#"}
                                      onClick={closeAll}
                                      className="block px-4 py-3 hover:bg-cyan-600 hover:text-white transition"
                                    >
                                      {ss.name}
                                    </Link>
                                  )}
                                </div>
                              ))}
                            </div>
                          </div>
                        ) : (
                          <Link
                            to={dropItem.path || "#"}
                            onClick={closeAll}
                            className="block px-4 py-3 hover:bg-cyan-600 hover:text-white transition"
                          >
                            {dropItem.name}
                          </Link>
                        )}
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                <Link
                  to={item.path}
                  className={linkClass}
                  onClick={closeAll}
                >
                  {item.name}
                </Link>
              )}
            </div>
          ))}
        </nav>

        {/* Desktop Right Buttons - Same as before */}
        <div className="hidden lg:flex items-center gap-2 text-center">
          {isAdmin && (
            <Link
              to="/admin/navbar-editor"
              className={`${buttonClass} bg-purple-600 hover:bg-purple-700`}
            >
              Edit Menu
            </Link>
          )}

          {isLoggedIn ? (
            <>
              <Link
                to="/admin/dashboard"
                className={`${buttonClass} bg-blue-600 hover:bg-blue-700`}
                onClick={closeAll}
              >
                Admin Dashboard
              </Link>
              <button
                onClick={handleLogout}
                className={`${buttonClass} bg-red-600 hover:bg-red-700`}
              >
                Logout
              </button>
            </>
          ) : (
            <Link
              to="/contact"
              className={`${buttonClass} bg-linear-to-r from-[#004C7D] to-[#158EB0] hover:scale-105`}
              onClick={closeAll}
            >
              Get Started
            </Link>
          )}
        </div>

        {/* Mobile Hamburger - Same as before */}
        <button
          onClick={() => setMobileMenu((prev) => !prev)}
          className="lg:hidden flex flex-col justify-center items-center w-8 h-8 space-y-1.5"
        >
          <span
            className={`block h-0.5 w-6 bg-white transition-all duration-300 ${mobileMenu ? "rotate-45 translate-y-2" : ""
              }`}
          />
          <span
            className={`block h-0.5 w-6 bg-white transition-all duration-300 ${mobileMenu ? "opacity-0" : ""
              }`}
          />
          <span
            className={`block h-0.5 w-6 bg-white transition-all duration-300 ${mobileMenu ? "-rotate-45 -translate-y-2" : ""
              }`}
          />
        </button>

        {/* Mobile Menu - Same as before */}
        {mobileMenu && (
          <div className="fixed left-0 top-[72px] w-full bg-[#0f0f1a]/95 backdrop-blur-xl flex flex-col lg:hidden shadow-2xl p-5 max-h-[calc(100vh-72px)] overflow-y-auto">
            {navItems.map((item) => (
              <div key={item.id}>
                {item.type === "dropdown" ? (
                  <>
                    <button
                      onClick={() => setActiveDropdown(activeDropdown === item.id ? null : item.id)}
                      className="text-lg py-3 border-b border-white/10 hover:text-cyan-400 w-full text-left flex justify-between items-center"
                    >
                      {item.name}
                      <svg
                        className={`w-4 h-4 transition-transform duration-200 ${activeDropdown === item.id ? "rotate-180" : ""
                          }`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>

                    {/* Mobile Dropdown */}
                    {activeDropdown === item.id && (
                      <div className="pl-4 mb-2">
                        {item.dropdown?.map((dropItem) => (
                          <div key={dropItem.id}>
                            {dropItem.type === "dropdown" ? (
                              <>
                                <button
                                  onClick={() => setActiveSubDropdown(activeSubDropdown === dropItem.id ? null : dropItem.id)}
                                  className="flex justify-between items-center w-full py-2 text-base hover:text-cyan-400"
                                >
                                  {dropItem.name}
                                  <span className={`text-[10px] transition-transform ${activeSubDropdown === dropItem.id ? "rotate-90" : ""}`}>▶</span>
                                </button>
                                {activeSubDropdown === dropItem.id && (
                                  <div className="pl-4 border-l border-white/10 ml-2">
                                    {dropItem.dropdown?.map(ss => (
                                      <div key={ss.id}>
                                        {ss.type === "dropdown" ? (
                                          <>
                                            <button
                                              onClick={() => setActiveSubSubDropdown(activeSubSubDropdown === ss.id ? null : ss.id)}
                                              className="flex justify-between items-center w-full py-2 text-sm text-gray-300 hover:text-cyan-400"
                                            >
                                              {ss.name}
                                              <span className={`text-[10px] transition-transform ${activeSubSubDropdown === ss.id ? "rotate-90" : ""}`}>▶</span>
                                            </button>
                                            {activeSubSubDropdown === ss.id && (
                                              <div className="pl-4 border-l border-white/10 ml-2">
                                                {ss.dropdown?.map(sss => (
                                                  <Link
                                                    key={sss.id}
                                                    to={sss.path || "#"}
                                                    onClick={closeAll}
                                                    className="block py-1.5 text-xs text-gray-400 hover:text-cyan-400"
                                                  >
                                                    {sss.name}
                                                  </Link>
                                                ))}
                                              </div>
                                            )}
                                          </>
                                        ) : (
                                          <Link
                                            to={ss.path || "#"}
                                            onClick={closeAll}
                                            className="block py-2 text-sm text-gray-300 hover:text-cyan-400"
                                          >
                                            {ss.name}
                                          </Link>
                                        )}
                                      </div>
                                    ))}
                                  </div>
                                )}
                              </>
                            ) : (
                              <Link
                                to={dropItem.path || "#"}
                                onClick={closeAll}
                                className="block py-2 text-base hover:text-cyan-400"
                              >
                                {dropItem.name}
                              </Link>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </>
                ) : (
                  <Link
                    to={item.path}
                    onClick={closeAll}
                    className="block text-lg py-3 border-b border-white/10 hover:text-cyan-400"
                  >
                    {item.name}
                  </Link>
                )}
              </div>
            ))}

            {/* Admin Edit in Mobile */}
            {isAdmin && (
              <Link
                to="/admin/navbar-editor"
                onClick={closeAll}
                className="text-lg py-3 border-b border-white/10 text-purple-400"
              >
                ✎ Edit Menu
              </Link>
            )}

            <div className="flex flex-col gap-3 mt-6">
              {isLoggedIn ? (
                <>
                  <Link
                    to="/admin/dashboard"
                    onClick={closeAll}
                    className="mt-4 px-6 py-3 bg-blue-600 text-center rounded-full"
                  >
                    Admin Dashboard
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="px-6 py-3 bg-red-600 text-center rounded-full"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <Link
                  to="/contact"
                  onClick={closeAll}
                  className="mt-4 px-6 py-3 bg-linear-to-r from-[#004C7D] to-[#158EB0] text-center rounded-full"
                >
                  Get Started
                </Link>
              )}
            </div>
          </div>
        )}
      </header>
    </>
  );
}
