import { useState } from "react";
import axios from "../../../Protected/axios"; // ✅ Correct - using custom axios instance
import { PhotoIcon, XMarkIcon } from '@heroicons/react/24/outline';

export default function PortfolioAdd() {
  const [form, setForm] = useState({
    title: "",
    category: "",
    image: "",
    link: ""
  });

  const [loading, setLoading] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // ========== SIMPLE FILE UPLOAD ==========
  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validation
    if (!file.type.startsWith('image/')) {
      setMessage("❌ Please select an image file");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setMessage("❌ File size should be less than 5MB");
      return;
    }

    setUploadingImage(true);
    setMessage("📤 Uploading...");

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
      setMessage("❌ Upload failed: " + (error.response?.data?.message || error.message));
    } finally {
      setUploadingImage(false);
    }
  };

  // Remove image
  const removeImage = () => {
    setForm({ ...form, image: "" });
    setMessage("");
  };

  // Submit form
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.image) {
      setMessage("❌ Please upload an image first");
      return;
    }

    if (!form.title || !form.category) {
      setMessage("❌ Title and category are required");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      const payload = {
        title: form.title,
        category: form.category,
        image: form.image,
        link: form.link || ""
      };

      // ✅ Fixed: Using relative path with axios instance
      await axios.post("/api/portfolio", payload);

      setMessage("✅ Portfolio Added Successfully!");

      // Form reset
      setForm({
        title: "",
        category: "",
        image: "",
        link: ""
      });

    } catch (error) {
      console.error('Submit error:', error);
      setMessage(error.response?.data?.message || "❌ Error Adding Portfolio");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="text-white flex justify-center items-center py-6">
      <div className="w-full max-w-lg bg-[#1a1a2e] border border-white/10 p-8 rounded-2xl shadow-lg">

        <h2 className="text-3xl font-bold text-center mb-8 text-cyan-400">
          Add Portfolio
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">

          {/* Image Upload Section */}
          <div className="border-b border-gray-700 pb-6">
            <label className="block mb-2 text-sm text-gray-400">
              Portfolio Image <span className="text-red-500">*</span>
            </label>

            {form.image ? (
              <div className="relative inline-block">
                <img
                  src={form.image}
                  alt="Preview"
                  className="w-32 h-32 object-cover rounded-lg border-2 border-cyan-400"
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
              <div className="space-y-3">
                <label className="relative flex items-center justify-center gap-2 bg-linear-to-r from-[#004C7D] to-[#158EB0] hover:from-[#005a94] hover:to-[#1aa0c9] px-4 py-4 rounded-lg font-medium transition cursor-pointer w-full">
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
                      <PhotoIcon className="w-5 h-5" />
                      <span>📁 Choose Image</span>
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
            <label className="block mb-2 text-sm text-gray-400">
              Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="title"
              value={form.title}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 rounded-lg bg-[#111122] border border-gray-700 focus:border-cyan-500 outline-none"
              placeholder="e.g., E-commerce Website"
            />
          </div>

          {/* Category */}
          <div>
            <label className="block mb-2 text-sm text-gray-400">
              Category <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="category"
              value={form.category}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 rounded-lg bg-[#111122] border border-gray-700 focus:border-cyan-500 outline-none"
              placeholder="e.g., Web Development"
            />
          </div>

          {/* Project Link */}
          <div>
            <label className="block mb-2 text-sm text-gray-400">
              Project Link (Optional)
            </label>
            <input
              type="url"
              name="link"
              value={form.link}
              onChange={handleChange}
              placeholder="https://example.com"
              className="w-full px-4 py-3 rounded-lg bg-[#111122] border border-gray-700 focus:border-cyan-500 outline-none"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading || uploadingImage || !form.image}
            className="w-full py-3 rounded-full bg-linear-to-r from-green-500 to-emerald-500 font-semibold hover:scale-105 transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Adding..." : "➕ Add Portfolio"}
          </button>

          {message && (
            <p className={`text-center mt-4 text-sm ${message.includes('✅') ? 'text-green-400' :
                message.includes('❌') ? 'text-red-400' :
                  'text-yellow-400'
              }`}>
              {message}
            </p>
          )}
        </form>
      </div>
    </div>
  );
}
