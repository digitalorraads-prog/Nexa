import { Route, Routes, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "./Protected/axios";

import HomePage from "./Pages/HomePage";
import AboutPage from "./Pages/AboutPage";
import NotFound from "./Pages/NotFound";
import Navbar from "./Component/layout/Navbar";
import Footer from "./Component/layout/Footer";
import Blog from "./Component/Sections/Blogs/Blog";
import AddBlogForm from "./Component/Sections/Blogs/AddBlogForm";
import ServicesPage from "./Pages/ServicesPage";
import ServiceDetails from "./Pages/ServiceDetails";
import UpdateBlogPage from "./Pages/UpdateBlogPage";
import SingleBlogePage from "./Pages/SingleBlogePage";
import ContactPage from "./Pages/ContactPage";
import AdminContactsPage from "./Pages/Admin/AdminContactsPage";
import AdminLoginPage from "./Pages/Admin/AdminLoginPage";
import AdminDashboard from "./Pages/Admin/AdminDashboard";
import ProtectedRoute from "./Protected/ProtectedRoute";
import AdminAddService from "./Pages/Admin/AdminAddService";
import AdminEditService from "./Pages/Admin/AdminEditService";
import AdminServiceList from "./Pages/Admin/AdminServiceList";
import PortfolioAddPage from "./Pages/Admin/PortfolioAddPage";
import PortfolioManagePage from "./Pages/Admin/PortfolioManagePage";
import AdminNavbarEditor from "./Pages/Admin/AdminNavbarEditor";
import HeroManager from "./Pages/Admin/HeroManager";
// import DigitalMarketing from "./Component/sections/digitalMarketing/DigitalMarketing";
import DigitalMarketingPage from "./Pages/DigitalMarketingPage";
import ManagePages from "./Pages/Admin/ManagePages";

/* 🔥 LOGIN VALIDATION WRAPPER */
function AdminLoginWrapper() {
  const [status, setStatus] = useState("loading");

  useEffect(() => {
    axios
      .get("/api/admin/check-auth")
      .then(() => setStatus("authenticated"))
      .catch(() => setStatus("unauthenticated"));
  }, []);

  if (status === "loading") {
    return <div className="text-center mt-20">Checking session...</div>;
  }

  if (status === "authenticated") {
    return <Navigate to="/admin/dashboard" replace />;
  }

  return <AdminLoginPage />;
}

function App() {
  return (
    <div>
      <Navbar />

      <Routes>
        {/* ================= PUBLIC ROUTES ================= */}
        <Route path="/" element={<HomePage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/blog" element={<Blog />} />
        
        <Route
          path="/services/digital-marketing"
          element={<DigitalMarketingPage />}
        />
        <Route path="/blog/:id" element={<SingleBlogePage />} />
        <Route path="/services" element={<ServicesPage />} />

        <Route path="/:slug" element={<ServiceDetails />} />
        <Route path="/:city/:serviceName" element={<ServiceDetails />} />
        <Route
          path="/:city/:serviceName/:subService"
          element={<ServiceDetails />}
        />

        <Route path="/contact" element={<ContactPage />} />

        {/* ================= ADMIN LOGIN ================= */}
        <Route path="/admin/login" element={<AdminLoginWrapper />} />

        {/* ================= ADMIN PROTECTED ROUTES ================= */}

        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/hero"
          element={
            <ProtectedRoute>
              <HeroManager />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/services"
          element={
            <ProtectedRoute>
              <AdminServiceList />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/navbar-editor"
          element={
            <ProtectedRoute>
              <AdminNavbarEditor />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/pages"
          element={
            <ProtectedRoute>
              <ManagePages />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/edit/:id"
          element={
            <ProtectedRoute>
              <AdminEditService />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/add-portfolio"
          element={
            <ProtectedRoute>
              <PortfolioAddPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/manage-portfolio"
          element={
            <ProtectedRoute>
              <PortfolioManagePage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/add-blog"
          element={
            <ProtectedRoute>
              <AddBlogForm />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/manage-blogs"
          element={
            <ProtectedRoute>
              <UpdateBlogPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/contact"
          element={
            <ProtectedRoute>
              <AdminContactsPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/add-service"
          element={
            <ProtectedRoute>
              <AdminAddService />
            </ProtectedRoute>
          }
        />

        {/* ================= 404 ================= */}
        <Route path="*" element={<NotFound />} />
      </Routes>

      <Footer />
    </div>
  );
}

export default App;
