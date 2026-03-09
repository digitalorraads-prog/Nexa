// done
import { useEffect, useState } from "react";
import axios from "../../Protected/axios"; // ✅ Correct - using custom axios instance
import { useParams, useNavigate } from "react-router-dom";
import {
  PencilIcon,
  DocumentTextIcon,
  ArrowLeftIcon,
  SparklesIcon,
  TrashIcon,
  LinkIcon,
  GlobeAltIcon,
  ExclamationTriangleIcon,
  BuildingOfficeIcon,
  WrenchScrewdriverIcon,
  PhotoIcon,
  PaintBrushIcon,
  ItalicIcon,
  ComputerDesktopIcon,
  UnderlineIcon,
  CloudArrowUpIcon,
  XMarkIcon,
  CheckCircleIcon,
  ExclamationCircleIcon,

} from '@heroicons/react/24/outline';

export default function AdminEditService() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [autoGenerateSlug, setAutoGenerateSlug] = useState(true);
  const [slugType, setSlugType] = useState('simple');
  const [originalData, setOriginalData] = useState(null);

  // New states for better UX
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

  // Parse nested slug into city and service
  const parseNestedSlug = (slug) => {
    if (slug && slug.includes('/')) {
      const parts = slug.split('/');
      return {
        city: parts[0] || "",
        serviceName: parts[1] || ""
      };
    }
    return { city: "", serviceName: "" };
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

  useEffect(() => {
    fetchService();
  }, [id]);

  const fetchService = async () => {
    try {
      setActiveButton('fetching');
      const res = await axios.get(`/api/services/${id}`);

      if (res.data.success && res.data.data) {
        const service = res.data.data;

        // Check if slug is nested (contains '/')
        const isNested = service.slug && service.slug.includes('/');
        const { city, serviceName } = isNested ? parseNestedSlug(service.slug) : {};

        setOriginalData(service);
        setForm({
          pageTitle: service.pageTitle || "",
          miniDescription: service.miniDescription || "",
          buttonText: service.buttonText || "",
          slug: service.slug || "",
          city: city || "",
          serviceName: serviceName || "",
          // Rich text fields
          heroHeading: service.heroHeading || {
            text: "",
            type: "h1",
            color: "#ffffff",
            fontSize: "48px",
            fontWeight: "bold",
            alignment: "left"
          },
          heroParagraphs: service.heroParagraphs || [{
            text: "",
            color: "#d1d5db",
            fontSize: "18px",
            fontWeight: "normal",
            fontStyle: "normal",
            textDecoration: "none"
          }],
          heroImage: service.heroImage || "",
          heroImageAlt: service.heroImageAlt || ""
        });

        setSlugType(isNested ? 'nested' : 'simple');

        const generatedSlug = generateSlug(service.pageTitle || "");
        setAutoGenerateSlug(!isNested && service.slug === generatedSlug);

        showNotification('Service loaded successfully', 'success');
      } else {
        showNotification('Service not found', 'error');
        navigate("/admin/services");
      }
    } catch (error) {
      console.error("Error fetching service:", error);

      if (error.response?.status === 401) {
        navigate("/admin/login");
      } else if (error.response?.status === 404) {
        showNotification('Service not found', 'error');
        navigate("/admin/services");
      } else {
        showNotification('Failed to load service', 'error');
      }
    } finally {
      setLoading(false);
      setActiveButton(null);
    }
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

  // Handle image upload
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

    const formData = new FormData();
    formData.append('image', file);

    setUploading(true);
    setActiveButton('uploading');

    try {
      const response = await axios.post(
        '/api/services/upload-image',
        formData,
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
        showNotification('Image uploaded successfully!', 'success');
      }
    } catch (error) {
      console.error("Upload error:", error);
      showNotification(error.response?.data?.error || 'Failed to upload image', 'error');
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
    const textarea = document.getElementById(`edit-paragraph-${index}`);
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

    // Show active button effect
    setActiveButton(formatType);
    setTimeout(() => setActiveButton(null), 200);

    // Restore selection
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

    const textarea = document.getElementById(`edit-paragraph-${currentLinkIndex}`);
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

    // Restore selection
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
    } else {
      const { city, serviceName } = parseNestedSlug(form.slug);
      setForm({
        ...form,
        city: city || "",
        serviceName: serviceName || "",
      });
    }
    showNotification(`URL type: ${newType}`, 'info');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.pageTitle.trim()) {
      showNotification('Page Title is required', 'warning');
      return;
    }

    if (slugType === 'simple' && !autoGenerateSlug && !form.slug.trim()) {
      showNotification('Slug is required in manual mode', 'warning');
      return;
    }

    if (slugType === 'nested' && (!form.city || !form.serviceName)) {
      showNotification('City and Service Name are required for nested URL', 'warning');
      return;
    }

    setSubmitting(true);
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

      if (slugType === 'nested') {
        const nestedSlug = generateNestedSlug();
        if (nestedSlug !== originalData?.slug) {
          formData.append('slug', nestedSlug);
        }
      } else if (!autoGenerateSlug && form.slug && form.slug !== originalData?.slug) {
        formData.append('slug', form.slug);
      }

      const res = await axios.put(
        `/api/services/update/${id}`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        }
      );

      if (res.data.success) {
        showNotification('Service Updated Successfully 🚀', 'success');
        setTimeout(() => navigate("/admin/services"), 1500);
      }
    } catch (error) {
      console.error("Update Error:", error);

      if (error.response?.status === 401) {
        navigate("/admin/login");
      } else if (error.response?.status === 400) {
        showNotification(error.response.data.error || "Invalid data", 'error');
      } else if (error.response) {
        showNotification("Server Error: " + (error.response.data.error || "Something went wrong"), 'error');
      } else if (error.request) {
        showNotification("No response from backend. Is server running?", 'error');
      } else {
        showNotification("Error: " + error.message, 'error');
      }
    } finally {
      setSubmitting(false);
      setActiveButton(null);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this service?")) {
      return;
    }

    try {
      setActiveButton('delete');
      const res = await axios.delete(`/api/services/delete/${id}`);

      if (res.data.success) {
        showNotification('Service deleted successfully', 'success');
        setTimeout(() => navigate("/admin/services"), 1500);
      }
    } catch (error) {
      console.error("Delete Error:", error);
      showNotification('Failed to delete service', 'error');
    } finally {
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
          <p className="text-white text-lg">Loading Service...</p>
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
        <div className="absolute top-0 right-0 w-96 h-96 bg-purple-500/10 rounded-full blur-[100px] animate-pulse pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-cyan-600/10 rounded-full blur-[100px] animate-pulse delay-1000 pointer-events-none"></div>

        {/* Header with Back Button */}
        <div className="max-w-4xl mx-auto mb-6 relative z-10">
          <button
            onClick={() => navigate("/admin/services")}
            className="flex items-center gap-2 text-gray-400 hover:text-cyan-400 transition-all duration-300 mb-6 group bg-white/5 backdrop-blur-md px-4 py-2 rounded-xl border border-white/10 hover:border-cyan-500/30 shadow-lg w-fit"
          >
            <ArrowLeftIcon className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            <span className="font-medium tracking-wide">Back to Services</span>
          </button>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-500/10 border border-cyan-500/20 mb-4">
                <PencilIcon className="w-4 h-4 text-cyan-400" />
                <span className="text-sm font-semibold text-cyan-400 tracking-wide uppercase">Service Editor</span>
              </div>
              <h1 className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400 mb-4">
                Edit Service Config
              </h1>
              <p className="text-gray-400 text-lg">Modify your service settings and rich visual content.</p>
            </div>

            {/* Delete Button */}
            <button
              onClick={handleDelete}
              disabled={activeButton === 'delete'}
              className={`bg-red-500/10 hover:bg-red-500/20 text-red-500 p-4 rounded-xl transition-all border border-red-500/20 hover:border-red-500/50 hover:shadow-[0_0_20px_rgba(239,68,68,0.2)] disabled:opacity-50 disabled:cursor-not-allowed group ${activeButton === 'delete' ? 'animate-pulse' : ''}`}
              title="Delete Service"
            >
              <TrashIcon className="w-6 h-6 group-hover:scale-110 transition-transform" />
            </button>
          </div>
        </div>

        {/* Main Form */}
        <form onSubmit={handleSubmit} className="max-w-4xl mx-auto space-y-8 relative z-10">
          {/* Basic Info Card */}
          <div className="bg-[#0a0a16]/80 backdrop-blur-2xl rounded-3xl border border-white/10 p-6 md:p-8 space-y-8 shadow-[0_8px_30px_rgb(0,0,0,0.5)] relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-cyan-500 to-blue-600"></div>

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
                onClick={toggleSlugType}
                className={`flex-1 py-3 px-4 rounded-lg font-medium transition-all duration-300 flex items-center justify-center gap-2 ${slugType === 'simple'
                  ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg shadow-cyan-500/25'
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
                  }`}
              >
                <LinkIcon className="w-4 h-4" />
                Simple Static URL
              </button>
              <button
                type="button"
                onClick={toggleSlugType}
                className={`flex-1 py-3 px-4 rounded-lg font-medium transition-all duration-300 flex items-center justify-center gap-2 ${slugType === 'nested'
                  ? 'bg-gradient-to-r from-purple-500 to-pink-600 text-white shadow-lg shadow-purple-500/25'
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
                  <GlobeAltIcon className="w-5 h-5 text-purple-400 flex-shrink-0" />
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
              <div className={`p-4 lg:p-5 rounded-xl border backdrop-blur-md transition-all ${originalData?.slug !== (slugType === 'nested' ? generateNestedSlug() : form.slug)
                ? 'bg-gradient-to-r from-yellow-900/40 to-orange-900/30 border-yellow-500/30 shadow-[0_4px_20px_rgba(234,179,8,0.15)]'
                : 'bg-gradient-to-r from-cyan-900/30 to-blue-900/30 border-cyan-500/20'
                }`}>
                <div className={`flex items-center gap-2 text-sm font-semibold mb-2 uppercase tracking-wide ${originalData?.slug !== (slugType === 'nested' ? generateNestedSlug() : form.slug) ? 'text-yellow-400' : 'text-cyan-300'
                  }`}>
                  <GlobeAltIcon className="w-4 h-4" />
                  <span>Live URL Preview</span>
                </div>
                <div className="flex items-center flex-wrap">
                  <span className="text-gray-400 text-base">yoursite.com/services/</span>
                  <span className={`font-mono text-base font-bold underline decoration-2 underline-offset-4 break-all ${originalData?.slug !== (slugType === 'nested' ? generateNestedSlug() : form.slug)
                    ? 'text-yellow-300 decoration-yellow-500/50'
                    : 'text-white decoration-cyan-500/50'
                    }`}>
                    {slugType === 'nested'
                      ? (form.city && form.serviceName ? `${form.city}/${form.serviceName}` : form.slug)
                      : form.slug}
                  </span>
                </div>

                {originalData?.slug !== (slugType === 'nested' ? generateNestedSlug() : form.slug) && (
                  <div className="flex items-start gap-3 mt-4 text-yellow-200 text-sm bg-yellow-500/20 p-3 rounded-lg border border-yellow-500/30">
                    <ExclamationTriangleIcon className="w-5 h-5 flex-shrink-0 text-yellow-500 mt-0.5" />
                    <div>
                      <p className="font-semibold mb-1">URL Path Modification Detected</p>
                      <p>Current active URL is: <code className="font-mono bg-black/40 px-1.5 py-0.5 rounded text-white">{originalData?.slug}</code></p>
                      <p className="text-yellow-400/80 mt-1">Warning: Changing the path will cause incoming static links to 404 unless routed via .htaccess or similar.</p>
                    </div>
                  </div>
                )}
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
                Call To Action Button Text
              </label>
              <input
                name="buttonText"
                value={form.buttonText}
                onChange={handleChange}
                placeholder="e.g., Learn More, Get Started, Contact Us"
                className="w-full p-4 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all shadow-inner"
              />
              <p className="text-gray-500 text-sm mt-2">
                Action text displayed on the primary interaction button.
              </p>
            </div>
          </div>

          {/* Rich Text Editor Card */}
          <div className="bg-[#0a0a16]/80 backdrop-blur-2xl rounded-3xl border border-white/10 p-6 md:p-8 space-y-10 shadow-[0_8px_30px_rgb(0,0,0,0.5)] relative overflow-hidden mt-8">
            <div className="absolute top-0 right-0 w-full h-1 bg-gradient-to-l from-purple-500 to-pink-600"></div>

            <div className="flex items-center gap-4 border-b border-white/10 pb-6">
              <div className="p-3 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-xl border border-purple-500/30">
                <PaintBrushIcon className="w-6 h-6 text-purple-400" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white">Visual Content Studio</h2>
                <p className="text-gray-400 text-sm mt-1">Design the hero section and rich text areas</p>
              </div>
            </div>

            {/* Heading Section */}
            <div className="space-y-6 bg-white/5 rounded-2xl p-6 border border-white/5">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-8 h-8 rounded-lg bg-pink-500/20 flex items-center justify-center border border-pink-500/30">
                  <span className="text-pink-400 font-bold font-mono">H</span>
                </div>
                <h3 className="text-lg font-bold text-white">Hero Heading Configuration</h3>
              </div>

              <div className="group">
                <label className="block text-gray-300 font-semibold mb-2 group-focus-within:text-pink-400 transition-colors">
                  Primary Display Text
                </label>
                <input
                  type="text"
                  value={form.heroHeading.text}
                  onChange={(e) => handleHeadingChange('text', e.target.value)}
                  placeholder="Enter a captivating headline..."
                  className="w-full p-4 bg-[#050508] border border-white/10 rounded-xl text-white placeholder-gray-600 focus:outline-none focus:border-pink-500 focus:ring-1 focus:ring-pink-500 transition-all font-medium text-lg"
                />
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 pt-4">
                <div className="space-y-2">
                  <label className="block text-gray-400 text-sm font-medium">Tag Type</label>
                  <select
                    value={form.heroHeading.type}
                    onChange={(e) => handleHeadingChange('type', e.target.value)}
                    className="w-full p-3 bg-[#050508] border border-white/10 rounded-lg text-gray-200 focus:outline-none focus:border-pink-500 transition-colors cursor-pointer"
                  >
                    <option value="h1">Heading 1 (SEO Primary)</option>
                    <option value="h2">Heading 2</option>
                    <option value="h3">Heading 3</option>
                    <option value="h4">Heading 4</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="block text-gray-400 text-sm font-medium">Text Color</label>
                  <div className="relative flex items-center">
                    <input
                      type="color"
                      value={form.heroHeading.color}
                      onChange={(e) => handleHeadingChange('color', e.target.value)}
                      className="w-10 h-10 rounded cursor-pointer bg-transparent border-0 p-0"
                    />
                    <span className="ml-3 font-mono text-gray-300 uppercase text-sm">{form.heroHeading.color}</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-gray-400 text-sm font-medium">Size Preset</label>
                  <select
                    value={form.heroHeading.fontSize}
                    onChange={(e) => handleHeadingChange('fontSize', e.target.value)}
                    className="w-full p-3 bg-[#050508] border border-white/10 rounded-lg text-gray-200 focus:outline-none focus:border-pink-500 transition-colors cursor-pointer"
                  >
                    <option value="32px">Compact (32px)</option>
                    <option value="40px">Standard (40px)</option>
                    <option value="48px">Prominent (48px)</option>
                    <option value="56px">Display (56px)</option>
                    <option value="64px">Massive (64px)</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="block text-gray-400 text-sm font-medium">Alignment</label>
                  <select
                    value={form.heroHeading.alignment}
                    onChange={(e) => handleHeadingChange('alignment', e.target.value)}
                    className="w-full p-3 bg-[#050508] border border-white/10 rounded-lg text-gray-200 focus:outline-none focus:border-pink-500 transition-colors cursor-pointer"
                  >
                    <option value="left" className="text-left">Left Aligned</option>
                    <option value="center" className="text-center">Center Aligned</option>
                    <option value="right" className="text-right">Right Aligned</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Paragraphs Section */}
            <div className="space-y-6 bg-white/5 rounded-2xl p-6 border border-white/5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-cyan-500/20 flex items-center justify-center border border-cyan-500/30">
                    <span className="text-cyan-400 font-bold font-serif italic">P</span>
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white">Rich Body Content</h3>
                    <p className="text-gray-400 text-xs mt-0.5">Add formatting and styling to paragraphs</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={addParagraph}
                  className="bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 px-4 py-2 rounded-xl text-sm font-medium flex items-center justify-center gap-2 transition-all hover:shadow-[0_0_15px_rgba(6,182,212,0.2)]"
                >
                  <span className="text-lg leading-none">+</span> Add Paragraph Block
                </button>
              </div>

              <div className="space-y-6">
                {form.heroParagraphs.map((para, index) => (
                  <div key={index} className="bg-[#050508] rounded-xl border border-white/10 overflow-hidden group/block transition-all hover:border-white/20">
                    {/* Block Header */}
                    <div className="flex items-center justify-between bg-white/[0.02] px-4 py-3 border-b border-white/5">
                      <div className="flex items-center gap-2">
                        <span className="flex items-center justify-center w-6 h-6 rounded bg-white/10 text-xs font-bold text-gray-400">{index + 1}</span>
                        <span className="text-gray-400 text-sm font-medium">Text Block</span>
                      </div>
                      {form.heroParagraphs.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeParagraph(index)}
                          className="text-red-400/70 hover:text-red-400 text-sm font-medium transition-colors flex items-center gap-1 opacity-0 group-hover/block:opacity-100"
                        >
                          <TrashIcon className="w-4 h-4" /> Remove
                        </button>
                      )}
                    </div>

                    <div className="p-4 space-y-4">
                      {/* Formatting Toolbar - Sticky */}
                      <div className="sticky top-4 z-10 flex flex-wrap gap-2 p-1.5 bg-[#0a0a16]/90 backdrop-blur-xl rounded-lg border border-white/10 shadow-lg shadow-black/50 w-fit">
                        <div className="flex items-center gap-1 border-r border-white/10 pr-2 mr-1">
                          <button
                            type="button"
                            onClick={() => {
                              const textarea = document.getElementById(`edit-paragraph-${index}`);
                              if (textarea && textarea.selectionStart === textarea.selectionEnd) {
                                showNotification('Highlight text to link first', 'warning');
                              } else {
                                applyFormatting(index, 'link');
                              }
                            }}
                            className={`p-2 hover:bg-white/10 rounded-md transition-all relative group active:scale-95 ${activeButton === 'link' ? 'bg-cyan-500/20 text-cyan-400' : 'text-gray-300'}`}
                            title="Insert Link (Ctrl+K)"
                          >
                            <LinkIcon className="w-4 h-4" />
                          </button>
                        </div>

                        <div className="flex items-center gap-1 border-r border-white/10 pr-2 mr-1">
                          <button
                            type="button"
                            onClick={() => applyFormatting(index, 'italic')}
                            className={`p-2 hover:bg-white/10 rounded-md transition-all relative group active:scale-95 ${activeButton === 'italic' ? 'bg-cyan-500/20 text-cyan-400' : 'text-gray-300'}`}
                          >
                            <ItalicIcon className="w-4 h-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => applyFormatting(index, 'underline')}
                            className={`p-2 hover:bg-white/10 rounded-md transition-all relative group active:scale-95 ${activeButton === 'underline' ? 'bg-cyan-500/20 text-cyan-400' : 'text-gray-300'}`}
                          >
                            <UnderlineIcon className="w-4 h-4" />
                          </button>
                        </div>

                        <button
                          type="button"
                          onClick={() => applyFormatting(index, 'color')}
                          className={`p-2 hover:bg-white/10 rounded-md transition-all relative group active:scale-95 flex items-center gap-2 ${activeButton === 'color' ? 'bg-cyan-500/20 text-cyan-400' : 'text-gray-300'}`}
                        >
                          <span className="w-4 h-4 rounded-full border border-gray-500" style={{ background: 'linear-gradient(45deg, #f87171, #60a5fa, #34d399)' }}></span>
                          <span className="text-xs font-medium pr-1">Color</span>
                        </button>
                      </div>

                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                        {/* Editor side */}
                        <div className="space-y-2">
                          <label className="text-gray-400 text-xs font-bold uppercase tracking-wider">Source HTML</label>
                          <textarea
                            id={`edit-paragraph-${index}`}
                            value={para.text}
                            onChange={(e) => handleParagraphChange(index, 'text', e.target.value)}
                            placeholder="Craft your paragraph here..."
                            rows="6"
                            className="w-full p-4 bg-black/40 border border-white/5 rounded-xl text-gray-300 font-mono text-sm focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500/50 transition-all resize-none shadow-inner leading-relaxed"
                          />
                        </div>

                        {/* Preview side */}
                        <div className="space-y-2 flex flex-col">
                          <label className="text-gray-400 text-xs font-bold uppercase tracking-wider">Live Render</label>
                          <div className="flex-1 p-5 bg-[#0a0a16] border border-white/5 rounded-xl text-white overflow-auto shadow-inner relative flex items-center justify-center">
                            {para.text ? (
                              <div
                                className="w-full"
                                style={{
                                  color: para.color,
                                  fontSize: para.fontSize,
                                  fontWeight: para.fontWeight,
                                  fontStyle: para.fontStyle,
                                  textDecoration: para.textDecoration,
                                  lineHeight: '1.7'
                                }}
                                dangerouslySetInnerHTML={{
                                  __html: para.text
                                    .replace(/<em>(.*?)<\/em>/g, '<em class="italic">$1</em>')
                                    .replace(/<u>(.*?)<\/u>/g, '<u class="underline decoration-cyan-500/50 underline-offset-4">$1</u>')
                                    .replace(/<a href="(.*?)" target="_blank" rel="noopener noreferrer" class="text-cyan-400 hover:text-cyan-300 underline">(.*?)<\/a>/g, '<a href="$1" target="_blank" rel="noopener noreferrer" class="text-cyan-400 hover:text-cyan-300 hover:underline decoration-cyan-400 underline-offset-4 transition-colors font-medium">$2</a>')
                                    .replace(/<span style="color:(.*?)">(.*?)<\/span>/g, '<span style="color:$1">$2</span>')
                                }}
                              />
                            ) : (
                              <p className="text-gray-600 italic text-center text-sm absolute inset-0 flex items-center justify-center">Output will render here</p>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Paragraph Styling Controls */}
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 border-t border-white/5 mt-4">
                        <div className="space-y-1.5">
                          <label className="block text-gray-400 text-xs font-medium uppercase min-w-[max-content]">Base Color</label>
                          <div className="relative flex items-center bg-black/30 rounded-lg p-1 border border-white/5">
                            <input
                              type="color"
                              value={para.color}
                              onChange={(e) => handleParagraphChange(index, 'color', e.target.value)}
                              className="w-8 h-8 rounded cursor-pointer bg-transparent border-0 p-0"
                            />
                            <span className="ml-2 font-mono text-gray-400 text-xs truncate">{para.color}</span>
                          </div>
                        </div>
                        <div className="space-y-1.5">
                          <label className="block text-gray-400 text-xs font-medium uppercase">Size</label>
                          <select
                            value={para.fontSize}
                            onChange={(e) => handleParagraphChange(index, 'fontSize', e.target.value)}
                            className="w-full p-2.5 bg-black/30 border border-white/5 rounded-lg text-gray-300 text-sm focus:outline-none focus:border-cyan-500 cursor-pointer"
                          >
                            <option value="14px">Small (14px)</option>
                            <option value="16px">Normal (16px)</option>
                            <option value="18px">Large (18px)</option>
                            <option value="20px">XL (20px)</option>
                          </select>
                        </div>
                        <div className="space-y-1.5">
                          <label className="block text-gray-400 text-xs font-medium uppercase">Weight</label>
                          <select
                            value={para.fontWeight}
                            onChange={(e) => handleParagraphChange(index, 'fontWeight', e.target.value)}
                            className="w-full p-2.5 bg-black/30 border border-white/5 rounded-lg text-gray-300 text-sm focus:outline-none focus:border-cyan-500 cursor-pointer"
                          >
                            <option value="normal">Normal</option>
                            <option value="bold">Bold</option>
                            <option value="300">Light</option>
                            <option value="500">Medium</option>
                          </select>
                        </div>
                        <div className="space-y-1.5">
                          <label className="block text-gray-400 text-xs font-medium uppercase">Style</label>
                          <select
                            value={para.fontStyle}
                            onChange={(e) => handleParagraphChange(index, 'fontStyle', e.target.value)}
                            className="w-full p-2.5 bg-black/30 border border-white/5 rounded-lg text-gray-300 text-sm focus:outline-none focus:border-cyan-500 cursor-pointer"
                          >
                            <option value="normal">Normal</option>
                            <option value="italic">Italic</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Hero Image Section */}
            <div className="space-y-6 bg-white/5 rounded-2xl p-6 border border-white/5">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-8 h-8 rounded-lg bg-orange-500/20 flex items-center justify-center border border-orange-500/30">
                  <PhotoIcon className="w-4 h-4 text-orange-400" />
                </div>
                <h3 className="text-lg font-bold text-white">Cover Media</h3>
              </div>
              <div className="space-y-6">
                {/* Visual Image Preview */}
                <div className="relative group rounded-xl overflow-hidden border-2 border-dashed border-white/20 bg-black/30 aspect-[21/9] flex items-center justify-center transition-all hover:border-orange-500/50">
                  {form.heroImage ? (
                    <>
                      <img
                        src={form.heroImage}
                        alt={form.heroImageAlt || "Hero visual"}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                        onError={(e) => {
                          e.target.src = 'https://via.placeholder.com/800x400?text=Image+Load+Failed';
                          showNotification('Failed to load external image', 'error');
                        }}
                      />
                      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4 backdrop-blur-sm">
                        <button
                          type="button"
                          onClick={() => setForm({ ...form, heroImage: "" })}
                          className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2 transform translate-y-4 group-hover:translate-y-0 transition-all shadow-lg"
                        >
                          <XMarkIcon className="w-5 h-5" /> Remove Image
                        </button>
                      </div>
                    </>
                  ) : (
                    <div className="text-center p-8">
                      <PhotoIcon className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                      <p className="text-gray-400 font-medium">No cover image uploaded</p>
                      <p className="text-gray-500 text-sm mt-1">Upload a high-quality image or provide a URL below</p>
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Upload Controls */}
                  <div className="space-y-4">
                    <label className="block text-gray-400 text-sm font-medium">Direct Upload</label>
                    <div className="relative">
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
                        className={`w-full bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 px-6 py-4 rounded-xl text-center cursor-pointer flex items-center justify-center gap-3 transition-all font-bold shadow-lg shadow-orange-500/20 ${uploading ? 'opacity-70 cursor-not-allowed scale-[0.98]' : 'hover:scale-[1.02]'
                          }`}
                      >
                        {uploading ? (
                          <>
                            <div className="w-5 h-5 border-3 border-white/30 border-t-white rounded-full animate-spin"></div>
                            <span>Uploading Asset...</span>
                          </>
                        ) : (
                          <>
                            <CloudArrowUpIcon className="w-6 h-6" />
                            <span>{form.heroImage ? 'Replace Image' : 'Select Local File'}</span>
                          </>
                        )}
                      </label>
                    </div>
                    <p className="text-xs text-gray-500">Max size: 5MB. Supported: JPEG, PNG, WEBP, GIF.</p>
                  </div>

                  {/* URL Fallback & Metadata */}
                  <div className="space-y-4">
                    <div>
                      <label className="block text-gray-400 text-sm font-medium mb-2">External URL</label>
                      <div className="relative group">
                        <input
                          type="url"
                          value={form.heroImage}
                          onChange={(e) => setForm({ ...form, heroImage: e.target.value })}
                          placeholder="https://..."
                          className="w-full p-3.5 pl-11 bg-black/30 border border-white/10 rounded-xl text-gray-300 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500/50 transition-all font-mono text-sm"
                        />
                        <LinkIcon className="w-5 h-5 text-gray-500 absolute left-3.5 top-[14px] group-focus-within:text-orange-500 transition-colors" />
                      </div>
                    </div>

                    <div>
                      <label className="block text-gray-400 text-sm font-medium mb-2">Accessibility Alt Text</label>
                      <input
                        type="text"
                        value={form.heroImageAlt}
                        onChange={(e) => setForm({ ...form, heroImageAlt: e.target.value })}
                        placeholder="Briefly describe the image..."
                        className="w-full p-3.5 bg-black/30 border border-white/10 rounded-xl text-gray-300 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500/50 transition-all"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Live Preview Console */}
          <div className="bg-[#050508] rounded-3xl border border-white/5 p-6 md:p-8 relative overflow-hidden group shadow-2xl mt-8">
            {/* Glowing borders */}
            <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent opacity-50"></div>
            <div className="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent opacity-50"></div>

            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gradient-to-br from-cyan-500/20 to-blue-600/20 rounded-lg border border-cyan-500/30">
                  <ComputerDesktopIcon className="w-6 h-6 text-cyan-400" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white tracking-wide">Output Simulator</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                    <span className="text-xs text-green-400 uppercase tracking-widest font-bold font-mono">Real-time Render Sync</span>
                  </div>
                </div>
              </div>
            </div>

            <div className={`bg-[#0a0a16] border border-white/10 rounded-2xl overflow-hidden shadow-2xl min-h-[300px] flex flex-col transition-all duration-700 ${!form.heroHeading.text && !form.heroParagraphs[0]?.text?.trim() && !form.heroImage ? 'border-dashed' : ''}`}>
              {!form.heroHeading.text && !form.heroParagraphs[0]?.text?.trim() && !form.heroImage ? (
                <div className="flex-1 flex flex-col items-center justify-center p-10 text-center opacity-50">
                  <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mb-4 border border-white/10">
                    <PaintBrushIcon className="w-8 h-8 text-gray-500" />
                  </div>
                  <h4 className="text-xl font-semibold text-gray-400 mb-2">Blank Canvas</h4>
                  <p className="text-gray-500 max-w-sm mx-auto">Start entering heading text, paragraphs, or upload an image to see the live preview.</p>
                </div>
              ) : (
                <div className="p-8 md:p-12">
                  {/* Heading Preview */}
                  {form.heroHeading.text && (
                    <div style={{ textAlign: form.heroHeading.alignment }} className="mb-8">
                      {form.heroHeading.type === 'h1' && (
                        <h1 style={{
                          color: form.heroHeading.color,
                          fontSize: form.heroHeading.fontSize,
                          fontWeight: form.heroHeading.fontWeight,
                          lineHeight: '1.2'
                        }} className="font-sans">
                          {form.heroHeading.text}
                        </h1>
                      )}
                      {form.heroHeading.type === 'h2' && (
                        <h2 style={{
                          color: form.heroHeading.color,
                          fontSize: form.heroHeading.fontSize,
                          fontWeight: form.heroHeading.fontWeight,
                          lineHeight: '1.2'
                        }} className="font-sans">
                          {form.heroHeading.text}
                        </h2>
                      )}
                      {form.heroHeading.type === 'h3' && (
                        <h3 style={{
                          color: form.heroHeading.color,
                          fontSize: form.heroHeading.fontSize,
                          fontWeight: form.heroHeading.fontWeight,
                          lineHeight: '1.3'
                        }} className="font-sans">
                          {form.heroHeading.text}
                        </h3>
                      )}
                    </div>
                  )}

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
                    {/* Paragraphs Preview */}
                    <div className="space-y-6">
                      {form.heroParagraphs.map((para, index) => (
                        para.text && (
                          <div
                            key={index}
                            style={{
                              color: para.color,
                              fontSize: para.fontSize,
                              fontWeight: para.fontWeight,
                              fontStyle: para.fontStyle,
                              textDecoration: para.textDecoration,
                              lineHeight: '1.7'
                            }}
                            className="text-gray-300"
                            dangerouslySetInnerHTML={{
                              __html: para.text
                                .replace(/<em>(.*?)<\/em>/g, '<em class="italic">$1</em>')
                                .replace(/<u>(.*?)<\/u>/g, '<u class="underline decoration-cyan-500/50 underline-offset-4">$1</u>')
                                .replace(/<a href="(.*?)" target="_blank" rel="noopener noreferrer" class="text-cyan-400 hover:text-cyan-300 underline">(.*?)<\/a>/g, '<a href="$1" target="_blank" rel="noopener noreferrer" class="text-cyan-400 hover:text-cyan-300 hover:underline decoration-cyan-400 underline-offset-4 transition-colors font-medium">$2</a>')
                                .replace(/<span style="color:(.*?)">(.*?)<\/span>/g, '<span style="color:$1">$2</span>')
                            }}
                          />
                        )
                      ))}

                      {/* Interactive Button Preview */}
                      {form.buttonText && (
                        <div className="pt-4 flex">
                          <div className="px-8 py-3.5 bg-cyan-600 text-white font-bold rounded-full shadow-[0_0_20px_rgba(6,182,212,0.4)] flex items-center justify-center pointer-events-none opacity-90">
                            {form.buttonText}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Image Box Preview */}
                    <div>
                      {form.heroImage ? (
                        <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-white/10 aspect-square sm:aspect-video lg:aspect-square transform transition-transform hover:scale-[1.02] duration-500">
                          <img
                            src={form.heroImage}
                            alt={form.heroImageAlt || 'Hero layout'}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              e.target.src = 'https://via.placeholder.com/800x400?text=Preview+Error';
                            }}
                          />
                          <div className="absolute inset-0 bg-gradient-to-tr from-black/20 to-transparent"></div>
                        </div>
                      ) : (
                        <div className="rounded-2xl border-2 border-dashed border-white/10 aspect-square sm:aspect-video lg:aspect-square flex items-center justify-center bg-white/[0.02]">
                          <PhotoIcon className="w-16 h-16 text-white/10" />
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 pt-6">
            <button
              type="button"
              onClick={() => navigate("/admin/services")}
              className="px-8 py-4 rounded-xl font-bold bg-white/5 hover:bg-white/10 border border-white/10 text-white transition-all duration-300 hover:shadow-lg sm:w-1/3"
            >
              Cancel Edit
            </button>

            <button
              type="submit"
              disabled={submitting || !form.pageTitle.trim() ||
                (slugType === 'simple' && !autoGenerateSlug && !form.slug.trim()) ||
                (slugType === 'nested' && (!form.city || !form.serviceName))}
              className={`flex-1 group relative overflow-hidden rounded-xl p-0.5 transition-all duration-300 hover:scale-[1.02] shadow-[0_0_20px_rgba(6,182,212,0.3)] hover:shadow-[0_0_30px_rgba(6,182,212,0.5)] disabled:opacity-50 disabled:cursor-not-allowed ${activeButton === 'submit' ? 'animate-pulse' : ''
                }`}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 via-blue-500 to-cyan-500 opacity-100 group-hover:from-cyan-400 group-hover:via-blue-400 group-hover:to-cyan-400 transition-colors"></div>
              <div className="relative bg-[#050508] px-8 py-4 rounded-[10px] flex items-center justify-center gap-3 transition-colors group-hover:bg-opacity-0">
                {submitting ? (
                  <>
                    <div className="w-6 h-6 border-3 border-white/30 border-t-white rounded-full animate-spin"></div>
                    <span className="font-bold text-lg text-white">Saving Changes...</span>
                  </>
                ) : (
                  <>
                    <PencilIcon className="w-6 h-6 text-white group-hover:text-white transition-colors" />
                    <span className="font-bold text-lg text-white">Update Service Configuration</span>
                  </>
                )}
              </div>
            </button>
          </div>
        </form >
      </section >

      {/* Styles */}
      < style jsx > {`
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
      `}</style >
    </>
  );
}