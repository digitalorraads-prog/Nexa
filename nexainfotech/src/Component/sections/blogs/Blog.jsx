import axios from "../../../Protected/axiosPublic"; // ✅ Correct import path
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Blog() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const sectionRef = useRef(null);
  const [visible, setVisible] = useState(false);

  const navigate = useNavigate();

  const handleReadMore = (id) => {
    navigate(`/blog/${id}`);
  };

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        // ✅ Using axios instance - no need for full URL
        const { data } = await axios.get("/api/blogs");
        setBlogs(data);
      } catch (error) {
        console.error("Error fetching blogs:", error);
        setError(error.response?.data?.message || "Failed to load blogs.");
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => entry.isIntersecting && setVisible(true),
      { threshold: 0.2 }
    );

    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative pt-30 pb-20 bg-[#0f0f1a] text-white"
    >
      <div className="text-center mb-16 px-6">
        <h2 className="text-4xl font-extrabold mb-4">
          Latest Blogs
        </h2>
      </div>

      {loading && (
        <div className="text-center text-cyan-400">
          Loading blogs...
        </div>
      )}

      {error && (
        <div className="text-center text-red-400">
          {error}
        </div>
      )}

      {!loading && !error && blogs.length === 0 && (
        <div className="text-center text-gray-400">
          No blogs available.
        </div>
      )}

      {!loading && !error && blogs.length > 0 && (
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 lg:grid-cols-3 gap-10">
          {blogs.map((blog, index) => (
            <div
              key={blog._id}
              className={`rounded-2xl bg-white/5 border border-white/10 transition-all duration-700 hover:-translate-y-4 cursor-pointer ${
                visible ? "opacity-100" : "opacity-0 translate-y-16"
              }`}
              style={{ transitionDelay: `${index * 150}ms` }}
              onClick={() => handleReadMore(blog._id)}
            >
              {blog.image && (
                <img
                  src={blog.image}
                  alt={blog.title}
                  className="w-full h-48 object-cover rounded-t-2xl"
                  onError={(e) => {
                    e.target.src = 'https://via.placeholder.com/400x200?text=Blog+Image';
                  }}
                />
              )}

              <div className="p-6">
                <h3 className="text-xl font-bold mb-3 text-cyan-400">
                  {blog.title}
                </h3>

                <p className="text-sm mb-4 line-clamp-3">
                  {blog.content}
                </p>

                <div className="text-xs mb-4 text-gray-400">
                  {blog.author && <span>By {blog.author} • </span>}
                  {blog.createdAt && new Date(blog.createdAt).toLocaleDateString()}
                </div>

                <button
                  className="px-5 py-2 rounded-full bg-linear-to-r from-[#004C7D] to-[#158EB0] text-sm font-semibold hover:scale-105 transition-transform"
                >
                  Read More →
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
