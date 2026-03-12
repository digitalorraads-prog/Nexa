import React, { useState, useEffect, useMemo } from "react";
import axios from "../../Protected/axios";

const AdminSeoManager = () => {
  const [seos, setSeos] = useState([]);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingSeo, setEditingSeo] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all"); // all, completed, missing
  const [sourceFilter, setSourceFilter] = useState("all"); // all, auto, manual
  const [typeFilter, setTypeFilter] = useState("all"); // all, service, static
  const [bulkLoading, setBulkLoading] = useState(false);
  const [formData, setFormData] = useState({
    pageUrl: "",
    metaTitle: "",
    metaDescription: "",
    metaKeywords: "",
    canonicalUrl: "",
    robotsTag: "index, follow",
  });

  const fetchData = async () => {
    try {
      setLoading(true);
      const [seoRes, serviceRes] = await Promise.all([
        axios.get("/api/seo"),
        axios.get("/api/services")
      ]);
      setSeos(seoRes.data);
      // Backend returns { success: true, count: X, data: [...] } for services
      setServices(serviceRes.data.data || []);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingSeo && editingSeo._id) {
        await axios.put(`/api/seo/${editingSeo._id}`, formData);
      } else {
        await axios.post("/api/seo", formData);
      }
      fetchData();
      resetForm();
    } catch (error) {
      alert(error.response?.data?.message || "Error saving SEO data");
    }
  };

  const resetForm = () => {
    setFormData({
      pageUrl: "",
      metaTitle: "",
      metaDescription: "",
      metaKeywords: "",
      canonicalUrl: "",
      robotsTag: "index, follow",
    });
    setEditingSeo(null);
    setShowModal(false);
  };

  const handleEdit = (seo) => {
    setEditingSeo(seo);
    setFormData({
      pageUrl: seo.pageUrl || "",
      metaTitle: seo.metaTitle || "",
      metaDescription: seo.metaDescription || "",
      metaKeywords: seo.metaKeywords || "",
      canonicalUrl: seo.canonicalUrl || "",
      robotsTag: seo.robotsTag || "index, follow",
    });
    setShowModal(true);
  };

  const handleAddNewForUrl = (url) => {
    setFormData({
      ...formData,
      pageUrl: url,
    });
    setEditingSeo(null);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this SEO entry?")) {
      try {
        await axios.delete(`/api/seo/${id}`);
        fetchData();
      } catch (error) {
        alert("Error deleting SEO entry");
      }
    }
  };

  const handleAutoSEOServices = async () => {
    if (window.confirm("This will automatically generate/sync SEO titles for all services using their page titles. Continue?")) {
      try {
        setBulkLoading(true);
        const response = await axios.post("/api/seo/bulk-auto-services");
        alert(response.data.message);
        fetchData();
      } catch (error) {
        alert(error.response?.data?.message || "Error during bulk SEO update");
      } finally {
        setBulkLoading(false);
      }
    }
  };

  // Logic to combine Services and SEO Records
  const masterPagesList = useMemo(() => {
    // 1. Get all SEO URLs
    const seoMap = new Map();
    seos.forEach(s => seoMap.set(s.pageUrl, s));

    // 2. Identify Services and their SEO status
    const servicePages = services.map(service => {
      const url = service.slug.startsWith("/") ? service.slug : `/${service.slug}`;
      const seoData = seoMap.get(url);
      if (seoData) seoMap.delete(url); // Remove from map to identify custom/static pages later
      
      return {
        _id: seoData?._id || `temp-${service._id}`,
        pageUrl: url,
        type: "service",
        serviceName: service.pageTitle,
        hasSeo: !!seoData,
        seo: seoData || null
      };
    });

    // 3. Identify remaining SEO records (Static/Custom pages like /about, /contact)
    const customPages = Array.from(seoMap.values()).map(seo => ({
      _id: seo._id,
      pageUrl: seo.pageUrl,
      type: "custom",
      serviceName: "Static Page",
      hasSeo: true,
      seo: seo
    }));

    // 4. Combine and Filter
    let combined = [...servicePages, ...customPages];

    // Search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      combined = combined.filter(p => 
        p.pageUrl.toLowerCase().includes(term) || 
        (p.seo?.metaTitle || "").toLowerCase().includes(term) ||
        (p.serviceName || "").toLowerCase().includes(term)
      );
    }

    // Status filter
    if (statusFilter === "missing") {
      combined = combined.filter(p => !p.hasSeo);
    } else if (statusFilter === "completed") {
      combined = combined.filter(p => p.hasSeo);
    }

    // Source filter (Only applicable if SEO exists)
    if (sourceFilter === "auto") {
      combined = combined.filter(p => p.seo?.createdBy?.startsWith("System") || p.seo?.updatedBy?.startsWith("System"));
    } else if (sourceFilter === "manual") {
      combined = combined.filter(p => p.hasSeo && !p.seo?.createdBy?.startsWith("System") && !p.seo?.updatedBy?.startsWith("System"));
    }

    // Type filter
    if (typeFilter === "service") {
      combined = combined.filter(p => p.type === "service");
    } else if (typeFilter === "static") {
      combined = combined.filter(p => p.type === "custom");
    }

    return combined.sort((a, b) => a.pageUrl.localeCompare(b.pageUrl));
  }, [seos, services, searchTerm, statusFilter, sourceFilter, typeFilter]);

  const stats = useMemo(() => {
     return {
       total: masterPagesList.length,
       completed: masterPagesList.filter(p => p.hasSeo).length,
       missing: masterPagesList.filter(p => !p.hasSeo).length
     };
  }, [masterPagesList]);

  return (
    <div className="bg-[#0c0c16] min-h-screen text-white font-sans pb-10 rounded-xl">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center p-6 border-b border-gray-800 gap-4">
        <div>
          <h1 className="text-3xl font-bold">SEO <span className="text-cyan-400">Dashboard</span></h1>
          <p className="text-gray-400 text-sm mt-1">Manage metadata for services and static pages.</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={handleAutoSEOServices}
            disabled={bulkLoading}
            className={`${bulkLoading ? "bg-gray-600 cursor-not-allowed" : "bg-purple-600 hover:bg-purple-700"} text-white px-4 py-2 rounded-xl text-sm font-bold transition-all flex items-center gap-2 shadow-lg shadow-purple-500/20`}
          >
            {bulkLoading ? (
              <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
            ) : (
              <span>✨</span>
            )}
            Auto SEO Services
          </button>
          <button
            onClick={() => setShowModal(true)}
            className="bg-cyan-500 hover:bg-cyan-600 text-white px-4 py-2 rounded-xl text-sm font-bold transition-all flex items-center gap-2"
          >
            <span>➕</span> Custom URL
          </button>
        </div>
      </div>

      <div className="p-6">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
            <div className="bg-[#111827] p-4 rounded-xl border border-gray-800">
                <p className="text-gray-500 text-xs font-bold uppercase tracking-wider mb-1">Total Pages</p>
                <p className="text-2xl font-bold text-white">{stats.total}</p>
            </div>
            <div className="bg-[#064e3b]/20 p-4 rounded-xl border border-green-900/30">
                <p className="text-green-500 text-xs font-bold uppercase tracking-wider mb-1">SEO Completed</p>
                <p className="text-2xl font-bold text-green-400">{stats.completed}</p>
            </div>
            <div className="bg-[#7f1d1d]/20 p-4 rounded-xl border border-red-900/30">
                <p className="text-red-500 text-xs font-bold uppercase tracking-wider mb-1">SEO Missing</p>
                <p className="text-2xl font-bold text-red-500">{stats.missing}</p>
            </div>
        </div>

        {/* Filters Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 mb-6">
           {/* Search Box */}
           <div className="lg:col-span-1 relative">
              <input 
                type="text" 
                placeholder="Search URL or Title..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-[#111827] border border-gray-700 rounded-xl px-10 py-2.5 text-sm outline-none focus:border-cyan-500 transition-all text-white"
              />
              <span className="absolute left-3 top-2.5 text-gray-500">🔍</span>
           </div>

           {/* Status Filter */}
           <div className="flex flex-col gap-1.5">
              <span className="text-[10px] text-gray-500 font-bold uppercase tracking-widest pl-1">SEO Status</span>
              <div className="flex bg-[#111827] p-1 rounded-xl border border-gray-800">
                <button onClick={() => setStatusFilter("all")} className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all ${statusFilter === "all" ? "bg-cyan-500 text-white" : "text-gray-400 hover:text-white"}`}>All</button>
                <button onClick={() => setStatusFilter("completed")} className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all ${statusFilter === "completed" ? "bg-green-500 text-white" : "text-gray-400 hover:text-white"}`}>Done</button>
                <button onClick={() => setStatusFilter("missing")} className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all ${statusFilter === "missing" ? "bg-red-500 text-white" : "text-gray-400 hover:text-white"}`}>Missing</button>
              </div>
           </div>

           {/* Source Filter */}
           <div className="flex flex-col gap-1.5">
              <span className="text-[10px] text-gray-500 font-bold uppercase tracking-widest pl-1">Data Source</span>
              <div className="flex bg-[#111827] p-1 rounded-xl border border-gray-800">
                <button onClick={() => setSourceFilter("all")} className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all ${sourceFilter === "all" ? "bg-cyan-500 text-white" : "text-gray-400 hover:text-white"}`}>All</button>
                <button onClick={() => setSourceFilter("auto")} className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all ${sourceFilter === "auto" ? "bg-purple-500 text-white" : "text-gray-400 hover:text-white"}`}>Auto</button>
                <button onClick={() => setSourceFilter("manual")} className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all ${sourceFilter === "manual" ? "bg-orange-500 text-white" : "text-gray-400 hover:text-white"}`}>Manual</button>
              </div>
           </div>

           {/* Type Filter */}
           <div className="flex flex-col gap-1.5">
              <span className="text-[10px] text-gray-500 font-bold uppercase tracking-widest pl-1">Page Type</span>
              <div className="flex bg-[#111827] p-1 rounded-xl border border-gray-800">
                <button onClick={() => setTypeFilter("all")} className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all ${typeFilter === "all" ? "bg-cyan-500 text-white" : "text-gray-400 hover:text-white"}`}>All</button>
                <button onClick={() => setTypeFilter("service")} className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all ${typeFilter === "service" ? "bg-blue-500 text-white" : "text-gray-400 hover:text-white"}`}>Services</button>
                <button onClick={() => setTypeFilter("static")} className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all ${typeFilter === "static" ? "bg-indigo-500 text-white" : "text-gray-400 hover:text-white"}`}>Static</button>
              </div>
           </div>
        </div>

        {loading ? (
          <div className="text-center py-20">
            <div className="w-12 h-12 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-400">Loading pages status...</p>
          </div>
        ) : (
          <div className="overflow-x-auto bg-[#111827] rounded-xl border border-gray-800 shadow-2xl">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-800 text-cyan-400 text-[10px] uppercase tracking-wider font-bold">
                  <th className="p-4">Page Details</th>
                  <th className="p-4">SEO Progress</th>
                  <th className="p-4 w-40">Actions</th>
                </tr>
              </thead>
              <tbody className="text-gray-300">
                {masterPagesList.map((page) => (
                  <tr key={page._id} className="border-b border-gray-800 hover:bg-white/5 transition-all">
                    <td className="p-4">
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-2">
                           <span className="text-cyan-400 font-bold text-sm">{page.pageUrl}</span>
                           <span className={`text-[9px] px-1.5 py-0.5 rounded border font-bold uppercase ${page.type === "service" ? "bg-purple-500/10 text-purple-400 border-purple-500/30" : "bg-blue-500/10 text-blue-400 border-blue-500/30"}`}>
                             {page.type}
                           </span>
                        </div>
                        <span className="text-xs text-gray-500">{page.serviceName}</span>
                      </div>
                    </td>
                    <td className="p-4">
                      {page.hasSeo ? (
                        <div className="flex flex-col gap-1">
                           <div className="flex items-center gap-1.5 text-green-400 text-xs font-bold">
                             <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
                             {page.seo.metaTitle.substring(0, 40)}...
                           </div>
                           <div className="flex flex-col text-[10px]">
                             <span className="text-cyan-400/80 font-medium">{page.seo.createdBy || "Admin"}</span>
                             {page.seo.updatedBy && page.seo.updatedBy !== page.seo.createdBy && (
                               <span className="text-gray-500 italic">Last edit: {page.seo.updatedBy}</span>
                             )}
                             <span className="text-gray-500">{new Date(page.seo.updatedAt).toLocaleDateString()}</span>
                           </div>
                        </div>
                      ) : (
                        <div className="flex items-center gap-1.5 text-red-500/70 text-xs font-bold italic">
                           <span className="w-1.5 h-1.5 rounded-full bg-red-600 animate-pulse"></span>
                           SEO Metadata Missing
                        </div>
                      )}
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        {page.hasSeo ? (
                          <>
                            <button 
                              onClick={() => handleEdit(page.seo)} 
                              className="text-cyan-400 hover:text-white transition-colors bg-cyan-400/10 hover:bg-cyan-500 p-2 rounded-lg" 
                              title="Edit SEO"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                            </button>
                            <button 
                              onClick={() => handleDelete(page.seo._id)} 
                              className="text-red-400 hover:text-white transition-colors bg-red-400/10 hover:bg-red-500 p-2 rounded-lg" 
                              title="Delete SEO"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-4v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                            </button>
                          </>
                        ) : (
                          <button 
                            onClick={() => handleAddNewForUrl(page.pageUrl)}
                            className="w-full bg-green-500/10 hover:bg-green-500 text-green-500 hover:text-white border border-green-500/30 px-3 py-1.5 rounded-lg text-xs font-bold transition-all"
                          >
                            Add SEO
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal - Dark Theme */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="bg-[#111827] w-full max-w-2xl rounded-2xl border border-gray-700 shadow-2xl relative animate-in fade-in zoom-in duration-200">
            <button onClick={resetForm} className="absolute top-4 right-4 text-gray-400 hover:text-white transition-all text-xl">✕</button>
            
            <form onSubmit={handleSubmit} className="p-8 overflow-y-auto max-h-[90vh]">
              <h2 className="text-2xl font-bold mb-6 text-cyan-400">{editingSeo ? "Edit SEO Entry" : "Add New SEO Entry"}</h2>
              
              <div className="mb-6">
                <label className="block text-sm text-gray-400 mb-2">Page URL (slug)</label>
                <input
                  type="text"
                  name="pageUrl"
                  value={formData.pageUrl}
                  onChange={handleInputChange}
                  className="w-full bg-[#0c0c16] border border-gray-700 rounded-lg p-3 focus:outline-none focus:border-cyan-500 text-white transition-all"
                  placeholder="e.g. /about"
                  required
                />
              </div>

              <div className="mb-6">
                <label className="block text-sm text-gray-400 mb-2">Meta Title</label>
                <input
                  type="text"
                  name="metaTitle"
                  value={formData.metaTitle}
                  onChange={handleInputChange}
                  className="w-full bg-[#0c0c16] border border-gray-700 rounded-lg p-3 focus:outline-none focus:border-cyan-500 text-white transition-all"
                  placeholder="The page title shown in browser tab"
                  required
                />
              </div>

              <div className="mb-6">
                <label className="block text-sm text-gray-400 mb-2">Meta Description</label>
                <textarea
                  name="metaDescription"
                  value={formData.metaDescription}
                  onChange={handleInputChange}
                  rows="3"
                  className="w-full bg-[#0c0c16] border border-gray-700 rounded-lg p-3 focus:outline-none focus:border-cyan-500 text-white transition-all resize-none"
                  placeholder="A short summary for search engines"
                  required
                ></textarea>
              </div>

              <div className="mb-8">
                <label className="block text-sm text-gray-400 mb-2">Meta Keywords</label>
                <textarea
                  name="metaKeywords"
                  value={formData.metaKeywords || ""}
                  onChange={handleInputChange}
                  rows="3"
                  className="w-full bg-[#0c0c16] border border-gray-700 rounded-lg p-3 focus:outline-none focus:border-cyan-500 text-white transition-all resize-none"
                  placeholder="Keyword1, Key word 2, Keyword 3..."
                ></textarea>
              </div>

              <div className="mb-6">
                <label className="block text-sm text-gray-400 mb-2">Canonical URL</label>
                <input
                  type="text"
                  name="canonicalUrl"
                  value={formData.canonicalUrl || ""}
                  onChange={handleInputChange}
                  className="w-full bg-[#0c0c16] border border-gray-700 rounded-lg p-3 focus:outline-none focus:border-cyan-500 text-white transition-all"
                  placeholder="e.g. https://nexainfotech.com/about"
                />
                <p className="text-[10px] text-gray-500 mt-1 italic">The preferred version of this page for search engines.</p>
              </div>

              <div className="mb-6">
                <label className="block text-sm text-gray-400 mb-2">Robots Tag</label>
                <select
                  name="robotsTag"
                  value={formData.robotsTag || "index, follow"}
                  onChange={handleInputChange}
                  className="w-full bg-[#0c0c16] border border-gray-700 rounded-lg p-3 focus:outline-none focus:border-cyan-500 text-white transition-all"
                >
                  <option value="index, follow">index, follow (Default)</option>
                  <option value="noindex, nofollow">noindex, nofollow</option>
                  <option value="index, nofollow">index, nofollow</option>
                  <option value="noindex, follow">noindex, follow</option>
                </select>
                <p className="text-[10px] text-gray-500 mt-1 italic">Controls how search engines crawl and index this page.</p>
              </div>

              <div className="flex gap-4">
                <button
                  type="submit"
                  className="flex-1 bg-cyan-500 hover:bg-cyan-600 text-white font-bold py-3 rounded-xl transition-all shadow-lg shadow-cyan-500/20"
                >
                  {editingSeo ? "Update Record" : "Save Record"}
                </button>
                <button
                  type="button"
                  onClick={resetForm}
                  className="flex-1 bg-gray-800 hover:bg-gray-700 text-white font-bold py-3 rounded-xl transition-all border border-gray-700"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminSeoManager;
