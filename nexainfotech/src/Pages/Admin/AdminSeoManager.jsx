import React, { useState, useEffect } from "react";
import axios from "../../Protected/axios";

const AdminSeoManager = () => {
  const [seos, setSeos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingSeo, setEditingSeo] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [formData, setFormData] = useState({
    pageUrl: "",
    metaTitle: "",
    metaDescription: "",
    metaKeywords: "",
  });

  const fetchSeos = async () => {
    try {
      const response = await axios.get("/api/seo");
      setSeos(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching SEO data:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSeos();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingSeo) {
        await axios.put(`/api/seo/${editingSeo._id}`, formData);
      } else {
        await axios.post("/api/seo", formData);
      }
      fetchSeos();
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
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this SEO entry?")) {
      try {
        await axios.delete(`/api/seo/${id}`);
        fetchSeos();
      } catch (error) {
        alert("Error deleting SEO entry");
      }
    }
  };

  const filteredSeos = seos.filter(seo => 
    seo.pageUrl.toLowerCase().includes(searchTerm.toLowerCase()) ||
    seo.metaTitle.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="bg-[#0c0c16] min-h-screen text-white font-sans pb-10 rounded-xl">
      {/* Header Section */}
      <div className="flex justify-between items-center p-6 border-b border-gray-800">
        <div>
          <h1 className="text-3xl font-bold">SEO <span className="text-cyan-400">Manager</span></h1>
          <p className="text-gray-400 text-sm mt-1">Manage website meta titles, descriptions and keywords.</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="bg-cyan-500 hover:bg-cyan-600 text-white px-6 py-2.5 rounded-xl font-bold transition-all shadow-lg shadow-cyan-500/20 flex items-center gap-2"
        >
          <span>➕</span> Add New Record
        </button>
      </div>

      <div className="p-6">
        {/* Search and Filter */}
        <div className="bg-[#111827] p-4 rounded-xl border border-gray-800 mb-6 flex flex-col md:flex-row justify-between items-center gap-4">
           <div className="relative w-full md:w-96">
              <input 
                type="text" 
                placeholder="Search by URL or Title..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-[#0c0c16] border border-gray-700 rounded-lg px-10 py-2.5 text-sm outline-none focus:border-cyan-500 transition-all"
              />
              <span className="absolute left-3 top-2.5 text-gray-500">🔍</span>
           </div>
           <div className="text-sm text-gray-400">
             Total Records: <span className="text-cyan-400 font-bold">{filteredSeos.length}</span>
           </div>
        </div>

        {loading ? (
          <div className="text-center py-20">
            <div className="w-12 h-12 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-400">Loading SEO records...</p>
          </div>
        ) : (
          <div className="overflow-x-auto bg-[#111827] rounded-xl border border-gray-800 shadow-2xl">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-800 text-cyan-400 text-xs uppercase tracking-wider font-bold">
                  <th className="p-4">URL & Status</th>
                  <th className="p-4">Meta Title</th>
                  <th className="p-4">User Email</th>
                  <th className="p-4">Description</th>
                  <th className="p-4">Actions</th>
                </tr>
              </thead>
              <tbody className="text-gray-300">
                {filteredSeos.map((seo) => (
                  <tr key={seo._id} className="border-b border-gray-800 hover:bg-white/5 transition-all">
                    <td className="p-4">
                      <div className="text-cyan-400 font-medium break-all mb-1">{seo.pageUrl}</div>
                      <span className="bg-green-500/10 text-green-500 text-[10px] px-2 py-0.5 rounded border border-green-500/20 font-bold uppercase">Active</span>
                    </td>
                    <td className="p-4 text-sm font-medium">{seo.metaTitle}</td>
                    <td className="p-4 text-xs text-gray-400">
                      <div className="flex flex-col">
                        <span className="text-cyan-400 font-medium">{seo.createdBy || "Admin"}</span>
                        {seo.updatedBy && seo.updatedBy !== seo.createdBy && (
                          <span className="text-[9px] text-gray-500 italic">Last edit: {seo.updatedBy}</span>
                        )}
                        <span className="text-[10px] text-gray-500">{new Date(seo.updatedAt).toLocaleDateString()}</span>
                      </div>
                    </td>
                    <td className="p-4 text-xs text-gray-500 max-w-sm line-clamp-2">{seo.metaDescription}</td>
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <button onClick={() => handleEdit(seo)} className="text-cyan-400 hover:text-cyan-300 transition-colors bg-cyan-400/10 p-2 rounded-lg" title="Edit">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                        </button>
                        <button onClick={() => handleDelete(seo._id)} className="text-red-400 hover:text-red-300 transition-colors bg-red-400/10 p-2 rounded-lg" title="Delete">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-4v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {filteredSeos.length === 0 && (
                  <tr>
                    <td colSpan="4" className="p-12 text-center text-gray-500 italic">No SEO records found matching your criteria.</td>
                  </tr>
                )}
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
