import { useState } from "react";
import axios from "../../Protected/axios"; // ✅ Correct - using custom axios instance
import {
  SparklesIcon,
  ArrowLeftIcon,
  LinkIcon,
  GlobeAltIcon,
  BuildingOfficeIcon,
  ItalicIcon,
  UnderlineIcon,
  PaintBrushIcon,
  PhotoIcon,
  CloudArrowUpIcon,
  XMarkIcon,
  CheckCircleIcon,
  ExclamationCircleIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';
import { useNavigate } from "react-router-dom";

export default function AdminAddService() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [autoGenerateSlug, setAutoGenerateSlug] = useState(true);
  const [slugType, setSlugType] = useState('simple');
  const [showLinkModal, setShowLinkModal] = useState(false);
  const [currentLinkIndex, setCurrentLinkIndex] = useState(null);
  const [linkData, setLinkData] = useState({ url: '', text: '', useSelectedText: true });
  const [notification, setNotification] = useState({ show: false, message: '', type: '' });
  const [activeButton, setActiveButton] = useState(null);

  const [form, setForm] = useState({
    pageTitle: "",
    miniDescription: "",
    buttonText: "",
    slug: "",
    city: "",
    serviceName: "",
    // Rich Text Fields
    heroHeading: {
      text: "",
      type: "h1",
      color: "#ffffff",
      fontSize: "48px",
      fontWeight: "bold",
      alignment: "left"
    },
    heroParagraphs: [
      {
        text: "",
        color: "#d1d5db",
        fontSize: "18px",
        fontWeight: "normal",
        fontStyle: "normal",
        textDecoration: "none"
      }
    ],
    heroImage: "",
    heroImageAlt: ""
  });

  // Show notification function
  const showNotification = (message, type = 'success') => {
    setNotification({ show: true, message, type });
    setTimeout(() => setNotification({ show: false, message: '', type: '' }), 3000);
  };

  // Generate slug from pageTitle
  const generateSlug = (title) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
  };

  // Generate nested slug from city and service
  const generateNestedSlug = () => {
    if (form.city && form.serviceName) {
      const citySlug = form.city.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
      const serviceSlug = form.serviceName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
      return `${citySlug}/${serviceSlug}`;
    }
    return form.slug;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "pageTitle" && autoGenerateSlug && slugType === 'simple') {
      setForm({
        ...form,
        pageTitle: value,
        slug: generateSlug(value)
      });
    } else if ((name === "city" || name === "serviceName") && slugType === 'nested') {
      const newForm = { ...form, [name]: value };
      if (newForm.city && newForm.serviceName) {
        newForm.slug = generateNestedSlug();
      }
      setForm(newForm);
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  // Handle image upload to Cloudinary
  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      showNotification('Please upload a valid image (JPEG, PNG, GIF, WEBP)', 'error');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      showNotification('Image size should be less than 5MB', 'error');
      return;
    }

    const uploadFormData = new FormData();
    uploadFormData.append('image', file);

    setUploading(true);
    setActiveButton('uploading');

    try {
      // ✅ Fixed: Using relative path with axios instance
      const response = await axios.post(
        '/api/services/upload-image',
        uploadFormData,
        {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        }
      );

      if (response.data.success) {
        setForm({
          ...form,
          heroImage: response.data.data.url
        });
        showNotification("Image uploaded successfully!", 'success');
      }
    } catch (error) {
      console.error("Upload error:", error);
      showNotification(error.response?.data?.error || "Failed to upload image", 'error');
    } finally {
      setUploading(false);
      setActiveButton(null);
    }
  };

  // Handle heading changes
  const handleHeadingChange = (field, value) => {
    setForm({
      ...form,
      heroHeading: {
        ...form.heroHeading,
        [field]: value
      }
    });
  };

  // Handle paragraph changes
  const handleParagraphChange = (index, field, value) => {
    const updatedParagraphs = [...form.heroParagraphs];
    updatedParagraphs[index] = {
      ...updatedParagraphs[index],
      [field]: value
    };
    setForm({
      ...form,
      heroParagraphs: updatedParagraphs
    });
  };

  // Add new paragraph
  const addParagraph = () => {
    setForm({
      ...form,
      heroParagraphs: [
        ...form.heroParagraphs,
        {
          text: "",
          color: "#d1d5db",
          fontSize: "18px",
          fontWeight: "normal",
          fontStyle: "normal",
          textDecoration: "none"
        }
      ]
    });
    showNotification('New paragraph added', 'success');
  };

  // Remove paragraph
  const removeParagraph = (index) => {
    if (form.heroParagraphs.length > 1) {
      const updatedParagraphs = form.heroParagraphs.filter((_, i) => i !== index);
      setForm({
        ...form,
        heroParagraphs: updatedParagraphs
      });
      showNotification('Paragraph removed', 'success');
    }
  };

  // Apply formatting to selected text
  const applyFormatting = (index, formatType) => {
    const textarea = document.getElementById(`paragraph-${index}`);
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;

    if (start === end) {
      showNotification('Please select some text first', 'warning');
      return;
    }

    const selectedText = form.heroParagraphs[index].text.substring(start, end);
    const beforeText = form.heroParagraphs[index].text.substring(0, start);
    const afterText = form.heroParagraphs[index].text.substring(end);

    let formattedText = selectedText;

    switch (formatType) {
      case 'link':
        setCurrentLinkIndex(index);
        setLinkData({
          url: 'https://',
          text: selectedText,
          useSelectedText: true
        });
        setShowLinkModal(true);
        return;

      case 'italic':
        formattedText = `<em>${selectedText}</em>`;
        showNotification('Italic applied ✓', 'success');
        break;

      case 'underline':
        formattedText = `<u>${selectedText}</u>`;
        showNotification('Underline applied ✓', 'success');
        break;

      case 'color':
        const color = prompt("Enter color code (e.g., #ff0000):", "#ff0000");
        if (color) {
          formattedText = `<span style="color:${color}">${selectedText}</span>`;
          showNotification('Color applied ✓', 'success');
        } else {
          return;
        }
        break;
    }

    const newText = beforeText + formattedText + afterText;

    const updatedParagraphs = [...form.heroParagraphs];
    updatedParagraphs[index] = {
      ...updatedParagraphs[index],
      text: newText
    };

    setForm({
      ...form,
      heroParagraphs: updatedParagraphs
    });

    setActiveButton(formatType);
    setTimeout(() => setActiveButton(null), 200);

    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start, end);
    }, 0);
  };

  // Handle link creation
  const handleCreateLink = () => {
    if (!linkData.url) {
      showNotification('Please enter a URL', 'warning');
      return;
    }

    const textarea = document.getElementById(`paragraph-${currentLinkIndex}`);
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;

    const selectedText = form.heroParagraphs[currentLinkIndex].text.substring(start, end);
    const beforeText = form.heroParagraphs[currentLinkIndex].text.substring(0, start);
    const afterText = form.heroParagraphs[currentLinkIndex].text.substring(end);

    const linkText = linkData.useSelectedText ? selectedText : linkData.text;

    const formattedText = `<a href="${linkData.url}" target="_blank" rel="noopener noreferrer" class="text-cyan-400 hover:text-cyan-300 underline">${linkText}</a>`;

    const newText = beforeText + formattedText + afterText;

    const updatedParagraphs = [...form.heroParagraphs];
    updatedParagraphs[currentLinkIndex] = {
      ...updatedParagraphs[currentLinkIndex],
      text: newText
    };

    setForm({
      ...form,
      heroParagraphs: updatedParagraphs
    });

    setShowLinkModal(false);
    setActiveButton('link');
    setTimeout(() => setActiveButton(null), 200);
    showNotification('Link added successfully 🔗', 'success');

    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start, end);
    }, 0);
  };

  const toggleSlugMode = () => {
    setAutoGenerateSlug(!autoGenerateSlug);
    if (!autoGenerateSlug) {
      setForm({
        ...form,
        slug: generateSlug(form.pageTitle)
      });
    }
    showNotification(`Slug mode: ${!autoGenerateSlug ? 'Auto' : 'Manual'}`, 'info');
  };

  const toggleSlugType = () => {
    const newType = slugType === 'simple' ? 'nested' : 'simple';
    setSlugType(newType);
    if (newType === 'simple') {
      setForm({
        ...form,
        slug: generateSlug(form.pageTitle),
        city: "",
        serviceName: ""
      });
    }
    showNotification(`URL type: ${newType}`, 'info');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.pageTitle.trim()) {
      showNotification("Page Title is required", 'warning');
      return;
    }

    if (slugType === 'simple' && !autoGenerateSlug && !form.slug.trim()) {
      showNotification("Slug is required in manual mode", 'warning');
      return;
    }

    if (slugType === 'nested' && (!form.city || !form.serviceName)) {
      showNotification("City and Service Name are required for nested URL", 'warning');
      return;
    }

    setLoading(true);
    setActiveButton('submit');

    try {
      const formData = new FormData();

      formData.append('pageTitle', form.pageTitle);
      formData.append('miniDescription', form.miniDescription || "");
      formData.append('buttonText', form.buttonText || "");
      formData.append('heroHeading', JSON.stringify(form.heroHeading));
      formData.append('heroParagraphs', JSON.stringify(form.heroParagraphs));
      formData.append('heroImage', form.heroImage || "");
      formData.append('heroImageAlt', form.heroImageAlt || "");

      if (slugType === 'nested' && form.city && form.serviceName) {
        formData.append('slug', generateNestedSlug());
      } else if (!autoGenerateSlug && form.slug) {
        formData.append('slug', form.slug);
      }

      // ✅ Fixed: Using relative path with axios instance
      const res = await axios.post(
        "/api/services/add",
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        }
      );

      if (res.data.success) {
        showNotification("Service Added Successfully 🚀", 'success');

        setTimeout(() => {
          setForm({
            pageTitle: "",
            miniDescription: "",
            buttonText: "",
            slug: "",
            city: "",
            serviceName: "",
            heroHeading: {
              text: "",
              type: "h1",
              color: "#ffffff",
              fontSize: "48px",
              fontWeight: "bold",
              alignment: "left"
            },
            heroParagraphs: [
              {
                text: "",
                color: "#d1d5db",
                fontSize: "18px",
                fontWeight: "normal",
                fontStyle: "normal",
                textDecoration: "none"
              }
            ],
            heroImage: "",
            heroImageAlt: ""
          });
          setAutoGenerateSlug(true);
          setSlugType('simple');
        }, 1500);
      }
    } catch (error) {
      console.error("Axios Error:", error);

      if (error.response?.status === 401) {
        navigate("/admin/login");
      } else if (error.response) {
        showNotification("Server Error: " + (error.response.data.error || error.response.data.message), 'error');
      } else if (error.request) {
        showNotification("No response from backend. Is server running?", 'error');
      } else {
        showNotification("Error: " + error.message, 'error');
      }
    } finally {
      setLoading(false);
      setActiveButton(null);
    }
  };

  // Notification Component
  const Notification = () => {
    if (!notification.show) return null;

    const colors = {
      success: 'bg-green-500/20 border-green-500 text-green-400',
      warning: 'bg-yellow-500/20 border-yellow-500 text-yellow-400',
      error: 'bg-red-500/20 border-red-500 text-red-400',
      info: 'bg-blue-500/20 border-blue-500 text-blue-400'
    };

    const icons = {
      success: <CheckCircleIcon className="w-5 h-5" />,
      warning: <ExclamationCircleIcon className="w-5 h-5" />,
      error: <ExclamationTriangleIcon className="w-5 h-5" />,
      info: <SparklesIcon className="w-5 h-5" />
    };

    return (
      <div className={`fixed top-24 right-6 z-50 px-4 py-3 rounded-lg border ${colors[notification.type]} backdrop-blur-sm flex items-center gap-2 animate-slideIn`}>
        {icons[notification.type]}
        <span>{notification.message}</span>
      </div>
    );
  };

  // Link Modal Component
  const LinkModal = () => {
    if (!showLinkModal) return null;

    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 animate-fadeIn">
        <div className="bg-[#1a1a2e] rounded-2xl border border-gray-700 p-6 max-w-md w-full mx-4 shadow-2xl">
          <h3 className="text-xl font-bold text-cyan-400 mb-4 flex items-center gap-2">
            <LinkIcon className="w-5 h-5" />
            Add Link
          </h3>

          <div className="space-y-4">
            <div>
              <label className="block text-gray-400 mb-2 text-sm">URL</label>
              <input
                type="url"
                value={linkData.url}
                onChange={(e) => setLinkData({ ...linkData, url: e.target.value })}
                placeholder="https://example.com"
                className="w-full p-3 bg-[#0f0f1a] border border-gray-700 rounded-lg text-white focus:outline-none focus:border-cyan-400 transition"
                autoFocus
              />
            </div>

            <div>
              <label className="block text-gray-400 mb-2 text-sm">Link Text</label>
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-gray-300 cursor-pointer p-2 hover:bg-white/5 rounded-lg transition">
                  <input
                    type="radio"
                    checked={linkData.useSelectedText}
                    onChange={() => setLinkData({ ...linkData, useSelectedText: true })}
                    className="text-cyan-400"
                  />
                  <span>Use selected text: "<span className="text-cyan-400">{linkData.text}</span>"</span>
                </label>
                <label className="flex items-center gap-2 text-gray-300 cursor-pointer p-2 hover:bg-white/5 rounded-lg transition">
                  <input
                    type="radio"
                    checked={!linkData.useSelectedText}
                    onChange={() => setLinkData({ ...linkData, useSelectedText: false })}
                    className="text-cyan-400"
                  />
                  <span>Custom text</span>
                </label>
                {!linkData.useSelectedText && (
                  <input
                    type="text"
                    value={linkData.text}
                    onChange={(e) => setLinkData({ ...linkData, text: e.target.value })}
                    placeholder="Enter link text"
                    className="w-full p-2 bg-[#0f0f1a] border border-gray-700 rounded-lg text-white mt-2 focus:outline-none focus:border-cyan-400 transition"
                  />
                )}
              </div>
            </div>

            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={() => setShowLinkModal(false)}
                className="flex-1 bg-gray-700 hover:bg-gray-600 py-2 rounded-lg transition hover:scale-105"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleCreateLink}
                className="flex-1 bg-cyan-600 hover:bg-cyan-700 py-2 rounded-lg transition hover:scale-105 flex items-center justify-center gap-2"
              >
                <LinkIcon className="w-4 h-4" />
                Add Link
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white text-lg">Saving Service...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Notification />
      <LinkModal />

      <section className="bg-transparent text-white relative">
        {/* Animated Background */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-[100px] animate-pulse pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-600/10 rounded-full blur-[100px] animate-pulse delay-1000 pointer-events-none"></div>

        {/* Back Button */}
        <div className="max-w-4xl mx-auto mb-6 relative z-10">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-gray-400 hover:text-cyan-400 transition-all duration-300 group bg-white/5 backdrop-blur-md px-4 py-2 rounded-xl border border-white/10 hover:border-cyan-500/30 shadow-lg"
          >
            <ArrowLeftIcon className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            <span className="font-medium tracking-wide">Back to Services</span>
          </button>
        </div>

        {/* Header */}
        <div className="max-w-4xl mx-auto mb-10 relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-500/10 border border-cyan-500/20 mb-4">
            <SparklesIcon className="w-4 h-4 text-cyan-400" />
            <span className="text-sm font-semibold text-cyan-400 tracking-wide uppercase">Service Creator</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-linear-to-r from-white to-gray-400 mb-4">
            Add New Service
          </h1>
          <p className="text-gray-400 text-lg">Create a breathtaking new service page with our advanced rich text editor.</p>
        </div>

        {/* Main Form */}
        <form onSubmit={handleSubmit} className="max-w-4xl mx-auto space-y-8 relative z-10">
          {/* Basic Info Card */}
          <div className="bg-[#0a0a16]/80 backdrop-blur-2xl rounded-3xl border border-white/10 p-6 md:p-8 space-y-8 shadow-[0_8px_30px_rgb(0,0,0,0.5)] relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-linear-to-r from-cyan-500 to-blue-600"></div>

            {/* Page Title */}
            <div className="group">
              <label className="block text-gray-300 font-semibold mb-2 group-focus-within:text-cyan-400 transition-colors">
                Page Title <span className="text-cyan-500">*</span>
              </label>
              <div className="relative">
                <input
                  name="pageTitle"
                  value={form.pageTitle}
                  onChange={handleChange}
                  placeholder="e.g., Premium Web Development in London"
                  className="w-full p-4 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all shadow-inner"
                  required
                />
              </div>
              <p className="text-gray-500 text-sm mt-2 flex items-center gap-1.5 ">
                <SparklesIcon className="w-3.5 h-3.5" /> Core heading for the service page
              </p>
            </div>

            {/* URL Type Toggle */}
            <div className="flex gap-3 p-1.5 bg-white/5 rounded-xl border border-white/10">
              <button
                type="button"
                onClick={() => {
                  setSlugType('simple');
                  showNotification('Simple URL mode', 'info');
                }}
                className={`flex-1 py-3 px-4 rounded-lg font-medium transition-all duration-300 flex items-center justify-center gap-2 ${slugType === 'simple'
                  ? 'bg-linear-to-r from-cyan-500 to-blue-600 text-white shadow-lg shadow-cyan-500/25'
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
                  }`}
              >
                <LinkIcon className="w-4 h-4" />
                Simple Static URL
              </button>
              <button
                type="button"
                onClick={() => {
                  setSlugType('nested');
                  showNotification('Location based URL mode', 'info');
                }}
                className={`flex-1 py-3 px-4 rounded-lg font-medium transition-all duration-300 flex items-center justify-center gap-2 ${slugType === 'nested'
                  ? 'bg-linear-to-r from-purple-500 to-pink-600 text-white shadow-lg shadow-purple-500/25'
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
                  }`}
              >
                <BuildingOfficeIcon className="w-4 h-4" />
                Dynamic Location URL
              </button>
            </div>

            {/* Nested URL Fields */}
            {slugType === 'nested' ? (
              <div className="space-y-5 border-t border-white/10 pt-6 mt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="group">
                    <label className="block text-gray-300 font-semibold mb-2 group-focus-within:text-purple-400 transition-colors">
                      City / Location <span className="text-purple-500">*</span>
                    </label>
                    <input
                      name="city"
                      value={form.city}
                      onChange={handleChange}
                      placeholder="e.g., london"
                      className="w-full p-4 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all"
                      required={slugType === 'nested'}
                    />
                  </div>
                  <div className="group">
                    <label className="block text-gray-300 font-semibold mb-2 group-focus-within:text-purple-400 transition-colors">
                      Service Namespace <span className="text-purple-500">*</span>
                    </label>
                    <input
                      name="serviceName"
                      value={form.serviceName}
                      onChange={handleChange}
                      placeholder="e.g., enterprise-seo"
                      className="w-full p-4 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all"
                      required={slugType === 'nested'}
                    />
                  </div>
                </div>
                <div className="bg-purple-500/10 border border-purple-500/20 rounded-xl p-4 flex items-center gap-3">
                  <GlobeAltIcon className="w-5 h-5 text-purple-400 shrink-0" />
                  <p className="text-gray-300 text-sm">
                    Target URL structure: <span className="text-white font-mono font-bold">/services/{form.city || '[city]'}/{form.serviceName || '[service]'}</span>
                  </p>
                </div>
              </div>
            ) : (
              /* Simple Slug Field with Toggle */
              <div className="border-t border-white/10 pt-6 mt-6">
                <div className="flex items-center justify-between mb-3">
                  <label className="block text-gray-300 font-semibold">
                    URL Slug <span className="text-cyan-500">*</span>
                  </label>
                  <button
                    type="button"
                    onClick={toggleSlugMode}
                    className={`text-xs font-bold uppercase tracking-wider px-3 py-1.5 rounded-md transition-all ${autoGenerateSlug
                      ? 'bg-cyan-500 text-white shadow-md shadow-cyan-500/30'
                      : 'bg-white/10 text-gray-400 hover:bg-white/20 hover:text-white'
                      }`}
                  >
                    {autoGenerateSlug ? 'Auto Sync' : 'Manual Edit'}
                  </button>
                </div>

                <div className="relative group">
                  <input
                    name="slug"
                    value={form.slug}
                    onChange={handleChange}
                    disabled={autoGenerateSlug}
                    placeholder={autoGenerateSlug ? "Auto-generated from title" : "Enter custom slug"}
                    className={`w-full p-4 pl-12 ${autoGenerateSlug
                      ? 'bg-black/20 text-gray-500 cursor-not-allowed border-white/5'
                      : 'bg-white/5 text-white border-white/10 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500'
                      } border rounded-xl placeholder-gray-600 focus:outline-none transition-all`}
                    required={!autoGenerateSlug && slugType === 'simple'}
                  />
                  <LinkIcon className={`w-5 h-5 absolute left-4 top-4 transition-colors ${autoGenerateSlug ? 'text-gray-600' : 'text-cyan-500'}`} />
                </div>

                <div className="flex justify-between items-center mt-2">
                  <p className="text-gray-500 text-sm">
                    {autoGenerateSlug
                      ? "Automatically mirrors the page title."
                      : "Define a clean, SEO-friendly identifier."}
                  </p>
                  {!autoGenerateSlug && (
                    <button
                      type="button"
                      onClick={() => setForm({ ...form, slug: generateSlug(form.pageTitle) })}
                      className="text-cyan-400 text-sm hover:text-cyan-300 font-medium transition"
                    >
                      Regenerate
                    </button>
                  )}
                </div>
              </div>
            )}

            {/* URL Preview */}
            {(form.slug || (form.city && form.serviceName)) && (
              <div className="bg-linear-to-r from-cyan-900/30 to-blue-900/30 p-4 lg:p-5 rounded-xl border border-cyan-500/20 backdrop-blur-md">
                <div className="flex items-center gap-2 text-cyan-300 text-sm font-semibold mb-2 uppercase tracking-wide">
                  <GlobeAltIcon className="w-4 h-4" />
                  <span>Live URL Preview</span>
                </div>
                <div className="flex items-center flex-wrap">
                  <span className="text-gray-400 text-base">yoursite.com/services/</span>
                  <span className="text-white font-mono text-base font-bold underline decoration-cyan-500/50 decoration-2 underline-offset-4 break-all">
                    {slugType === 'nested'
                      ? (generateNestedSlug() || 'city/service')
                      : (form.slug || 'your-slug')}
                  </span>
                </div>
              </div>
            )}

            {/* Mini Description */}
            <div className="group">
              <label className="block text-gray-300 font-semibold mb-2 group-focus-within:text-cyan-400 transition-colors">
                Sub Headline Definition
              </label>
              <textarea
                name="miniDescription"
                value={form.miniDescription}
                onChange={handleChange}
                placeholder="Briefly pitch what this service covers..."
                rows="3"
                maxLength="200"
                className="w-full p-4 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all resize-none shadow-inner"
              />
              <div className="flex justify-between mt-2">
                <p className="text-gray-500 text-sm flex items-center gap-1.5"><SparklesIcon className="w-3.5 h-3.5" /> Appears right beneath the title</p>
                <span className={`text-sm font-mono ${form.miniDescription.length >= 180
                  ? 'text-red-400 font-bold'
                  : form.miniDescription.length >= 150
                    ? 'text-yellow-400 font-bold'
                    : 'text-gray-500'
                  }`}>
                  {form.miniDescription.length}/200
                </span>
              </div>
            </div>

            {/* Button Text */}
            <div className="group border-t border-white/10 pt-6 mt-6">
              <label className="block text-gray-300 font-semibold mb-2 group-focus-within:text-cyan-400 transition-colors">
                Button Text
              </label>
              <input
                name="buttonText"
                value={form.buttonText}
                onChange={handleChange}
                placeholder="e.g., Learn More, Get Started, Contact Us"
                className="w-full p-3 bg-[#0f0f1a] border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition"
              />
              <p className="text-gray-500 text-sm mt-1">
                Text for the call-to-action button
              </p>
            </div>
          </div>

          {/* Hero Section with Rich Text Editor */}
          <div className="bg-[#0a0a16]/80 backdrop-blur-2xl rounded-3xl border border-white/10 p-6 md:p-8 space-y-10 shadow-[0_8px_30px_rgb(0,0,0,0.5)]">
            <h2 className="text-2xl md:text-3xl font-extrabold text-transparent bg-clip-text bg-linear-to-r from-cyan-400 to-blue-500 mb-6 flex items-center gap-3 border-b border-white/10 pb-6">
              <SparklesIcon className="w-8 h-8 text-cyan-400" />
              Hero Section Design
            </h2>

            {/* Heading Section */}
            <div className="space-y-6 bg-white/5 rounded-2xl p-6 border border-white/10">
              <h3 className="text-xl font-bold text-white flex items-center gap-2">
                <span className="w-8 h-8 rounded-lg bg-cyan-500/20 text-cyan-400 flex items-center justify-center text-sm">1</span>
                Main Headline
              </h3>

              {/* Heading Text */}
              <div className="group">
                <label className="block text-gray-400 mb-2 text-sm font-medium group-focus-within:text-cyan-400 transition-colors">Headline Text</label>
                <input
                  type="text"
                  value={form.heroHeading.text}
                  onChange={(e) => handleHeadingChange('text', e.target.value)}
                  placeholder="e.g., Transform Your Digital Presence..."
                  className="w-full p-4 bg-[#050508] border border-white/10 rounded-xl text-white focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all font-medium text-lg"
                />
              </div>

              {/* Heading Controls */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 pt-2">
                <div>
                  <label className="block text-gray-400 mb-2 text-sm">HTML Tag</label>
                  <div className="relative">
                    <select
                      value={form.heroHeading.type}
                      onChange={(e) => handleHeadingChange('type', e.target.value)}
                      className="w-full p-3.5 bg-[#050508] border border-white/10 rounded-xl text-white appearance-none focus:outline-none focus:border-cyan-500"
                    >
                      <option value="h1">Heading 1 (SEO Main)</option>
                      <option value="h2">Heading 2</option>
                      <option value="h3">Heading 3</option>
                      <option value="h4">Heading 4</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-gray-400 mb-2 text-sm">Text Color</label>
                  <div className="flex items-center gap-3">
                    <input
                      type="color"
                      value={form.heroHeading.color}
                      onChange={(e) => handleHeadingChange('color', e.target.value)}
                      className="w-12 h-12 rounded-xl cursor-pointer bg-transparent border-0 p-0"
                    />
                    <span className="text-gray-300 font-mono text-sm bg-black/30 px-3 py-2 rounded-lg border border-white/5">{form.heroHeading.color}</span>
                  </div>
                </div>

                <div>
                  <label className="block text-gray-400 mb-2 text-sm">Size Preset</label>
                  <select
                    value={form.heroHeading.fontSize}
                    onChange={(e) => handleHeadingChange('fontSize', e.target.value)}
                    className="w-full p-3.5 bg-[#050508] border border-white/10 rounded-xl text-white appearance-none focus:outline-none focus:border-cyan-500"
                  >
                    <option value="32px">Small</option>
                    <option value="40px">Medium</option>
                    <option value="48px">Large (Default)</option>
                    <option value="56px">Extra Large</option>
                    <option value="64px">Huge</option>
                  </select>
                </div>

                <div>
                  <label className="block text-gray-400 mb-2 text-sm">Text Alignment</label>
                  <select
                    value={form.heroHeading.alignment}
                    onChange={(e) => handleHeadingChange('alignment', e.target.value)}
                    className="w-full p-3.5 bg-[#050508] border border-white/10 rounded-xl text-white appearance-none text-transform capitalize focus:outline-none focus:border-cyan-500"
                  >
                    <option value="left">Left Align</option>
                    <option value="center">Center Align</option>
                    <option value="right">Right Align</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Paragraphs Section */}
            <div className="space-y-6 bg-white/5 rounded-2xl p-6 border border-white/10">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                  <span className="w-8 h-8 rounded-lg bg-blue-500/20 text-blue-400 flex items-center justify-center text-sm">2</span>
                  Rich Body Content
                </h3>
                <button
                  type="button"
                  onClick={addParagraph}
                  className="bg-linear-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 px-5 py-2.5 rounded-xl text-sm font-bold flex items-center gap-2 transition-all hover:scale-105 shadow-lg shadow-blue-500/25"
                >
                  <span className="text-lg leading-none">+</span> Add Paragraph Block
                </button>
              </div>

              {form.heroParagraphs.map((para, index) => (
                <div key={index} className="bg-[#050508] p-5 rounded-xl border border-white/5 space-y-4 shadow-inner relative group/para transition-all hover:border-white/10">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400 text-sm font-medium uppercase tracking-wider">Paragraph Block {index + 1}</span>
                    {form.heroParagraphs.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeParagraph(index)}
                        className="text-red-400 hover:text-red-300 hover:bg-red-500/10 px-3 py-1.5 rounded text-sm transition-all"
                      >
                        Delete Block
                      </button>
                    )}
                  </div>

                  {/* Formatting Toolbar */}
                  <div className="flex flex-wrap gap-2 p-2 bg-[#0a0a16] rounded-xl border border-white/10 sticky top-0 z-10 w-max">
                    <button
                      type="button"
                      onClick={() => {
                        const textarea = document.getElementById(`paragraph-${index}`);
                        if (textarea && textarea.selectionStart === textarea.selectionEnd) {
                          showNotification('Select some text first', 'warning');
                        } else {
                          applyFormatting(index, 'link');
                        }
                      }}
                      className={`p-2.5 hover:bg-white/10 rounded-lg transition-all relative group active:scale-95 ${activeButton === 'link' ? 'bg-cyan-500/20 text-cyan-400' : 'text-gray-300'
                        }`}
                      title="Insert Link"
                    >
                      <LinkIcon className="w-5 h-5" />
                      <span className="absolute -top-10 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white text-xs py-1.5 px-3 rounded-lg opacity-0 group-hover:opacity-100 transition whitespace-nowrap pointer-events-none border border-gray-700 shadow-xl">
                        Add Link (Select text first)
                      </span>
                    </button>

                    <div className="w-px h-8 bg-white/10 my-auto mx-1"></div>

                    <button
                      type="button"
                      onClick={() => applyFormatting(index, 'italic')}
                      className={`p-2.5 hover:bg-white/10 rounded-lg transition-all relative group active:scale-95 ${activeButton === 'italic' ? 'bg-cyan-500/20 text-cyan-400' : 'text-gray-300'
                        }`}
                      title="Italic"
                    >
                      <ItalicIcon className="w-5 h-5" />
                    </button>

                    <button
                      type="button"
                      onClick={() => applyFormatting(index, 'underline')}
                      className={`p-2.5 hover:bg-white/10 rounded-lg transition-all relative group active:scale-95 ${activeButton === 'underline' ? 'bg-cyan-500/20 text-cyan-400' : 'text-gray-300'
                        }`}
                      title="Underline"
                    >
                      <UnderlineIcon className="w-5 h-5" />
                    </button>

                    <div className="w-px h-8 bg-white/10 my-auto mx-1"></div>

                    <button
                      type="button"
                      onClick={() => applyFormatting(index, 'color')}
                      className={`p-2.5 hover:bg-white/10 rounded-lg transition-all relative group active:scale-95 ${activeButton === 'color' ? 'bg-cyan-500/20 text-cyan-400' : 'text-gray-300'
                        }`}
                      title="Text Color"
                    >
                      <PaintBrushIcon className="w-5 h-5" />
                      <span className="absolute -top-10 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white text-xs py-1.5 px-3 rounded-lg opacity-0 group-hover:opacity-100 transition whitespace-nowrap pointer-events-none border border-gray-700 shadow-xl">
                        Inline Text Color
                      </span>
                    </button>
                  </div>

                  {/* Paragraph Textarea */}
                  <textarea
                    id={`paragraph-${index}`}
                    value={para.text}
                    onChange={(e) => handleParagraphChange(index, 'text', e.target.value)}
                    placeholder={`Enter paragraph ${index + 1} text with HTML tags...`}
                    rows="4"
                    className="w-full p-3 bg-[#0f0f1a] border border-gray-700 rounded-lg text-white font-mono text-sm focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400"
                  />

                  {/* Preview of formatted text */}
                  <div className="min-h-[100px] p-3 bg-[#0f0f1a] border border-gray-700 rounded-lg text-white overflow-auto">
                    <p className="text-xs text-gray-400 mb-2">Preview:</p>
                    <div
                      style={{
                        color: para.color,
                        fontSize: para.fontSize,
                        fontWeight: para.fontWeight,
                        fontStyle: para.fontStyle,
                        textDecoration: para.textDecoration
                      }}
                      dangerouslySetInnerHTML={{
                        __html: para.text
                          .replace(/<em>(.*?)<\/em>/g, '<em>$1</em>')
                          .replace(/<u>(.*?)<\/u>/g, '<u>$1</u>')
                          .replace(/<a href="(.*?)" target="_blank" rel="noopener noreferrer" class="text-cyan-400 hover:text-cyan-300 underline">(.*?)<\/a>/g, '<a href="$1" target="_blank" rel="noopener noreferrer" class="text-cyan-400 hover:text-cyan-300 underline">$2</a>')
                          .replace(/<span style="color:(.*?)">(.*?)<\/span>/g, '<span style="color:$1">$2</span>')
                      }}
                    />
                  </div>

                  {/* Paragraph Controls */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    <div>
                      <label className="block text-gray-400 mb-1 text-xs">Color</label>
                      <input
                        type="color"
                        value={para.color}
                        onChange={(e) => handleParagraphChange(index, 'color', e.target.value)}
                        className="w-full h-8 bg-[#0f0f1a] border border-gray-700 rounded"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-400 mb-1 text-xs">Font Size</label>
                      <select
                        value={para.fontSize}
                        onChange={(e) => handleParagraphChange(index, 'fontSize', e.target.value)}
                        className="w-full p-1 bg-[#0f0f1a] border border-gray-700 rounded text-white text-sm"
                      >
                        <option value="14px">Small (14px)</option>
                        <option value="16px">Normal (16px)</option>
                        <option value="18px">Large (18px)</option>
                        <option value="20px">Extra Large (20px)</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-gray-400 mb-1 text-xs">Font Weight</label>
                      <select
                        value={para.fontWeight}
                        onChange={(e) => handleParagraphChange(index, 'fontWeight', e.target.value)}
                        className="w-full p-1 bg-[#0f0f1a] border border-gray-700 rounded text-white text-sm"
                      >
                        <option value="normal">Normal</option>
                        <option value="bold">Bold</option>
                        <option value="300">Light</option>
                        <option value="500">Medium</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-gray-400 mb-1 text-xs">Style</label>
                      <select
                        value={para.fontStyle}
                        onChange={(e) => handleParagraphChange(index, 'fontStyle', e.target.value)}
                        className="w-full p-1 bg-[#0f0f1a] border border-gray-700 rounded text-white text-sm"
                      >
                        <option value="normal">Normal</option>
                        <option value="italic">Italic</option>
                      </select>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Hero Image */}
            <div className="space-y-6 bg-white/5 rounded-2xl p-6 border border-white/10">
              <h3 className="text-xl font-bold text-white flex items-center gap-2">
                <span className="w-8 h-8 rounded-lg bg-pink-500/20 text-pink-400 flex items-center justify-center text-sm">3</span>
                Cover Media
              </h3>

              {/* Image Upload Section */}
              <div className="space-y-5">
                {/* Current Image Preview */}
                {form.heroImage && (
                  <div className="relative group rounded-xl overflow-hidden border border-white/10 shadow-lg">
                    <img
                      src={form.heroImage}
                      alt={form.heroImageAlt || "Hero image"}
                      className="w-full h-56 object-cover transition-transform duration-700 group-hover:scale-105"
                      onError={(e) => {
                        e.target.src = 'https://via.placeholder.com/800x400?text=Invalid+Image+URL';
                        showNotification('Failed to load image', 'error');
                      }}
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                      <button
                        type="button"
                        onClick={() => setForm({ ...form, heroImage: "" })}
                        className="bg-red-500 hover:bg-red-600 text-white p-3 rounded-full flex items-center justify-center transform scale-90 group-hover:scale-100 transition-all shadow-xl"
                        title="Remove image"
                      >
                        <XMarkIcon className="w-6 h-6" />
                      </button>
                    </div>
                  </div>
                )}

                {/* Upload Button */}
                <div className="flex items-center gap-4 relative">
                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/gif,image/webp"
                    onChange={handleImageUpload}
                    className="hidden"
                    id="imageUpload"
                    disabled={uploading}
                  />
                  <label
                    htmlFor="imageUpload"
                    className={`flex-1 bg-linear-to-r ${form.heroImage ? 'from-gray-700 to-gray-800 border-gray-600' : 'from-pink-600 to-purple-600 hover:from-pink-500 hover:to-purple-500'} px-6 py-4 rounded-xl text-center cursor-pointer flex items-center justify-center gap-3 transition-all duration-300 hover:shadow-[0_10px_30px_rgba(236,72,153,0.3)] font-semibold tracking-wide ${uploading ? 'opacity-50 cursor-not-allowed' : 'hover:-translate-y-1'
                      }`}
                  >
                    {uploading ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        Uploading media...
                      </>
                    ) : (
                      <>
                        <CloudArrowUpIcon className="w-6 h-6" />
                        {form.heroImage ? 'Replace Cover Image' : 'Upload Cover Image'}
                      </>
                    )}
                  </label>
                  {uploading && (
                    <div className="absolute inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center rounded-xl z-10">
                      <div className="w-8 h-8 border-4 border-pink-500 border-t-transparent rounded-full animate-spin"></div>
                    </div>
                  )}
                </div>

                {/* Image URL Input (fallback) */}
                <div className="relative group">
                  <input
                    type="url"
                    value={form.heroImage}
                    onChange={(e) => setForm({ ...form, heroImage: e.target.value })}
                    placeholder="Alternatively, paste an external image URL here..."
                    className="w-full p-4 pl-12 bg-[#050508] border border-white/10 rounded-xl text-white focus:outline-none focus:border-pink-500 focus:ring-1 focus:ring-pink-500 transition-all font-mono text-sm"
                  />
                  <PhotoIcon className="w-5 h-5 text-gray-500 group-focus-within:text-pink-500 transition-colors absolute left-4 top-4" />
                </div>

                {/* Alt Text */}
                <div className="group">
                  <input
                    type="text"
                    value={form.heroImageAlt}
                    onChange={(e) => setForm({ ...form, heroImageAlt: e.target.value })}
                    placeholder="SEO Image Alt attribute (e.g. 'Team collaborating on project')"
                    className="w-full p-4 bg-[#050508] border border-white/10 rounded-xl text-white focus:outline-none focus:border-pink-500 focus:ring-1 focus:ring-pink-500 transition-all text-sm"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Live Preview Console */}
          <div className="bg-[#0a0a16]/90 backdrop-blur-3xl rounded-3xl border border-white/10 p-6 md:p-8 relative overflow-hidden shadow-2xl">
            {/* Visual Flair */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/10 blur-[50px] pointer-events-none rounded-full"></div>

            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-white flex items-center gap-2">
                <span className="relative flex h-3 w-3 mr-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-cyan-500"></span>
                </span>
                Live Rendering Engine
              </h3>
            </div>

            <div className="bg-linear-to-br from-[#050508] to-[#0a0a16] p-6 rounded-2xl border border-white/5 ring-1 ring-white/5 shadow-inner min-h-[500px] flex flex-col justify-center">
              <div className="max-w-3xl mx-auto w-full">
                {/* Heading Preview */}
                {form.heroHeading.text && (
                  <div style={{ textAlign: form.heroHeading.alignment }} className="mb-4">
                    {form.heroHeading.type === 'h1' && (
                      <h1 style={{ color: form.heroHeading.color, fontSize: form.heroHeading.fontSize, fontWeight: form.heroHeading.fontWeight, lineHeight: '1.2' }}>{form.heroHeading.text}</h1>
                    )}
                    {form.heroHeading.type === 'h2' && (
                      <h2 style={{ color: form.heroHeading.color, fontSize: form.heroHeading.fontSize, fontWeight: form.heroHeading.fontWeight, lineHeight: '1.2' }}>{form.heroHeading.text}</h2>
                    )}
                    {form.heroHeading.type === 'h3' && (
                      <h3 style={{ color: form.heroHeading.color, fontSize: form.heroHeading.fontSize, fontWeight: form.heroHeading.fontWeight, lineHeight: '1.2' }}>{form.heroHeading.text}</h3>
                    )}
                    {form.heroHeading.type === 'h4' && (
                      <h4 style={{ color: form.heroHeading.color, fontSize: form.heroHeading.fontSize, fontWeight: form.heroHeading.fontWeight, lineHeight: '1.2' }}>{form.heroHeading.text}</h4>
                    )}
                  </div>
                )}

                {/* Paragraphs Preview */}
                {form.heroParagraphs.map((para, index) => (
                  <div
                    key={index}
                    style={{
                      color: para.color,
                      fontSize: para.fontSize,
                      fontWeight: para.fontWeight,
                      fontStyle: para.fontStyle,
                      textDecoration: para.textDecoration,
                      marginBottom: '1rem',
                      lineHeight: '1.7',
                      textAlign: form.heroHeading.alignment || 'left'
                    }}
                    dangerouslySetInnerHTML={{
                      __html: para.text
                        .replace(/<em>(.*?)<\/em>/g, '<em>$1</em>')
                        .replace(/<u>(.*?)<\/u>/g, '<u>$1</u>')
                        .replace(/<a href="(.*?)" target="_blank" rel="noopener noreferrer" class="text-cyan-400 hover:text-cyan-300 underline">(.*?)<\/a>/g, '<a href="$1" target="_blank" rel="noopener noreferrer" class="text-cyan-400 hover:text-cyan-300 underline font-medium">$2</a>')
                        .replace(/<span style="color:(.*?)">(.*?)<\/span>/g, '<span style="color:$1">$2</span>')
                    }}
                  />
                ))}

                {/* Image Preview */}
                {form.heroImage && (
                  <div className="mt-8 rounded-2xl overflow-hidden border border-white/10 shadow-[0_10px_30px_rgb(0,0,0,0.5)] transform hover:scale-[1.01] transition-transform duration-500">
                    <img
                      src={form.heroImage}
                      alt={form.heroImageAlt || 'Hero preview'}
                      className="w-full h-auto object-cover max-h-[500px]"
                      onError={(e) => { e.target.src = 'https://via.placeholder.com/800x400?text=Preview+Not+Available'; }}
                    />
                  </div>
                )}

                {/* Empty State */}
                {!form.heroHeading.text && !form.heroParagraphs[0].text && !form.heroImage && (
                  <div className="text-center py-20 text-gray-600 border-2 border-dashed border-white/5 rounded-2xl">
                    <PhotoIcon className="w-16 h-16 mx-auto mb-4 opacity-50" />
                    <p className="font-medium text-lg">Your masterpiece awaits...</p>
                    <p className="text-sm">Start typing above to see the magic happen in real-time.</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 pt-6">
            <button
              type="submit"
              disabled={loading || uploading || !form.pageTitle.trim() || (slugType === 'simple' && !autoGenerateSlug && !form.slug.trim()) || (slugType === 'nested' && (!form.city || !form.serviceName))}
              className={`flex-1 relative group overflow-hidden bg-linear-to-r from-cyan-500 to-blue-600 p-5 rounded-2xl font-black uppercase tracking-wider text-base transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_10px_40px_rgba(6,182,212,0.3)] hover:shadow-[0_15px_50px_rgba(6,182,212,0.5)] hover:-translate-y-1 ${activeButton === 'submit' ? 'animate-pulse scale-95' : ''
                }`}
            >
              <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10 mix-blend-overlay"></div>
              <div className="absolute inset-0 w-full h-full bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out z-0"></div>
              <span className="relative z-10 flex items-center justify-center gap-3">
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Executing Launch...
                  </>
                ) : (
                  <>Publish Service Config <SparklesIcon className="w-5 h-5" /></>
                )}
              </span>
            </button>

            <button
              type="button"
              onClick={() => {
                if (window.confirm("⚠️ Are you sure you want to annihilate all input data? This action cannot be undone.")) {
                  // ... Reset logic remains identical
                  setForm({
                    pageTitle: "", miniDescription: "", buttonText: "", slug: "", city: "", serviceName: "",
                    heroHeading: { text: "", type: "h1", color: "#ffffff", fontSize: "48px", fontWeight: "bold", alignment: "left" },
                    heroParagraphs: [{ text: "", color: "#d1d5db", fontSize: "18px", fontWeight: "normal", fontStyle: "normal", textDecoration: "none" }],
                    heroImage: "", heroImageAlt: ""
                  });
                  setAutoGenerateSlug(true); setSlugType('simple');
                  showNotification('All fields eradicated.', 'info');
                }
              }}
              className="sm:w-1/3 px-6 py-5 bg-white/5 border border-red-500/30 hover:bg-red-500/10 hover:border-red-500/80 rounded-2xl font-bold uppercase tracking-widest text-[#ef4444] transition-all hover:shadow-[0_0_20px_rgba(239,68,68,0.2)]"
            >
              Deleted
            </button>
          </div>

          <p className="text-center font-mono text-gray-600 text-xs tracking-widest uppercase mt-4 opacity-60">
            [ <span className="text-red-500 font-bold">*</span> ] Mandatory parameters required for initialization
          </p>
        </form>
      </section>

      {/* Styles */}
      <style>{`
        @keyframes slideIn {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
        
        .animate-slideIn {
          animation: slideIn 0.3s ease-out;
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out;
        }

        button:active {
          transform: scale(0.95);
        }
      `}</style>
    </>
  );
}
