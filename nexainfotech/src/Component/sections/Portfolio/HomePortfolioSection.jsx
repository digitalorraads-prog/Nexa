import { useEffect, useState } from "react";
import axios from "../../../Protected/axiosPublic"; // 👈 Using public axios instance

export default function HomePortfolioSection() {
  const [projects, setProjects] = useState([]);
  const [active, setActive] = useState("All");
  const [visibleCount, setVisibleCount] = useState(6);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(null); // ✅ Modal state

  useEffect(() => {
    const fetchPortfolio = async () => {
      try {
        const { data } = await axios.get("/api/portfolio"); // 👈 Removed localhost
        setProjects(data);
      } catch (error) {
        console.error("Error fetching portfolio:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPortfolio();
  }, []);

  // Categories
  const categories = [
    "All",
    ...new Set(projects.map((item) => item.category)),
  ];

  // Filtered Projects
  const filteredProjects =
    active === "All"
      ? projects
      : projects.filter((p) => p.category === active);

  const visibleProjects = filteredProjects.slice(0, visibleCount);

  const handleCategoryChange = (cat) => {
    setActive(cat);
    setVisibleCount(6);
  };

  // ✅ Smart Click Handler
  const handleClick = (project) => {
    if (project.link && project.link.trim() !== "") {
      window.open(project.link, "_blank");
    } else {
      setSelectedImage(project);
    }
  };

  // Show loading skeleton while fetching
  if (loading) {
    return (
      <section className="pt-24 pb-20 bg-[#0f0f1a] text-white">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <div className="h-12 w-64 bg-gray-800 rounded-lg animate-pulse mx-auto mb-4"></div>
          <div className="w-20 h-1 bg-gray-800 mx-auto my-4 rounded-full"></div>
          <div className="h-6 w-96 bg-gray-800 rounded-lg animate-pulse mx-auto mb-12"></div>
          
          {/* Category buttons skeleton */}
          <div className="flex flex-wrap justify-center gap-4 mb-12">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="h-10 w-24 bg-gray-800 rounded-full animate-pulse"></div>
            ))}
          </div>

          {/* Grid skeleton */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} className="h-60 bg-gray-800 rounded-3xl animate-pulse"></div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="pt-24 pb-20 bg-[#0f0f1a] text-white">
      <div className="max-w-7xl mx-auto px-6 text-center">

        <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
          Portfolio
        </h2>

        <div className="w-20 h-1 bg-gradient-to-r from-[#004C7D] to-[#158EB0] mx-auto my-4 rounded-full"></div>

        <p className="text-gray-400 mb-12">
          Showcasing my best work
        </p>

        {/* Category Buttons */}
        {categories.length > 0 && (
          <div className="flex flex-wrap justify-center gap-4 mb-12">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => handleCategoryChange(cat)}
                className={`px-6 py-2 rounded-full border transition-all duration-300 text-sm font-medium
                  ${
                    active === cat
                      ? "bg-gradient-to-r from-[#004C7D] to-[#158EB0] text-white border-transparent shadow-lg shadow-cyan-500/30"
                      : "border-cyan-400 text-cyan-400 hover:bg-cyan-400 hover:text-black"
                  }`}
              >
                {cat}
              </button>
            ))}
          </div>
        )}

        {/* Grid */}
        {visibleProjects.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-gray-400 text-xl">No projects found in this category.</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
            {visibleProjects.map((project) => (
              <div
                key={project._id}
                onClick={() => handleClick(project)} // ✅ Click added
                className="cursor-pointer relative group rounded-3xl overflow-hidden border border-white/10 bg-white/5 
                hover:-translate-y-3 hover:shadow-[0_0_30px_rgba(0,255,255,0.3)]
                transition-all duration-500"
              >
                <img
                  src={project.image}
                  alt={project.title}
                  className="w-full h-60 object-cover transition-transform duration-500 group-hover:scale-110"
                  onError={(e) => {
                    e.target.src = "https://via.placeholder.com/400x300?text=No+Image";
                  }}
                />
                
                {/* Optional overlay with title on hover */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                  <h3 className="text-white font-semibold text-lg">{project.title}</h3>
                </div>
                
                {/* Category badge */}
                <div className="absolute top-3 left-3 bg-cyan-500/20 backdrop-blur-sm px-3 py-1 rounded-full text-xs text-cyan-400 border border-cyan-500/30">
                  {project.category}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* View More Button */}
        {!loading && filteredProjects.length > visibleCount && (
          <div className="mt-14">
            <button
              onClick={() => setVisibleCount((prev) => prev + 6)}
              className="px-8 py-3 rounded-full bg-gradient-to-r from-[#004C7D] to-[#158EB0]
              text-white font-medium shadow-lg shadow-cyan-500/30
              hover:scale-105 transition-all duration-300"
            >
              View More
            </button>
          </div>
        )}
      </div>

      {/* ✅ Modal (Only if no link) */}
      {selectedImage && (
        <div
          onClick={() => setSelectedImage(null)}
          className="fixed inset-0 bg-black/90 backdrop-blur-sm flex justify-center items-center z-50 p-6"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative max-w-5xl w-full"
          >
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute -top-12 right-0 text-white text-3xl hover:text-cyan-400 transition-colors"
            >
              ✕
            </button>

            <img
              src={selectedImage.image}
              alt={selectedImage.title}
              className="w-full max-h-[80vh] object-contain rounded-xl shadow-2xl"
            />

            <h3 className="text-center mt-4 text-cyan-400 text-xl font-semibold">
              {selectedImage.title}
            </h3>
            
            {selectedImage.description && (
              <p className="text-center mt-2 text-gray-400">
                {selectedImage.description}
              </p>
            )}
          </div>
        </div>
      )}
    </section>
  );
}