import { useState } from "react";
import axios from "../../../Protected/axios";
import { PhotoIcon, XMarkIcon, CloudArrowUpIcon } from '@heroicons/react/24/outline';

export default function AddBlogForm() {
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    image: "",
    author: "",
  });

  const [loading, setLoading] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // ========== CLOUDINARY IMAGE UPLOAD ==========
  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validation
    if (!file.type.startsWith('image/')) {
      setError("❌ Please select an image file");
      setTimeout(() => setError(""), 3000);
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError("❌ File size should be less than 5MB");
      setTimeout(() => setError(""), 3000);
      return;
    }

    setUploadingImage(true);
    setError("");

    const uploadFormData = new FormData();
    uploadFormData.append('image', file);

    try {
      const response = await axios.post(
        '/api/blogs/upload-image',
        uploadFormData,
        {
          headers: { 'Content-Type': 'multipart/form-data' }
        }
      );

      if (response.data.success) {
        setFormData({
          ...formData,
          image: response.data.data.url
        });
        setSuccess("✅ Image uploaded successfully!");
        setTimeout(() => setSuccess(""), 3000);
      }
    } catch (err) {
      console.error('Upload error:', err);
      setError(err.response?.data?.message || "❌ Image upload failed");
    } finally {
      setUploadingImage(false);
    }
  };

  // Remove uploaded image
  const removeImage = () => {
    setFormData({ ...formData, image: "" });
  };

  // ✅ FIXED: Safe validation with optional chaining
  const validateForm = () => {
    if (!formData.title?.trim()) return "Title is required";
    if (!formData.content?.trim()) return "Content is required";
    if (!formData.image?.trim()) return "Image is required";
    if (!formData.author?.trim()) return "Author name is required";
    return "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    try {
      setLoading(true);
      setError("");
      setSuccess("");

      const response = await axios.post("/api/blogs", formData);

      console.log("Saved Blog:", response.data);

      setSuccess("Blog Published Successfully 🚀");

      // Reset form
      setFormData({
        title: "",
        content: "",
        image: "",
        author: "",
      });

    } catch (err) {
      console.error("Error:", err);
      setError(err.response?.data?.message || "Failed to publish blog. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0c0c16] flex items-center justify-center px-4 py-20">
      <div className="w-full max-w-2xl bg-gradient-to-br from-[#111122] to-[#0c0c16] border border-cyan-500/20 rounded-3xl shadow-[0_0_40px_rgba(0,255,255,0.15)] p-10 backdrop-blur-xl">

        <h2 className="text-3xl font-bold text-center text-cyan-400 mb-10 tracking-wide">
          Add New Blog
        </h2>

        {error && (
          <div className="bg-red-500/10 border border-red-500 text-red-400 p-3 rounded-lg text-sm mb-6">
            {error}
          </div>
        )}

        {success && (
          <div className="bg-green-500/10 border border-green-500 text-green-400 p-3 rounded-lg text-sm mb-6">
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">

          {/* ===== IMAGE UPLOAD SECTION ===== */}
          <div>
            <label className="block text-sm text-gray-400 mb-2">
              Blog Image <span className="text-red-500">*</span>
            </label>

            {formData.image ? (
              <div className="relative inline-block">
                <img 
                  src={formData.image} 
                  alt="Preview" 
                  className="w-32 h-32 object-cover rounded-lg border-2 border-cyan-400"
                  onError={(e) => {
                    e.target.src = 'https://via.placeholder.com/150?text=Image+Error';
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
              <div className="space-y-3">
                <label className="relative flex items-center justify-center gap-2 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 px-4 py-3 rounded-lg font-medium transition cursor-pointer w-full">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    disabled={uploadingImage}
                  />
                  {uploadingImage ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Uploading...</span>
                    </>
                  ) : (
                    <>
                      <CloudArrowUpIcon className="w-5 h-5" />
                      <span>📁 Upload Image</span>
                    </>
                  )}
                </label>

                <p className="text-gray-500 text-xs text-center">
                  Max 5MB, JPG/PNG/WEBP format
                </p>
              </div>
            )}
          </div>

          {/* Title */}
          <div>
            <label className="block text-sm text-gray-400 mb-2">
              Blog Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Enter blog title"
              className="w-full px-4 py-3 rounded-xl bg-[#0f172a] text-white border border-gray-700 focus:border-cyan-500 outline-none transition"
            />
          </div>

          {/* Content */}
          <div>
            <label className="block text-sm text-gray-400 mb-2">
              Blog Content <span className="text-red-500">*</span>
            </label>
            <textarea
              name="content"
              value={formData.content}
              onChange={handleChange}
              rows="6"
              placeholder="Write full blog content..."
              className="w-full px-4 py-3 rounded-xl bg-[#0f172a] text-white border border-gray-700 focus:border-cyan-500 outline-none transition"
            />
          </div>

          {/* Author */}
          <div>
            <label className="block text-sm text-gray-400 mb-2">
              Author Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="author"
              value={formData.author}
              onChange={handleChange}
              placeholder="Enter author name"
              className="w-full px-4 py-3 rounded-xl bg-[#0f172a] text-white border border-gray-700 focus:border-cyan-500 outline-none transition"
            />
          </div>

          {/* Image URL (Hidden - Auto-filled) */}
          <input type="hidden" name="image" value={formData.image} />

          {/* Submit */}
          <button
            type="submit"
            disabled={loading || uploadingImage}
            className={`w-full py-3 rounded-full font-semibold tracking-wide transition-all duration-300 ${
              loading || uploadingImage
                ? "bg-gray-600 cursor-not-allowed"
                : "bg-gradient-to-r from-[#004C7D] to-[#158EB0] hover:scale-105"
            } text-white`}
          >
            {loading ? "Publishing Blog..." : "Publish Blog"}
          </button>

        </form>
      </div>
    </div>
  );
}