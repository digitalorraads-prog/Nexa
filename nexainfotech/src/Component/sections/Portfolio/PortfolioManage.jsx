import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../../../Protected/axios"; // ✅ Correct - using custom axios instance
import {
  PlusIcon,
  PencilIcon,
  TrashIcon,
  EyeIcon,
  LinkIcon,
  PhotoIcon,
  FolderIcon,
  SparklesIcon,
  CloudArrowUpIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';

export default function PortfolioManage() {
  const navigate = useNavigate();

  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [expandedId, setExpandedId] = useState(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [message, setMessage] = useState("");
  const [form, setForm] = useState({
    title: "",
    category: "",
    image: "",
    link: "",
  });

  const fetchData = async () => {
    setLoading(true);
    try {
      // ✅ Fixed: Using relative path with axios instance
      const { data } = await axios.get("/api/portfolio");
      setProjects(data);
    } catch (error) {
      console.error("Fetch error:", error);
      if (error.response?.status === 401) {
        navigate("/admin/login");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // ========== IMAGE UPLOAD FUNCTION ==========
  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validation
    if (!file.type.startsWith('image/')) {
      setMessage("❌ Please select an image file");
      setTimeout(() => setMessage(""), 3000);
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setMessage("❌ File size should be less than 5MB");
      setTimeout(() => setMessage(""), 3000);
      return;
    }

    setUploadingImage(true);
    setMessage("📤 Uploading image...");

    const uploadFormData = new FormData();
    uploadFormData.append('image', file);

    try {
      // ✅ Fixed: Using relative path with axios instance
      const response = await axios.post(
        '/api/portfolio/upload-image',
        uploadFormData,
        {
          headers: { 'Content-Type': 'multipart/form-data' }
        }
      );

      if (response.data.success) {
        setForm({
          ...form,
          image: response.data.data.url
        });
        setMessage("✅ Image uploaded successfully!");
        setTimeout(() => setMessage(""), 3000);
      }
    } catch (error) {
      console.error('Upload error:', error);
      setMessage(error.response?.data?.message || "❌ Image upload failed");
      setTimeout(() => setMessage(""), 3000);
    } finally {
      setUploadingImage(false);
    }
  };

  // Remove uploaded image
  const removeImage = () => {
    setForm({ ...form, image: "" });
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this project?")) return;

    try {
      // ✅ Fixed: Using relative path with axios instance
      await axios.delete(`/api/portfolio/${id}`);
      fetchData();
      setMessage("✅ Project deleted successfully!");
      setTimeout(() => setMessage(""), 3000);
    } catch (error) {
      console.error("Delete error:", error);
      if (error.response?.status === 401) {
        navigate("/admin/login");
      } else {
        setMessage(error.response?.data?.message || "❌ Delete Failed");
        setTimeout(() => setMessage(""), 3000);
      }
    }
  };

  const handleEditClick = (project) => {
    if (editingId === project._id) {
      setEditingId(null);
      setForm({ title: "", category: "", image: "", link: "" });
      setMessage("");
    } else {
      setEditingId(project._id);
      setForm({
        title: project.title,
        category: project.category,
        image: project.image,
        link: project.link || "",
      });
      setMessage("");
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();

    if (!form.title?.trim() || !form.category?.trim() || !form.image?.trim()) {
      setMessage("❌ Title, category and image are required");
      setTimeout(() => setMessage(""), 3000);
      return;
    }

    try {
      // ✅ Fixed: Using relative path with axios instance
      await axios.put(`/api/portfolio/${editingId}`, form);

      setEditingId(null);
      setForm({ title: "", category: "", image: "", link: "" });
      fetchData();
      setMessage("✅ Project Updated Successfully!");
      setTimeout(() => setMessage(""), 3000);
    } catch (error) {
      console.error("Update error:", error);
      if (error.response?.status === 401) {
        navigate("/admin/login");
      } else {
        setMessage(error.response?.data?.message || "❌ Update Failed");
        setTimeout(() => setMessage(""), 3000);
      }
    }
  };

  const toggleExpand = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

  // Stats calculation
  const stats = {
    total: projects.length,
    withLinks: projects.filter(p => p.link).length,
    categories: [...new Set(projects.map(p => p.category))].length
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white text-lg">Loading Portfolio...</p>
        </div>
      </div>
    );
  }

  return (
    <section className="bg-transparent text-white">

      {/* Header */}
      <div className="mb-10">
        <h1 className="text-4xl font-bold text-cyan-400 mb-4 flex items-center gap-3">
          <SparklesIcon className="w-10 h-10" />
          Portfolio Management
        </h1>
        <p className="text-gray-400">Manage your portfolio projects</p>
      </div>

      {/* Message Alert */}
      {message && (
        <div className={`mb-6 p-4 rounded-lg ${message.includes('✅') ? 'bg-green-500/20 border border-green-500 text-green-400' :
            message.includes('❌') ? 'bg-red-500/20 border border-red-500 text-red-400' :
              'bg-yellow-500/20 border border-yellow-500 text-yellow-400'
          }`}>
          {message}
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <div className="bg-cyan-900/20 border border-cyan-500 rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Total Projects</p>
              <p className="text-3xl font-bold text-white">{stats.total}</p>
            </div>
            <FolderIcon className="w-10 h-10 text-cyan-400" />
          </div>
        </div>

        <div className="bg-green-900/30 border border-green-500 rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">With Links</p>
              <p className="text-3xl font-bold text-green-400">{stats.withLinks}</p>
            </div>
            <LinkIcon className="w-10 h-10 text-green-400" />
          </div>
        </div>

        <div className="bg-yellow-900/20 border border-yellow-500 rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Categories</p>
              <p className="text-3xl font-bold text-yellow-400">{stats.categories}</p>
            </div>
            <PhotoIcon className="w-10 h-10 text-yellow-400" />
          </div>
        </div>
      </div>

      {/* Actions Bar */}
      <div className="mb-8 flex justify-between items-center">
        <button
          onClick={fetchData}
          className="bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded-lg transition flex items-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          Refresh
        </button>

        <button
          onClick={() => navigate("/admin/add-portfolio")}
          className="bg-linear-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 px-6 py-3 rounded-lg font-semibold transition flex items-center gap-2 shadow-lg"
        >
          <PlusIcon className="w-5 h-5" />
          Add New Project
        </button>
      </div>

      {/* Projects Grid */}
      {projects.length === 0 ? (
        <div className="text-center py-20">
          <FolderIcon className="w-20 h-20 text-gray-600 mx-auto mb-4" />
          <p className="text-gray-400 text-xl">No projects found.</p>
          <button
            onClick={() => navigate("/admin/add-portfolio")}
            className="mt-4 bg-cyan-600 hover:bg-cyan-700 px-6 py-3 rounded-lg transition inline-flex items-center gap-2"
          >
            <PlusIcon className="w-5 h-5" />
            Add Your First Project
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <div
              key={project._id}
              className="bg-[#1a1a2e] rounded-2xl border border-gray-800 overflow-hidden hover:border-cyan-500/50 transition-all duration-300 hover:shadow-[0_0_30px_rgba(0,255,255,0.1)]"
            >
              {/* Image */}
              <div className="relative h-48 overflow-hidden group">
                <img
                  src={project.image}
                  alt={project.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  onError={(e) => {
                    e.target.src = "https://via.placeholder.com/400x200?text=No+Image";
                  }}
                />
                {project.link && (
                  <a
                    href={project.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="absolute top-3 right-3 bg-cyan-500 p-2 rounded-full hover:bg-cyan-600 transition shadow-lg"
                    title="Visit Project"
                  >
                    <LinkIcon className="w-4 h-4" />
                  </a>
                )}
              </div>

              {/* Content */}
              <div className="p-5">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="text-xl font-semibold text-white">
                    {project.title}
                  </h3>
                  <span className="px-2 py-1 bg-cyan-500/20 text-cyan-400 text-xs rounded-full">
                    {project.category}
                  </span>
                </div>

                {/* Actions */}
                <div className="flex gap-2 mt-4">
                  <button
                    onClick={() => toggleExpand(project._id)}
                    className="flex-1 bg-gray-700 hover:bg-gray-600 px-3 py-2 rounded-lg transition flex items-center justify-center gap-2 text-sm"
                  >
                    <EyeIcon className="w-4 h-4" />
                    {expandedId === project._id ? "Less" : "Details"}
                  </button>

                  <button
                    onClick={() => handleEditClick(project)}
                    className="flex-1 bg-yellow-600 hover:bg-yellow-700 px-3 py-2 rounded-lg transition flex items-center justify-center gap-2 text-sm"
                  >
                    <PencilIcon className="w-4 h-4" />
                    {editingId === project._id ? "Cancel" : "Edit"}
                  </button>

                  <button
                    onClick={() => handleDelete(project._id)}
                    className="flex-1 bg-red-600 hover:bg-red-700 px-3 py-2 rounded-lg transition flex items-center justify-center gap-2 text-sm"
                  >
                    <TrashIcon className="w-4 h-4" />
                    Delete
                  </button>
                </div>

                {/* Details View */}
                {expandedId === project._id && (
                  <div className="mt-4 p-3 bg-[#0f0f1a] rounded-lg border border-gray-700">
                    <p className="text-sm text-gray-300">
                      <span className="text-gray-400">Project ID:</span>{" "}
                      <span className="font-mono text-cyan-400">{project._id?.slice(-8)}</span>
                    </p>
                    {project.link && (
                      <p className="text-sm text-gray-300 mt-2">
                        <span className="text-gray-400">Link:</span>{" "}
                        <a
                          href={project.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-cyan-400 hover:underline break-all"
                        >
                          {project.link}
                        </a>
                      </p>
                    )}
                    <p className="text-sm text-gray-300 mt-2">
                      <span className="text-gray-400">Added:</span>{" "}
                      {new Date(project.createdAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                      })}
                    </p>
                  </div>
                )}

                {/* Edit Form */}
                {editingId === project._id && (
                  <form onSubmit={handleUpdate} className="mt-4 space-y-3">
                    {/* Image Upload Section */}
                    <div className="space-y-2">
                      <label className="block text-sm text-gray-400">
                        Update Image
                      </label>

                      {form.image ? (
                        <div className="relative inline-block">
                          <img
                            src={form.image}
                            alt="Preview"
                            className="w-20 h-20 object-cover rounded-lg border border-cyan-400"
                            onError={(e) => {
                              e.target.src = "https://via.placeholder.com/150?text=Error";
                            }}
                          />
                          <button
                            type="button"
                            onClick={removeImage}
                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                          >
                            <XMarkIcon className="w-4 h-4" />
                          </button>
                        </div>
                      ) : (
                        <label className="relative flex items-center justify-center gap-2 bg-[#0f0f1a] border-2 border-dashed border-gray-600 hover:border-cyan-400 px-4 py-2 rounded-lg transition cursor-pointer">
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageUpload}
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                            disabled={uploadingImage}
                          />
                          {uploadingImage ? (
                            <>
                              <div className="w-5 h-5 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin"></div>
                              <span>Uploading...</span>
                            </>
                          ) : (
                            <>
                              <CloudArrowUpIcon className="w-5 h-5" />
                              <span>Upload New Image</span>
                            </>
                          )}
                        </label>
                      )}
                    </div>

                    <input
                      type="text"
                      value={form.title}
                      onChange={(e) => setForm({ ...form, title: e.target.value })}
                      placeholder="Project Title"
                      className="w-full p-2 bg-[#0f0f1a] border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-cyan-400"
                      required
                    />

                    <input
                      type="text"
                      value={form.category}
                      onChange={(e) => setForm({ ...form, category: e.target.value })}
                      placeholder="Category"
                      className="w-full p-2 bg-[#0f0f1a] border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-cyan-400"
                      required
                    />

                    <input
                      type="text"
                      value={form.link}
                      onChange={(e) => setForm({ ...form, link: e.target.value })}
                      placeholder="Project Link (Optional)"
                      className="w-full p-2 bg-[#0f0f1a] border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-cyan-400"
                    />

                    <button
                      type="submit"
                      className="w-full bg-linear-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 py-2 rounded-lg font-semibold transition"
                    >
                      Update Project
                    </button>
                  </form>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
