import { Route, Routes, Navigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "./Protected/axios";

import HomePage from "./Pages/HomePage";
import AboutPage from "./Pages/AboutPage";
import NotFound from "./Pages/NotFound";
import Navbar from "./Component/layout/Navbar";
import Footer from "./Component/layout/Footer";
import Blog from "./Component/sections/blogs/Blog";
import AddBlogForm from "./Component/sections/blogs/AddBlogForm";
import ServicesPage from "./Pages/ServicesPage";
import ServiceDetails from "./Pages/ServiceDetails";
import UpdateBlogPage from "./Pages/UpdateBlogPage";
import SingleBlogPage from "./Pages/SingleBlogPage";
import ContactPage from "./Pages/ContactPage";
import GalleryPage from "./Pages/GalleryPage";
import PortfolioPage from "./Pages/PortfolioPage";
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
import ManagePages from "./Pages/Admin/ManagePages";
import HeroManager from "./Pages/Admin/HeroManager";

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
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith("/admin");

  // Scroll to top on every route change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return (
    <div>
      {!isAdminRoute && <Navbar />}

      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/blog" element={<Blog />} />


        <Route path="/blog/:id" element={<SingleBlogPage />} />
        <Route path="/gallery" element={<GalleryPage />} />
        <Route path="/portfolio" element={<PortfolioPage />} />
        <Route path="/services" element={<ServicesPage />} />

        <Route path="/:slug" element={<ServiceDetails />} />
        <Route path="/:city/:serviceName" element={<ServiceDetails />} />
        <Route
          path="/:city/:serviceName/:subService"
          element={<ServiceDetails />}
        />

        <Route path="/contact" element={<ContactPage />} />

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

        <Route path="*" element={<NotFound />} />
      </Routes>

      {!isAdminRoute && <Footer />}
    </div>
  );
}

export default App;
