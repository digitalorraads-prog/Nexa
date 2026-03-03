import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../../Protected/axios"; // ✅ Correct - using custom axios instance
import {
  PlusIcon,
  PencilIcon,
  TrashIcon,
  EyeIcon,
  PhotoIcon,
  VideoCameraIcon,
  PaintBrushIcon,
  ArrowPathIcon,
  CheckCircleIcon,
  XCircleIcon,
  DocumentDuplicateIcon,
  ChevronUpIcon,
  ChevronDownIcon,
  XMarkIcon,
  CloudArrowUpIcon
} from '@heroicons/react/24/outline';

export default function ManageHeroes() {
  const navigate = useNavigate();
  const [heroes, setHeroes] = useState([]);
  const [groupedHeroes, setGroupedHeroes] = useState({});
  const [availablePages, setAvailablePages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedHero, setSelectedHero] = useState(null);
  const [message, setMessage] = useState("");
  const [uploading, setUploading] = useState(false);
  const [expandedPage, setExpandedPage] = useState('home');
  
  // Form state
  const [formData, setFormData] = useState({
    pageId: "",
    pageName: "",
    heroName: "",
    title: "",
    subtitle: "",
    description: "",
    backgroundType: "image",
    backgroundColor: "#0c0c16",
    overlayOpacity: 0.5,
    textColor: "#ffffff",
    primaryButtonText: "Get Started",
    primaryButtonLink: "/contact",
    secondaryButtonText: "Learn More",
    secondaryButtonLink: "/about",
    showButtons: true,
    alignment: "center",
    height: "large",
    animationType: "fade",
    sliderSettings: {
      autoplay: true,
      autoplaySpeed: 5000,
      dots: true,
      arrows: true,
      infinite: true,
      fade: false
    },
    isActive: true
  });

  useEffect(() => {
    fetchHeroes();
    fetchPages();
  }, []);

  const fetchHeroes = async () => {
    setLoading(true);
    try {
      // ✅ Fixed: Using relative path with axios instance
      const response = await axios.get("/api/heroes/admin/all");
      if (response.data.success) {
        setHeroes(response.data.data);
        setGroupedHeroes(response.data.grouped || {});
      }
    } catch (err) {
      console.error(err);
      setMessage(err.response?.data?.message || "❌ Failed to fetch heroes");
      if (err.response?.status === 401) {
        navigate("/admin/login");
      }
    } finally {
      setLoading(false);
    }
  };

  const fetchPages = async () => {
    try {
      // ✅ Fixed: Using relative path with axios instance
      const response = await axios.get("/api/pages/active");
      if (response.data.success) {
        setAvailablePages(response.data.data);
      }
    } catch (err) {
      console.error('Fetch pages error:', err);
    }
  };

  const handleCreateHero = async (pageId, pageName) => {
    try {
      setLoading(true);
      // ✅ Fixed: Using relative path with axios instance
      const response = await axios.post("/api/heroes/admin/create", {
        pageId,
        pageName,
        heroName: `New ${pageName} Hero`
      });
      
      if (response.data.success) {
        setMessage("✅ New hero created!");
        fetchHeroes();
        setSelectedHero(response.data.data);
        setExpandedPage(pageId);
      }
    } catch (err) {
      setMessage(err.response?.data?.message || "❌ Failed to create hero");
    } finally {
      setLoading(false);
    }
  };

  const handleSelectHero = (hero) => {
    setSelectedHero(hero);
    setFormData({
      pageId: hero.pageId,
      pageName: hero.pageName,
      heroName: hero.heroName || "",
      title: hero.title,
      subtitle: hero.subtitle || "",
      description: hero.description || "",
      backgroundType: hero.backgroundType || "image",
      backgroundColor: hero.backgroundColor || "#0c0c16",
      overlayOpacity: hero.overlayOpacity || 0.5,
      textColor: hero.textColor || "#ffffff",
      primaryButtonText: hero.primaryButtonText || "Get Started",
      primaryButtonLink: hero.primaryButtonLink || "/contact",
      secondaryButtonText: hero.secondaryButtonText || "Learn More",
      secondaryButtonLink: hero.secondaryButtonLink || "/about",
      showButtons: hero.showButtons !== undefined ? hero.showButtons : true,
      alignment: hero.alignment || "center",
      height: hero.height || "large",
      animationType: hero.animationType || "fade",
      sliderSettings: hero.sliderSettings || {
        autoplay: true,
        autoplaySpeed: 5000,
        dots: true,
        arrows: true,
        infinite: true,
        fade: false
      },
      isActive: hero.isActive !== undefined ? hero.isActive : true
    });
    setMessage("");
  };

  const handleUpdateHero = async (e) => {
    e.preventDefault();
    
    if (!selectedHero) return;

    try {
      setLoading(true);
      // ✅ Fixed: Using relative path with axios instance
      const response = await axios.put(
        `/api/heroes/admin/${selectedHero._id}`,
        formData
      );

      if (response.data.success) {
        setMessage("✅ Hero updated!");
        fetchHeroes();
        setSelectedHero(response.data.data);
      }
    } catch (err) {
      setMessage(err.response?.data?.message || "❌ Update failed");
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0 || !selectedHero) return;

    const uploadFormData = new FormData();
    files.forEach(file => {
      uploadFormData.append('images', file);
    });

    setUploading(true);
    setMessage(`📤 Uploading ${files.length} images...`);

    try {
      // ✅ Fixed: Using relative path with axios instance
      const response = await axios.post(
        `/api/heroes/admin/${selectedHero._id}/images`,
        uploadFormData,
        {
          headers: { 'Content-Type': 'multipart/form-data' }
        }
      );

      if (response.data.success) {
        setMessage(`✅ ${files.length} images uploaded!`);
        fetchHeroes();
        setSelectedHero(response.data.data);
      }
    } catch (err) {
      console.error(err);
      setMessage(err.response?.data?.message || "❌ Upload failed");
    } finally {
      setUploading(false);
    }
  };

  const handleDeleteImage = async (imageId) => {
    if (!selectedHero || !window.confirm("Delete this image?")) return;

    try {
      // ✅ Fixed: Using relative path with axios instance
      const response = await axios.delete(
        `/api/heroes/admin/${selectedHero._id}/images/${imageId}`
      );

      if (response.data.success) {
        setMessage("✅ Image deleted!");
        fetchHeroes();
        setSelectedHero(response.data.data);
      }
    } catch (err) {
      setMessage(err.response?.data?.message || "❌ Delete failed");
    }
  };

  const handleDuplicateHero = async (heroId) => {
    try {
      // ✅ Fixed: Using relative path with axios instance
      const response = await axios.post(
        `/api/heroes/admin/${heroId}/duplicate`
      );

      if (response.data.success) {
        setMessage("✅ Hero duplicated!");
        fetchHeroes();
      }
    } catch (err) {
      setMessage(err.response?.data?.message || "❌ Duplicate failed");
    }
  };

  const handleToggleStatus = async (heroId) => {
    try {
      // ✅ Fixed: Using relative path with axios instance
      const response = await axios.patch(
        `/api/heroes/admin/${heroId}/toggle`
      );

      if (response.data.success) {
        setMessage(response.data.message);
        fetchHeroes();
      }
    } catch (err) {
      setMessage(err.response?.data?.message || "❌ Failed to toggle status");
    }
  };

  const handleDeleteHero = async (heroId) => {
    if (!window.confirm("Are you sure? This will delete all images!")) return;

    try {
      // ✅ Fixed: Using relative path with axios instance
      const response = await axios.delete(
        `/api/heroes/admin/${heroId}`
      );

      if (response.data.success) {
        setMessage("✅ Hero deleted!");
        fetchHeroes();
        if (selectedHero?._id === heroId) {
          setSelectedHero(null);
        }
      }
    } catch (err) {
      setMessage(err.response?.data?.message || "❌ Delete failed");
    }
  };

  // Video URL input handler
  const handleVideoUrlChange = (e) => {
    setSelectedHero({ ...selectedHero, backgroundVideo: e.target.value });
  };

  if (loading && heroes.length === 0) {
    return (
      <div className="min-h-screen bg-[#0f0f1a] flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white">Loading Heroes...</p>
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
              Hero Sections Management
            </h1>
            <p className="text-gray-400">
              Create and manage multiple hero sections for each page
            </p>
          </div>
          <button
            onClick={fetchHeroes}
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

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Side - Pages with Heroes */}
          <div className="lg:col-span-1">
            <div className="bg-[#1a1a2e] rounded-2xl border border-gray-800 p-4">
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <EyeIcon className="w-5 h-5 text-cyan-400" />
                Pages & Heroes
              </h2>
              
              <div className="space-y-4">
                {availablePages.map((page) => (
                  <div key={page.pageId} className="border border-gray-700 rounded-lg overflow-hidden">
                    <div
                      className="bg-[#0f0f1a] p-3 flex items-center justify-between cursor-pointer"
                      onClick={() => setExpandedPage(expandedPage === page.pageId ? '' : page.pageId)}
                    >
                      <h3 className="font-medium text-cyan-400">{page.pageName}</h3>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleCreateHero(page.pageId, page.pageName);
                          }}
                          className="p-1 bg-green-600 hover:bg-green-700 rounded"
                          title="Add new hero"
                        >
                          <PlusIcon className="w-4 h-4" />
                        </button>
                        <button className="p-1">
                          {expandedPage === page.pageId ? (
                            <ChevronUpIcon className="w-4 h-4" />
                          ) : (
                            <ChevronDownIcon className="w-4 h-4" />
                          )}
                        </button>
                      </div>
                    </div>

                    {expandedPage === page.pageId && (
                      <div className="p-2 space-y-2">
                        {groupedHeroes[page.pageId]?.length > 0 ? (
                          groupedHeroes[page.pageId].map((hero) => (
                            <div
                              key={hero._id}
                              className={`p-2 rounded-lg cursor-pointer transition ${
                                selectedHero?._id === hero._id
                                  ? 'bg-cyan-600/30 border border-cyan-500'
                                  : 'hover:bg-gray-800 border border-gray-700'
                              }`}
                            >
                              <div className="flex items-center justify-between">
                                <div
                                  className="flex-1"
                                  onClick={() => handleSelectHero(hero)}
                                >
                                  <div className="flex items-center gap-2">
                                    <p className="text-sm font-medium">
                                      {hero.heroName || 'Unnamed Hero'}
                                    </p>
                                    {hero.isActive ? (
                                      <CheckCircleIcon className="w-4 h-4 text-green-400" />
                                    ) : (
                                      <XCircleIcon className="w-4 h-4 text-red-400" />
                                    )}
                                  </div>
                                  <p className="text-xs text-gray-400">
                                    {hero.images?.length || 0} images • {hero.backgroundType}
                                  </p>
                                </div>
                                
                                <div className="flex gap-1">
                                  <button
                                    onClick={() => handleDuplicateHero(hero._id)}
                                    className="p-1 hover:bg-gray-700 rounded"
                                    title="Duplicate"
                                  >
                                    <DocumentDuplicateIcon className="w-4 h-4" />
                                  </button>
                                  <button
                                    onClick={() => handleToggleStatus(hero._id)}
                                    className="p-1 hover:bg-gray-700 rounded"
                                    title="Toggle status"
                                  >
                                    <ArrowPathIcon className="w-4 h-4" />
                                  </button>
                                  <button
                                    onClick={() => handleDeleteHero(hero._id)}
                                    className="p-1 hover:bg-red-600 rounded"
                                    title="Delete"
                                  >
                                    <TrashIcon className="w-4 h-4" />
                                  </button>
                                </div>
                              </div>
                            </div>
                          ))
                        ) : (
                          <p className="text-sm text-gray-500 text-center py-2">
                            No heroes yet
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                ))}

                {availablePages.length === 0 && (
                  <p className="text-center text-gray-500 py-4">
                    No pages found. Create pages first in Pages Management.
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Right Side - Edit Form */}
          <div className="lg:col-span-2">
            {selectedHero ? (
              <div className="bg-[#1a1a2e] rounded-2xl border border-gray-800 p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-semibold">
                    Editing: {selectedHero.heroName}
                  </h2>
                  <span className={`px-3 py-1 rounded-full text-sm ${
                    selectedHero.isActive 
                      ? 'bg-green-500/20 text-green-400 border border-green-500' 
                      : 'bg-red-500/20 text-red-400 border border-red-500'
                  }`}>
                    {selectedHero.isActive ? 'Active' : 'Inactive'}
                  </span>
                </div>

                {/* Images Section */}
                <div className="mb-8">
                  <h3 className="text-lg font-medium mb-4 flex items-center gap-2">
                    <PhotoIcon className="w-5 h-5 text-cyan-400" />
                    Images ({selectedHero.images?.length || 0})
                  </h3>

                  {selectedHero.images?.length > 0 && (
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-4">
                      {selectedHero.images.map((image, idx) => (
                        <div key={idx} className="relative group">
                          <img
                            src={image.url}
                            alt={image.alt || ''}
                            className="w-full h-24 object-cover rounded-lg border border-gray-700"
                            onError={(e) => {
                              e.target.src = 'https://via.placeholder.com/150?text=Error';
                            }}
                          />
                          <button
                            onClick={() => handleDeleteImage(image._id)}
                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition"
                          >
                            <XMarkIcon className="w-4 h-4" />
                          </button>
                          <span className="absolute bottom-1 left-1 bg-black/70 text-xs px-1 rounded">
                            {idx + 1}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}

                  <div>
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                      id="imageUpload"
                      disabled={uploading}
                    />
                    <label
                      htmlFor="imageUpload"
                      className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 px-4 py-2 rounded-lg cursor-pointer"
                    >
                      {uploading ? (
                        <>
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          Uploading...
                        </>
                      ) : (
                        <>
                          <CloudArrowUpIcon className="w-5 h-5" />
                          Upload Multiple Images
                        </>
                      )}
                    </label>
                  </div>
                </div>

                {/* Edit Form */}
                <form onSubmit={handleUpdateHero} className="space-y-6">
                  {/* Hero Name */}
                  <div>
                    <label className="block text-sm text-gray-400 mb-2">
                      Hero Name (for admin)
                    </label>
                    <input
                      type="text"
                      name="heroName"
                      value={formData.heroName}
                      onChange={(e) => setFormData({...formData, heroName: e.target.value})}
                      className="w-full px-4 py-2 bg-[#0f0f1a] border border-gray-700 rounded-lg text-white focus:outline-none focus:border-cyan-400"
                      required
                    />
                  </div>

                  {/* Title */}
                  <div>
                    <label className="block text-sm text-gray-400 mb-2">
                      Title
                    </label>
                    <input
                      type="text"
                      name="title"
                      value={formData.title}
                      onChange={(e) => setFormData({...formData, title: e.target.value})}
                      className="w-full px-4 py-2 bg-[#0f0f1a] border border-gray-700 rounded-lg text-white focus:outline-none focus:border-cyan-400"
                      required
                    />
                  </div>

                  {/* Subtitle */}
                  <div>
                    <label className="block text-sm text-gray-400 mb-2">
                      Subtitle
                    </label>
                    <input
                      type="text"
                      name="subtitle"
                      value={formData.subtitle}
                      onChange={(e) => setFormData({...formData, subtitle: e.target.value})}
                      className="w-full px-4 py-2 bg-[#0f0f1a] border border-gray-700 rounded-lg text-white focus:outline-none focus:border-cyan-400"
                    />
                  </div>

                  {/* Description */}
                  <div>
                    <label className="block text-sm text-gray-400 mb-2">
                      Description
                    </label>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={(e) => setFormData({...formData, description: e.target.value})}
                      rows="3"
                      className="w-full px-4 py-2 bg-[#0f0f1a] border border-gray-700 rounded-lg text-white focus:outline-none focus:border-cyan-400"
                    />
                  </div>

                  {/* Background Type */}
                  <div>
                    <label className="block text-sm text-gray-400 mb-2">
                      Background Type
                    </label>
                    <div className="flex gap-4 flex-wrap">
                      <label className="flex items-center gap-2">
                        <input
                          type="radio"
                          name="backgroundType"
                          value="image"
                          checked={formData.backgroundType === 'image'}
                          onChange={(e) => setFormData({...formData, backgroundType: e.target.value})}
                        />
                        <PhotoIcon className="w-5 h-5" />
                        Single Image
                      </label>
                      <label className="flex items-center gap-2">
                        <input
                          type="radio"
                          name="backgroundType"
                          value="slider"
                          checked={formData.backgroundType === 'slider'}
                          onChange={(e) => setFormData({...formData, backgroundType: e.target.value})}
                        />
                        <PhotoIcon className="w-5 h-5" />
                        Slider (Multiple)
                      </label>
                      <label className="flex items-center gap-2">
                        <input
                          type="radio"
                          name="backgroundType"
                          value="video"
                          checked={formData.backgroundType === 'video'}
                          onChange={(e) => setFormData({...formData, backgroundType: e.target.value})}
                        />
                        <VideoCameraIcon className="w-5 h-5" />
                        Video
                      </label>
                      <label className="flex items-center gap-2">
                        <input
                          type="radio"
                          name="backgroundType"
                          value="color"
                          checked={formData.backgroundType === 'color'}
                          onChange={(e) => setFormData({...formData, backgroundType: e.target.value})}
                        />
                        <PaintBrushIcon className="w-5 h-5" />
                        Color
                      </label>
                    </div>
                  </div>

                  {/* Video URL */}
                  {formData.backgroundType === 'video' && (
                    <div>
                      <label className="block text-sm text-gray-400 mb-2">
                        Video URL
                      </label>
                      <input
                        type="url"
                        name="backgroundVideo"
                        value={selectedHero.backgroundVideo || ''}
                        onChange={handleVideoUrlChange}
                        placeholder="https://youtube.com/..."
                        className="w-full px-4 py-2 bg-[#0f0f1a] border border-gray-700 rounded-lg"
                      />
                    </div>
                  )}

                  {/* Background Color */}
                  {formData.backgroundType === 'color' && (
                    <div>
                      <label className="block text-sm text-gray-400 mb-2">
                        Background Color
                      </label>
                      <input
                        type="color"
                        name="backgroundColor"
                        value={formData.backgroundColor}
                        onChange={(e) => setFormData({...formData, backgroundColor: e.target.value})}
                        className="w-full h-10 bg-[#0f0f1a] border border-gray-700 rounded-lg"
                      />
                    </div>
                  )}

                  {/* Slider Settings */}
                  {formData.backgroundType === 'slider' && (
                    <div className="space-y-3 p-4 bg-[#0f0f1a] rounded-lg">
                      <h4 className="font-medium">Slider Settings</h4>
                      
                      <div className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={formData.sliderSettings.autoplay}
                          onChange={(e) => setFormData({
                            ...formData,
                            sliderSettings: {
                              ...formData.sliderSettings,
                              autoplay: e.target.checked
                            }
                          })}
                        />
                        <label>Autoplay</label>
                      </div>

                      {formData.sliderSettings.autoplay && (
                        <div>
                          <label className="block text-sm text-gray-400 mb-1">
                            Autoplay Speed (ms)
                          </label>
                          <input
                            type="number"
                            value={formData.sliderSettings.autoplaySpeed}
                            onChange={(e) => setFormData({
                              ...formData,
                              sliderSettings: {
                                ...formData.sliderSettings,
                                autoplaySpeed: parseInt(e.target.value)
                              }
                            })}
                            className="w-full px-4 py-2 bg-[#0f0f1a] border border-gray-700 rounded-lg"
                          />
                        </div>
                      )}

                      <div className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={formData.sliderSettings.dots}
                          onChange={(e) => setFormData({
                            ...formData,
                            sliderSettings: {
                              ...formData.sliderSettings,
                              dots: e.target.checked
                            }
                          })}
                        />
                        <label>Show Dots</label>
                      </div>

                      <div className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={formData.sliderSettings.arrows}
                          onChange={(e) => setFormData({
                            ...formData,
                            sliderSettings: {
                              ...formData.sliderSettings,
                              arrows: e.target.checked
                            }
                          })}
                        />
                        <label>Show Arrows</label>
                      </div>
                    </div>
                  )}

                  {/* Overlay Opacity */}
                  <div>
                    <label className="block text-sm text-gray-400 mb-2">
                      Overlay Opacity: {formData.overlayOpacity}
                    </label>
                    <input
                      type="range"
                      name="overlayOpacity"
                      min="0"
                      max="1"
                      step="0.1"
                      value={formData.overlayOpacity}
                      onChange={(e) => setFormData({...formData, overlayOpacity: parseFloat(e.target.value)})}
                      className="w-full"
                    />
                  </div>

                  {/* Text Color */}
                  <div>
                    <label className="block text-sm text-gray-400 mb-2">
                      Text Color
                    </label>
                    <input
                      type="color"
                      name="textColor"
                      value={formData.textColor}
                      onChange={(e) => setFormData({...formData, textColor: e.target.value})}
                      className="w-full h-10 bg-[#0f0f1a] border border-gray-700 rounded-lg"
                    />
                  </div>

                  {/* Buttons */}
                  <div className="space-y-4">
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        name="showButtons"
                        checked={formData.showButtons}
                        onChange={(e) => setFormData({...formData, showButtons: e.target.checked})}
                        className="w-4 h-4"
                      />
                      <label>Show Buttons</label>
                    </div>

                    {formData.showButtons && (
                      <>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm text-gray-400 mb-2">
                              Button 1 Text
                            </label>
                            <input
                              type="text"
                              name="primaryButtonText"
                              value={formData.primaryButtonText}
                              onChange={(e) => setFormData({...formData, primaryButtonText: e.target.value})}
                              className="w-full px-4 py-2 bg-[#0f0f1a] border border-gray-700 rounded-lg"
                            />
                          </div>
                          <div>
                            <label className="block text-sm text-gray-400 mb-2">
                              Button 1 Link
                            </label>
                            <input
                              type="text"
                              name="primaryButtonLink"
                              value={formData.primaryButtonLink}
                              onChange={(e) => setFormData({...formData, primaryButtonLink: e.target.value})}
                              className="w-full px-4 py-2 bg-[#0f0f1a] border border-gray-700 rounded-lg"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm text-gray-400 mb-2">
                              Button 2 Text
                            </label>
                            <input
                              type="text"
                              name="secondaryButtonText"
                              value={formData.secondaryButtonText}
                              onChange={(e) => setFormData({...formData, secondaryButtonText: e.target.value})}
                              className="w-full px-4 py-2 bg-[#0f0f1a] border border-gray-700 rounded-lg"
                            />
                          </div>
                          <div>
                            <label className="block text-sm text-gray-400 mb-2">
                              Button 2 Link
                            </label>
                            <input
                              type="text"
                              name="secondaryButtonLink"
                              value={formData.secondaryButtonLink}
                              onChange={(e) => setFormData({...formData, secondaryButtonLink: e.target.value})}
                              className="w-full px-4 py-2 bg-[#0f0f1a] border border-gray-700 rounded-lg"
                            />
                          </div>
                        </div>
                      </>
                    )}
                  </div>

                  {/* Alignment */}
                  <div>
                    <label className="block text-sm text-gray-400 mb-2">
                      Text Alignment
                    </label>
                    <select
                      name="alignment"
                      value={formData.alignment}
                      onChange={(e) => setFormData({...formData, alignment: e.target.value})}
                      className="w-full px-4 py-2 bg-[#0f0f1a] border border-gray-700 rounded-lg"
                    >
                      <option value="left">Left</option>
                      <option value="center">Center</option>
                      <option value="right">Right</option>
                    </select>
                  </div>

                  {/* Height */}
                  <div>
                    <label className="block text-sm text-gray-400 mb-2">
                      Section Height
                    </label>
                    <select
                      name="height"
                      value={formData.height}
                      onChange={(e) => setFormData({...formData, height: e.target.value})}
                      className="w-full px-4 py-2 bg-[#0f0f1a] border border-gray-700 rounded-lg"
                    >
                      <option value="small">Small (300px)</option>
                      <option value="medium">Medium (400px)</option>
                      <option value="large">Large (500px)</option>
                      <option value="full">Full Screen</option>
                    </select>
                  </div>

                  {/* Animation */}
                  <div>
                    <label className="block text-sm text-gray-400 mb-2">
                      Animation
                    </label>
                    <select
                      name="animationType"
                      value={formData.animationType}
                      onChange={(e) => setFormData({...formData, animationType: e.target.value})}
                      className="w-full px-4 py-2 bg-[#0f0f1a] border border-gray-700 rounded-lg"
                    >
                      <option value="fade">Fade In</option>
                      <option value="slide">Slide Up</option>
                      <option value="zoom">Zoom In</option>
                      <option value="none">No Animation</option>
                    </select>
                  </div>

                  {/* Active Status */}
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      name="isActive"
                      checked={formData.isActive}
                      onChange={(e) => setFormData({...formData, isActive: e.target.checked})}
                      className="w-4 h-4"
                    />
                    <label>Active (Show on website)</label>
                  </div>

                  {/* Submit Buttons */}
                  <div className="flex gap-4">
                    <button
                      type="submit"
                      disabled={loading || uploading}
                      className="flex-1 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 py-3 rounded-lg font-semibold transition disabled:opacity-50"
                    >
                      {loading ? "Saving..." : "Save Changes"}
                    </button>
                    
                    <button
                      type="button"
                      onClick={() => setSelectedHero(null)}
                      className="px-6 py-3 bg-gray-700 hover:bg-gray-600 rounded-lg transition"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            ) : (
              <div className="bg-[#1a1a2e] rounded-2xl border border-gray-800 p-12 text-center">
                <EyeIcon className="w-20 h-20 text-gray-600 mx-auto mb-4" />
                <h3 className="text-2xl font-semibold text-gray-400 mb-2">
                  Select a hero to edit
                </h3>
                <p className="text-gray-500 mb-6">
                  Or create a new hero section for any page
                </p>
                <div className="flex flex-wrap gap-4 justify-center">
                  {availablePages.map(page => (
                    <button
                      key={page.pageId}
                      onClick={() => handleCreateHero(page.pageId, page.pageName)}
                      className="bg-cyan-600 hover:bg-cyan-700 px-4 py-2 rounded-lg transition flex items-center gap-2"
                    >
                      <PlusIcon className="w-5 h-5" />
                      Add {page.pageName} Hero
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}