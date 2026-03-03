import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../../Protected/axios"; // ✅ Correct - using custom axios instance
import {
  PlusIcon,
  PencilIcon,
  TrashIcon,
  EyeIcon,
  ArrowPathIcon,
  CheckCircleIcon,
  XCircleIcon,
  ChevronUpIcon,
  ChevronDownIcon,
  XMarkIcon,
  DocumentTextIcon
} from '@heroicons/react/24/outline';

const iconsList = [
  'DocumentTextIcon',
  'HomeIcon',
  'InformationCircleIcon',
  'BriefcaseIcon',
  'PhotoIcon',
  'EnvelopeIcon',
  'UserGroupIcon',
  'CogIcon',
  'SparklesIcon',
  'HeartIcon'
];

export default function ManagePages() {
  const navigate = useNavigate();
  const [pages, setPages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingPage, setEditingPage] = useState(null);
  
  const [formData, setFormData] = useState({
    pageId: "",
    pageName: "",
    description: "",
    icon: "DocumentTextIcon",
    isActive: true
  });

  useEffect(() => {
    fetchPages();
  }, []);

  const fetchPages = async () => {
    setLoading(true);
    try {
      // ✅ Fixed: Using relative path with axios instance
      const response = await axios.get("/api/pages/admin/all");
      if (response.data.success) {
        setPages(response.data.data);
      }
    } catch (err) {
      console.error(err);
      setMessage(err.response?.data?.message || "❌ Failed to fetch pages");
      if (err.response?.status === 401) {
        navigate("/admin/login");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (name === 'pageName') {
      const pageId = value.toLowerCase().replace(/\s+/g, '-');
      setFormData({
        ...formData,
        pageName: value,
        pageId: pageId
      });
    } else {
      setFormData({
        ...formData,
        [name]: type === 'checkbox' ? checked : value
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.pageName) {
      setMessage("❌ Page name is required");
      return;
    }

    try {
      setLoading(true);
      
      if (editingPage) {
        // ✅ Fixed: Using relative path with axios instance
        const response = await axios.put(
          `/api/pages/admin/${editingPage._id}`,
          formData
        );
        if (response.data.success) {
          setMessage("✅ Page updated successfully!");
        }
      } else {
        // ✅ Fixed: Using relative path with axios instance
        const response = await axios.post(
          "/api/pages/admin/create",
          formData
        );
        if (response.data.success) {
          setMessage("✅ Page created successfully!");
        }
      }
      
      fetchPages();
      setShowForm(false);
      setEditingPage(null);
      setFormData({
        pageId: "",
        pageName: "",
        description: "",
        icon: "DocumentTextIcon",
        isActive: true
      });
    } catch (err) {
      console.error(err);
      setMessage(err.response?.data?.message || "❌ Operation failed");
      if (err.response?.status === 401) {
        navigate("/admin/login");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (page) => {
    setEditingPage(page);
    setFormData({
      pageId: page.pageId,
      pageName: page.pageName,
      description: page.description || "",
      icon: page.icon || "DocumentTextIcon",
      isActive: page.isActive
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure? This will delete the page permanently.")) return;

    try {
      // ✅ Fixed: Using relative path with axios instance
      const response = await axios.delete(`/api/pages/admin/${id}`);
      if (response.data.success) {
        setMessage("✅ Page deleted!");
        fetchPages();
      }
    } catch (err) {
      console.error(err);
      setMessage(err.response?.data?.message || "❌ Delete failed");
      if (err.response?.status === 401) {
        navigate("/admin/login");
      }
    }
  };

  const handleToggleStatus = async (id) => {
    try {
      // ✅ Fixed: Using relative path with axios instance
      const response = await axios.patch(`/api/pages/admin/${id}/toggle`);
      if (response.data.success) {
        setMessage(response.data.message);
        fetchPages();
      }
    } catch (err) {
      console.error(err);
      setMessage(err.response?.data?.message || "❌ Failed to toggle status");
      if (err.response?.status === 401) {
        navigate("/admin/login");
      }
    }
  };

  if (loading && pages.length === 0) {
    return (
      <div className="min-h-screen bg-[#0f0f1a] flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white">Loading Pages...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0f0f1a] text-white pt-20 pb-10 px-5">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-bold text-cyan-400 mb-2">
              Pages Management
            </h1>
            <p className="text-gray-400">
              Create and manage pages for hero sections
            </p>
          </div>
          <button
            onClick={fetchPages}
            className="bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded-lg transition flex items-center gap-2"
          >
            <ArrowPathIcon className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
        </div>

        {message && (
          <div className={`mb-6 p-4 rounded-lg ${
            message.includes('✅') ? 'bg-green-500/20 border border-green-500 text-green-400' :
            message.includes('❌') ? 'bg-red-500/20 border border-red-500 text-red-400' :
            'bg-yellow-500/20 border border-yellow-500 text-yellow-400'
          }`}>
            {message}
          </div>
        )}

        {!showForm && (
          <button
            onClick={() => {
              setShowForm(true);
              setEditingPage(null);
              setFormData({
                pageId: "",
                pageName: "",
                description: "",
                icon: "DocumentTextIcon",
                isActive: true
              });
            }}
            className="mb-6 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 px-6 py-3 rounded-lg font-semibold transition flex items-center gap-2"
          >
            <PlusIcon className="w-5 h-5" />
            Add New Page
          </button>
        )}

        {showForm && (
          <div className="mb-8 bg-[#1a1a2e] rounded-2xl border border-gray-800 p-6">
            <h2 className="text-2xl font-semibold mb-6">
              {editingPage ? 'Edit Page' : 'Create New Page'}
            </h2>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm text-gray-400 mb-2">
                  Page Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="pageName"
                  value={formData.pageName}
                  onChange={handleInputChange}
                  placeholder="e.g., About Us, Our Services"
                  className="w-full px-4 py-2 bg-[#0f0f1a] border border-gray-700 rounded-lg text-white focus:outline-none focus:border-cyan-400"
                  required
                />
                <p className="text-xs text-gray-500 mt-1">
                  Page ID will be: <span className="text-cyan-400">{formData.pageId || 'auto-generated'}</span>
                </p>
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-2">
                  Page ID (auto-generated)
                </label>
                <input
                  type="text"
                  value={formData.pageId}
                  readOnly
                  className="w-full px-4 py-2 bg-[#0f0f1a] border border-gray-700 rounded-lg text-gray-400 cursor-not-allowed"
                />
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-2">
                  Description
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows="3"
                  placeholder="Brief description about this page"
                  className="w-full px-4 py-2 bg-[#0f0f1a] border border-gray-700 rounded-lg text-white focus:outline-none focus:border-cyan-400"
                />
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-2">
                  Icon
                </label>
                <select
                  name="icon"
                  value={formData.icon}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 bg-[#0f0f1a] border border-gray-700 rounded-lg text-white focus:outline-none focus:border-cyan-400"
                >
                  {iconsList.map(icon => (
                    <option key={icon} value={icon}>{icon}</option>
                  ))}
                </select>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  name="isActive"
                  checked={formData.isActive}
                  onChange={handleInputChange}
                  className="w-4 h-4"
                />
                <label>Active (Show in menus)</label>
              </div>

              <div className="flex gap-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 py-3 rounded-lg font-semibold transition disabled:opacity-50"
                >
                  {loading ? "Saving..." : (editingPage ? "Update Page" : "Create Page")}
                </button>
                
                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false);
                    setEditingPage(null);
                  }}
                  className="px-6 py-3 bg-gray-700 hover:bg-gray-600 rounded-lg transition"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        <div className="bg-[#1a1a2e] rounded-2xl border border-gray-800 p-6">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <DocumentTextIcon className="w-5 h-5 text-cyan-400" />
            All Pages ({pages.length})
          </h2>

          <div className="space-y-3">
            {pages.map((page) => (
              <div
                key={page._id}
                className="bg-[#0f0f1a] border border-gray-700 rounded-lg p-4"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                      page.isActive ? 'bg-cyan-600/20' : 'bg-gray-700'
                    }`}>
                      <DocumentTextIcon className={`w-5 h-5 ${
                        page.isActive ? 'text-cyan-400' : 'text-gray-500'
                      }`} />
                    </div>
                    
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-lg">{page.pageName}</h3>
                        {page.isActive ? (
                          <span className="text-xs bg-green-500/20 text-green-400 px-2 py-0.5 rounded-full border border-green-500">
                            Active
                          </span>
                        ) : (
                          <span className="text-xs bg-red-500/20 text-red-400 px-2 py-0.5 rounded-full border border-red-500">
                            Inactive
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-400">
                        ID: <span className="text-cyan-400">{page.pageId}</span>
                      </p>
                      {page.description && (
                        <p className="text-xs text-gray-500 mt-1">{page.description}</p>
                      )}
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => handleToggleStatus(page._id)}
                      className="p-2 hover:bg-gray-700 rounded-lg transition"
                      title="Toggle Status"
                    >
                      <ArrowPathIcon className="w-5 h-5" />
                    </button>
                    
                    <button
                      onClick={() => handleEdit(page)}
                      className="p-2 hover:bg-yellow-600 rounded-lg transition"
                      title="Edit"
                    >
                      <PencilIcon className="w-5 h-5" />
                    </button>
                    
                    <button
                      onClick={() => handleDelete(page._id)}
                      className="p-2 hover:bg-red-600 rounded-lg transition"
                      title="Delete"
                    >
                      <TrashIcon className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}

            {pages.length === 0 && (
              <div className="text-center py-12">
                <DocumentTextIcon className="w-20 h-20 text-gray-600 mx-auto mb-4" />
                <p className="text-gray-400 text-lg">No pages found</p>
                <p className="text-gray-500">Click "Add New Page" to create your first page</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}