import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "../../../Protected/axios"; // ✅ Correct import path

export default function SingleBlog() {
  const { id } = useParams();
  const navigate = useNavigate(); // ✅ Uncommented for back button

  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        // ✅ Using axios instance - no need for full URL
        const { data } = await axios.get(`/api/blogs/${id}`);
        setBlog(data); // ✅ now backend sends direct blog object
      } catch (error) {
        console.error("Error fetching blog:", error);
        setError(error.response?.data?.message || "Failed to load blog.");
      } finally {
        setLoading(false);
      }
    };

    fetchBlog();
  }, [id]);

  if (loading)
    return (
      <div className="min-h-screen bg-[#0f0f1a] flex items-center justify-center">
        <div className="text-center text-cyan-400">
          <div className="w-16 h-16 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p>Loading blog...</p>
        </div>
      </div>
    );

  if (error)
    return (
      <div className="min-h-screen bg-[#0f0f1a] flex items-center justify-center">
        <div className="text-center text-red-400">
          <p className="text-2xl mb-4">❌</p>
          <p>{error}</p>
          <button
            onClick={() => navigate(-1)}
            className="mt-6 px-6 py-2 bg-gradient-to-r from-[#004C7D] to-[#158EB0] rounded-full hover:scale-105 transition-transform"
          >
            ← Go Back
          </button>
        </div>
      </div>
    );

  if (!blog)
    return (
      <div className="min-h-screen bg-[#0f0f1a] flex items-center justify-center">
        <div className="text-center text-gray-400">
          <p className="text-2xl mb-4">📄</p>
          <p>Blog not found</p>
          <button
            onClick={() => navigate(-1)}
            className="mt-6 px-6 py-2 bg-gradient-to-r from-[#004C7D] to-[#158EB0] rounded-full hover:scale-105 transition-transform"
          >
            ← Go Back
          </button>
        </div>
      </div>
    );

  return (
    <section className="min-h-screen bg-[#0f0f1a] text-white pt-35 pb-15 px-6">
      <div className="max-w-5xl mx-auto">

        {/* Back button - Uncommented and styled */}
        <button
          onClick={() => navigate(-1)}
          className="mb-6 px-6 py-2 bg-gray-800 hover:bg-gray-700 rounded-full transition flex items-center gap-2 border border-white/10"
        >
          <span>←</span> Back
        </button>

        {blog.image && (
          <img
            src={blog.image}
            alt={blog.title}
            className="w-full h-96 object-cover rounded-2xl mb-8 border border-white/10"
            onError={(e) => {
              e.target.src = 'https://via.placeholder.com/1200x400?text=Blog+Image';
            }}
          />
        )}

        <h1 className="text-4xl font-bold text-cyan-400 mb-4">
          {blog.title}
        </h1>

        <div className="text-sm text-gray-400 mb-6 flex items-center gap-2">
          {blog.author && (
            <>
              <span className="bg-cyan-500/20 text-cyan-400 px-3 py-1 rounded-full">
                By {blog.author}
              </span>
              <span>•</span>
            </>
          )}
          <span>{new Date(blog.createdAt).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          })}</span>
        </div>

        <div className="prose prose-invert max-w-none">
          <p className="text-lg leading-8 whitespace-pre-line bg-white/5 p-6 rounded-2xl border border-white/10">
            {blog.content}
          </p>
        </div>
      </div>
    </section>
  );
}