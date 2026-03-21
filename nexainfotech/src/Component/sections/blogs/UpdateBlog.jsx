import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../../../Protected/axios"; // Your protected axios instance
import {
  PlusIcon,
  PencilIcon,
  TrashIcon,
  EyeIcon,
  UserIcon,
  DocumentTextIcon,
  PhotoIcon,
  SparklesIcon,
  CalendarIcon,
  CloudArrowUpIcon,
  XMarkIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  ArrowPathIcon
} from '@heroicons/react/24/outline';

export default function UpdateBlog() {
  const navigate = useNavigate();

  const [blogs, setBlogs] = useState([]);
  const [filteredBlogs, setFilteredBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [expandedId, setExpandedId] = useState(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  
  // Filter states
  const [searchTerm, setSearchTerm] = useState("");
  const [filterAuthor, setFilterAuthor] = useState("");
  const [filterCategory, setFilterCategory] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    image: "",
    author: "",
  });
  const [message, setMessage] = useState("");

  /* ================= FETCH BLOGS ================= */
  const fetchBlogs = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get("/api/blogs"); // Removed localhost:5000
      setBlogs(data);
      setFilteredBlogs(data);
      setMessage("");
    } catch (err) {
      console.error(err);
      if (err.response?.status === 401) {
        navigate("/admin/login");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  /* ================= FILTER FUNCTION ================= */
  useEffect(() => {
    let filtered = [...blogs];

    // Search by title or content
    if (searchTerm) {
      filtered = filtered.filter(blog => 
        blog.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        blog.content.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by author
    if (filterAuthor) {
      filtered = filtered.filter(blog => blog.author === filterAuthor);
    }

    setFilteredBlogs(filtered);
  }, [searchTerm, filterAuthor, blogs]);

  /* ================= GET UNIQUE AUTHORS ================= */
  const uniqueAuthors = [...new Set(blogs.map(blog => blog.author))];

  /* ================= RESET FILTERS ================= */
  const resetFilters = () => {
    setSearchTerm("");
    setFilterAuthor("");
    setFilteredBlogs(blogs);
  };

  /* ================= IMAGE UPLOAD ================= */
  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

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

    const formData = new FormData();
    formData.append('image', file);

    try {
      const response = await axios.post(
        '/api/blogs/upload-image', // Removed localhost:5000
        formData,
        { headers: { 'Content-Type': 'multipart/form-data' } }
      );

      if (response.data.success) {
        setFormData(prev => ({
          ...prev,
          image: response.data.data.url
        }));
        setMessage("✅ Image uploaded successfully!");
        setTimeout(() => setMessage(""), 3000);
      }
    } catch (err) {
      console.error('Upload error:', err);
      setMessage("❌ Image upload failed");
    } finally {
      setUploadingImage(false);
    }
  };

  const removeImage = () => {
    setFormData(prev => ({ ...prev, image: "" }));
  };

  /* ================= SELECT BLOG ================= */
  const handleEditClick = (blog) => {
    if (editingId === blog._id) {
      setEditingId(null);
      setFormData({
        title: "",
        content: "",
        image: "",
        author: "",
      });
    } else {
      setEditingId(blog._id);
      setFormData({
        title: blog.title,
        content: blog.content,
        image: blog.image,
        author: blog.author,
      });
    }
    setMessage("");
  };

  /* ================= UPDATE BLOG ================= */
  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!editingId) return;

    if (!formData.title || !formData.content || !formData.image || !formData.author) {
      setMessage("❌ All fields are required");
      return;
    }

    try {
      setLoading(true);
      await axios.put(
        `/api/blogs/${editingId}`, // Removed localhost:5000
        formData
      );
      setMessage("✅ Blog Updated Successfully!");
      setEditingId(null);
      setFormData({
        title: "",
        content: "",
        image: "",
        author: "",
      });
      fetchBlogs();
    } catch (err) {
      console.error(err);
      setMessage("❌ Update Failed");
      if (err.response?.status === 401) {
        navigate("/admin/login");
      }
    } finally {
      setLoading(false);
    }
  };

  /* ================= DELETE BLOG ================= */
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this blog?")) return;

    try {
      await axios.delete(`/api/blogs/${id}`); // Removed localhost:5000
      fetchBlogs();
      if (editingId === id) {
        setEditingId(null);
        setFormData({
          title: "",
          content: "",
          image: "",
          author: "",
        });
      }
      setMessage("✅ Blog Deleted Successfully!");
    } catch (err) {
      console.error(err);
      setMessage("❌ Delete Failed");
      if (err.response?.status === 401) {
        navigate("/admin/login");
      }
    }
  };

  /* ================= TOGGLE DETAILS ================= */
  const toggleExpand = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

  // Stats calculation
  const stats = {
    total: blogs.length,
    filtered: filteredBlogs.length,
    withImages: blogs.filter(b => b.image).length,
    authors: uniqueAuthors.length
  };

  if (loading && blogs.length === 0) {
    return (
      <div className="min-h-screen bg-[#0f0f1a] flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white text-lg">Loading Blogs...</p>
        </div>
      </div>
    );
  }

  return (
    <section className="bg-[#0f0f1a] min-h-screen text-white pt-20 pb-10 px-5">
      
      {/* Header */}
      <div className="mb-10">
        <h1 className="text-4xl font-bold text-cyan-400 mb-4 flex items-center gap-3">
          <SparklesIcon className="w-10 h-10" />
          Blog Management
        </h1>
        <p className="text-gray-400">Manage your blog posts</p>
      </div>

      {/* Message Alert */}
      {message && (
        <div className={`mb-6 p-4 rounded-lg ${
          message.includes('✅') ? 'bg-green-500/20 border border-green-500 text-green-400' :
          message.includes('❌') ? 'bg-red-500/20 border border-red-500 text-red-400' :
          'bg-yellow-500/20 border border-yellow-500 text-yellow-400'
        }`}>
          {message}
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-8">
        <div className="bg-cyan-900/20 border border-cyan-500 rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Total Blogs</p>
              <p className="text-3xl font-bold text-white">{stats.total}</p>
            </div>
            <DocumentTextIcon className="w-10 h-10 text-cyan-400" />
          </div>
        </div>
        
        <div className="bg-green-900/30 border border-green-500 rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">With Images</p>
              <p className="text-3xl font-bold text-green-400">{stats.withImages}</p>
            </div>
            <PhotoIcon className="w-10 h-10 text-green-400" />
          </div>
        </div>
        
        <div className="bg-yellow-900/20 border border-yellow-500 rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Authors</p>
              <p className="text-3xl font-bold text-yellow-400">{stats.authors}</p>
            </div>
            <UserIcon className="w-10 h-10 text-yellow-400" />
          </div>
        </div>

        <div className="bg-purple-900/20 border border-purple-500 rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Showing</p>
              <p className="text-3xl font-bold text-purple-400">{stats.filtered}</p>
            </div>
            <MagnifyingGlassIcon className="w-10 h-10 text-purple-400" />
          </div>
        </div>
      </div>

      {/* Search and Filter Bar */}
      <div className="mb-8 space-y-4">
        {/* Main Controls */}
        <div className="flex flex-wrap gap-3 items-center justify-between">
          <div className="flex gap-2">
            {/* Refresh Button */}
            <button
              onClick={fetchBlogs}
              className="bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded-lg transition flex items-center gap-2"
              title="Refresh Blogs"
            >
              <ArrowPathIcon className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </button>

            {/* Filter Toggle Button */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`px-4 py-2 rounded-lg transition flex items-center gap-2 ${
                showFilters ? 'bg-cyan-600' : 'bg-gray-700 hover:bg-gray-600'
              }`}
            >
              <FunnelIcon className="w-5 h-5" />
              Filters
            </button>

            {/* Reset Filters Button */}
            {(searchTerm || filterAuthor) && (
              <button
                onClick={resetFilters}
                className="bg-yellow-600 hover:bg-yellow-700 px-4 py-2 rounded-lg transition flex items-center gap-2"
              >
                <XMarkIcon className="w-5 h-5" />
                Reset Filters
              </button>
            )}
          </div>

          {/* Add Blog Button */}
          <button
            onClick={() => navigate("/admin/add-blog")}
            className="bg-linear-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 px-6 py-2 rounded-lg font-semibold transition flex items-center gap-2 shadow-lg"
          >
            <PlusIcon className="w-5 h-5" />
            Add New Blog
          </button>
        </div>

        {/* Filter Panel */}
        {showFilters && (
          <div className="bg-[#1a1a2e] rounded-xl border border-gray-700 p-4 grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Search Input */}
            <div>
              <label className="block text-sm text-gray-400 mb-1">
                Search by Title/Content
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search blogs..."
                  className="w-full pl-10 pr-4 py-2 bg-[#0f0f1a] border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-cyan-400"
                />
                <MagnifyingGlassIcon className="w-5 h-5 text-gray-500 absolute left-3 top-2.5" />
              </div>
            </div>

            {/* Author Filter */}
            <div>
              <label className="block text-sm text-gray-400 mb-1">
                Filter by Author
              </label>
              <select
                value={filterAuthor}
                onChange={(e) => setFilterAuthor(e.target.value)}
                className="w-full px-4 py-2 bg-[#0f0f1a] border border-gray-700 rounded-lg text-white focus:outline-none focus:border-cyan-400"
              >
                <option value="">All Authors</option>
                {uniqueAuthors.map(author => (
                  <option key={author} value={author}>{author}</option>
                ))}
              </select>
            </div>

            {/* Results Count */}
            <div className="flex items-end">
              <div className="w-full px-4 py-2 bg-cyan-900/20 border border-cyan-500/30 rounded-lg">
                <p className="text-sm text-gray-400">Found: <span className="text-cyan-400 font-bold text-lg ml-2">{filteredBlogs.length}</span></p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Blogs Grid */}
      {filteredBlogs.length === 0 ? (
        <div className="text-center py-20">
          <DocumentTextIcon className="w-20 h-20 text-gray-600 mx-auto mb-4" />
          <p className="text-gray-400 text-xl">
            {blogs.length === 0 ? "No blogs found." : "No blogs match your filters."}
          </p>
          {blogs.length > 0 && (
            <button
              onClick={resetFilters}
              className="mt-4 bg-cyan-600 hover:bg-cyan-700 px-6 py-3 rounded-lg transition inline-flex items-center gap-2"
            >
              <XMarkIcon className="w-5 h-5" />
              Clear Filters
            </button>
          )}
          {blogs.length === 0 && (
            <button
              onClick={() => navigate("/admin/add-blog")}
              className="mt-4 bg-cyan-600 hover:bg-cyan-700 px-6 py-3 rounded-lg transition inline-flex items-center gap-2"
            >
              <PlusIcon className="w-5 h-5" />
              Write Your First Blog
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredBlogs.map((blog) => (
            <div
              key={blog._id}
              className="bg-[#1a1a2e] rounded-2xl border border-gray-800 overflow-hidden hover:border-cyan-500/50 transition-all duration-300 hover:shadow-[0_0_30px_rgba(0,255,255,0.1)]"
            >
              {/* Image */}
              <div className="relative h-48 overflow-hidden">
                {blog.image ? (
                  <img
                    src={blog.image}
                    alt={blog.title}
                    className="w-full h-full object-cover hover:scale-110 transition-transform duration-500"
                    onError={(e) => {
                      e.target.src = "https://via.placeholder.com/400x200?text=No+Image";
                    }}
                  />
                ) : (
                  <div className="w-full h-full bg-linear-to-br from-gray-800 to-gray-900 flex items-center justify-center">
                    <PhotoIcon className="w-16 h-16 text-gray-600" />
                  </div>
                )}
                <div className="absolute top-3 right-3 bg-cyan-500/20 backdrop-blur-sm px-2 py-1 rounded-full text-xs text-cyan-400 border border-cyan-500/30">
                  {blog.author}
                </div>
              </div>

              {/* Content */}
              <div className="p-5">
                <h3 className="text-xl font-semibold text-white mb-2 line-clamp-2">
                  {blog.title}
                </h3>
                
                <p className="text-gray-400 text-sm mb-4 line-clamp-3">
                  {blog.content}
                </p>

                {/* Actions */}
                <div className="flex gap-2 mt-4">
                  <button
                    onClick={() => toggleExpand(blog._id)}
                    className="flex-1 bg-gray-700 hover:bg-gray-600 px-3 py-2 rounded-lg transition flex items-center justify-center gap-2 text-sm"
                  >
                    <EyeIcon className="w-4 h-4" />
                    {expandedId === blog._id ? "Less" : "Details"}
                  </button>

                  <button
                    onClick={() => handleEditClick(blog)}
                    className="flex-1 bg-yellow-600 hover:bg-yellow-700 px-3 py-2 rounded-lg transition flex items-center justify-center gap-2 text-sm"
                  >
                    <PencilIcon className="w-4 h-4" />
                    {editingId === blog._id ? "Cancel" : "Edit"}
                  </button>

                  <button
                    onClick={() => handleDelete(blog._id)}
                    className="flex-1 bg-red-600 hover:bg-red-700 px-3 py-2 rounded-lg transition flex items-center justify-center gap-2 text-sm"
                  >
                    <TrashIcon className="w-4 h-4" />
                    Delete
                  </button>
                </div>

                {/* Details View */}
                {expandedId === blog._id && (
                  <div className="mt-4 p-3 bg-[#0f0f1a] rounded-lg border border-gray-700">
                    <p className="text-sm text-gray-300">
                      <span className="text-gray-400">Blog ID:</span>{" "}
                      <span className="font-mono text-cyan-400">{blog._id.slice(-8)}</span>
                    </p>
                    
                    <p className="text-sm text-gray-300 mt-2">
                      <span className="text-gray-400">Author:</span>{" "}
                      <span className="text-cyan-400">{blog.author}</span>
                    </p>

                    <p className="text-sm text-gray-300 mt-2">
                      <span className="text-gray-400">Content Preview:</span>{" "}
                      <span className="text-gray-300">
                        {blog.content.slice(0, 100)}...
                      </span>
                    </p>

                    {blog.image && (
                      <p className="text-sm text-gray-300 mt-2">
                        <span className="text-gray-400">Image URL:</span>{" "}
                        <a 
                          href={blog.image} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-cyan-400 hover:underline break-all"
                        >
                          {blog.image.slice(0, 50)}...
                        </a>
                      </p>
                    )}

                    <p className="text-sm text-gray-300 mt-2 flex items-center gap-1">
                      <CalendarIcon className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-400">Added:</span>{" "}
                      {new Date(blog.createdAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                      })}
                    </p>
                  </div>
                )}

                {/* Edit Form */}
                {editingId === blog._id && (
                  <form onSubmit={handleUpdate} className="mt-4 space-y-3">
                    
                    {/* Image Upload in Edit */}
                    <div className="space-y-2">
                      <label className="block text-sm text-gray-400">
                        Update Image
                      </label>
                      
                      {formData.image ? (
                        <div className="relative inline-block">
                          <img 
                            src={formData.image} 
                            alt="Preview" 
                            className="w-20 h-20 object-cover rounded-lg border border-cyan-400"
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
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      placeholder="Blog Title"
                      className="w-full p-2 bg-[#0f0f1a] border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-cyan-400"
                      required
                    />

                    <textarea
                      value={formData.content}
                      onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                      placeholder="Blog Content"
                      rows="4"
                      className="w-full p-2 bg-[#0f0f1a] border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-cyan-400 resize-none"
                      required
                    />

                    <input
                      type="text"
                      value={formData.author}
                      onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                      placeholder="Author Name"
                      className="w-full p-2 bg-[#0f0f1a] border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-cyan-400"
                      required
                    />

                    <button
                      type="submit"
                      disabled={loading || uploadingImage}
                      className="w-full bg-linear-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 py-2 rounded-lg font-semibold transition disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {loading ? "Updating..." : "Update Blog"}
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
