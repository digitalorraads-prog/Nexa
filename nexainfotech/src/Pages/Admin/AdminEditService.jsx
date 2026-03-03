// done
import { useEffect, useState } from "react";
import axios from "axios";
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
  UnderlineIcon,
  CloudArrowUpIcon,
  XMarkIcon,
  CheckCircleIcon,
  ExclamationCircleIcon
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
      const res = await axios.get(`http://localhost:5000/api/services/${id}`);
      
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
        'http://localhost:5000/api/services/upload-image',
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
    
    switch(formatType) {
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
        `http://localhost:5000/api/services/update/${id}`,
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
      const res = await axios.delete(`http://localhost:5000/api/services/delete/${id}`);
      
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
                onChange={(e) => setLinkData({...linkData, url: e.target.value})}
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
                    onChange={() => setLinkData({...linkData, useSelectedText: true})}
                    className="text-cyan-400"
                  />
                  <span>Use selected text: "<span className="text-cyan-400">{linkData.text}</span>"</span>
                </label>
                <label className="flex items-center gap-2 text-gray-300 cursor-pointer p-2 hover:bg-white/5 rounded-lg transition">
                  <input
                    type="radio"
                    checked={!linkData.useSelectedText}
                    onChange={() => setLinkData({...linkData, useSelectedText: false})}
                    className="text-cyan-400"
                  />
                  <span>Custom text</span>
                </label>
                {!linkData.useSelectedText && (
                  <input
                    type="text"
                    value={linkData.text}
                    onChange={(e) => setLinkData({...linkData, text: e.target.value})}
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
      <div className="min-h-screen bg-[#0f0f1a] flex items-center justify-center">
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
      
      <section className="bg-[#0f0f1a] min-h-screen text-white pt-20 pb-10 px-5">
        {/* Header with Back Button */}
        <div className="max-w-4xl mx-auto mb-6">
          <button
            onClick={() => navigate("/admin/services")}
            className="flex items-center gap-2 text-gray-400 hover:text-cyan-400 transition mb-4 group"
          >
            <ArrowLeftIcon className="w-5 h-5 group-hover:-translate-x-1 transition" />
            Back to Services
          </button>
          
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-cyan-400 mb-2 flex items-center gap-3">
                <PencilIcon className="w-10 h-10" />
                Edit Service
              </h1>
              <p className="text-gray-400">Update your service information and rich content</p>
            </div>
            
            {/* Delete Button */}
            <button
              onClick={handleDelete}
              disabled={activeButton === 'delete'}
              className={`bg-red-500/10 hover:bg-red-500/20 text-red-400 p-3 rounded-lg transition border border-red-500/20 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed ${activeButton === 'delete' ? 'animate-pulse' : ''}`}
              title="Delete Service"
            >
              <TrashIcon className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Main Form */}
        <form onSubmit={handleSubmit} className="max-w-4xl mx-auto space-y-6">
          {/* Basic Info Card */}
          <div className="bg-[#1a1a2e] rounded-2xl border border-gray-800 p-6 md:p-8 space-y-6">
            
            {/* Page Title */}
            <div>
              <label className="block text-gray-400 mb-2 font-medium">
                Page Title <span className="text-red-500">*</span>
              </label>
              <input
                name="pageTitle"
                value={form.pageTitle}
                onChange={handleChange}
                placeholder="e.g., Digital Marketing Services in New York"
                className="w-full p-3 bg-[#0f0f1a] border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition"
                required
              />
            </div>

            {/* URL Type Toggle */}
            <div className="flex gap-2 p-1 bg-[#0f0f1a] rounded-lg border border-gray-700">
              <button
                type="button"
                onClick={toggleSlugType}
                className={`flex-1 py-2 px-4 rounded-lg transition flex items-center justify-center gap-2 ${
                  slugType === 'simple' 
                    ? 'bg-cyan-600 text-white' 
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                <LinkIcon className="w-4 h-4" />
                Simple URL
              </button>
              <button
                type="button"
                onClick={toggleSlugType}
                className={`flex-1 py-2 px-4 rounded-lg transition flex items-center justify-center gap-2 ${
                  slugType === 'nested' 
                    ? 'bg-cyan-600 text-white' 
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                <BuildingOfficeIcon className="w-4 h-4" />
                Location Based
              </button>
            </div>

            {/* Nested URL Fields */}
            {slugType === 'nested' ? (
              <div className="space-y-4 border-t border-gray-700 pt-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-400 mb-2 font-medium">
                      City <span className="text-red-500">*</span>
                    </label>
                    <input
                      name="city"
                      value={form.city}
                      onChange={handleChange}
                      placeholder="e.g., new-york"
                      className="w-full p-3 bg-[#0f0f1a] border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition"
                      required={slugType === 'nested'}
                    />
                  </div>
                  <div>
                    <label className="block text-gray-400 mb-2 font-medium">
                      Service <span className="text-red-500">*</span>
                    </label>
                    <input
                      name="serviceName"
                      value={form.serviceName}
                      onChange={handleChange}
                      placeholder="e.g., digital-marketing"
                      className="w-full p-3 bg-[#0f0f1a] border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition"
                      required={slugType === 'nested'}
                    />
                  </div>
                </div>
                <p className="text-gray-500 text-sm">
                  URL will be: <span className="text-cyan-400">yoursite.com/{form.city || 'city'}/{form.serviceName || 'service'}</span>
                </p>
              </div>
            ) : (
              /* Simple Slug Field with Toggle */
              <div className="border-t border-gray-700 pt-4">
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-gray-400 font-medium">
                    URL Slug <span className="text-red-500">*</span>
                  </label>
                  <button
                    type="button"
                    onClick={toggleSlugMode}
                    className={`text-sm px-3 py-1 rounded-full transition ${
                      autoGenerateSlug 
                        ? 'bg-cyan-600 text-white' 
                        : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                    }`}
                  >
                    {autoGenerateSlug ? 'Auto' : 'Manual'}
                  </button>
                </div>
                
                <div className="relative">
                  <input
                    name="slug"
                    value={form.slug}
                    onChange={handleChange}
                    disabled={autoGenerateSlug}
                    placeholder={autoGenerateSlug ? "Auto-generated from title" : "Enter custom slug"}
                    className={`w-full p-3 pl-10 ${
                      autoGenerateSlug 
                        ? 'bg-gray-800 text-gray-400 cursor-not-allowed' 
                        : 'bg-[#0f0f1a] text-white'
                    } border border-gray-700 rounded-lg placeholder-gray-500 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition`}
                    required={!autoGenerateSlug && slugType === 'simple'}
                  />
                  <LinkIcon className="w-5 h-5 text-gray-500 absolute left-3 top-3.5" />
                </div>
                
                <div className="flex justify-between mt-1">
                  <p className="text-gray-500 text-sm">
                    {autoGenerateSlug 
                      ? "Slug automatically generated from title" 
                      : "Customize the URL for this service"}
                  </p>
                  {!autoGenerateSlug && (
                    <button
                      type="button"
                      onClick={() => setForm({...form, slug: generateSlug(form.pageTitle)})}
                      className="text-cyan-400 text-sm hover:text-cyan-300 transition"
                    >
                      Generate from title
                    </button>
                  )}
                </div>
              </div>
            )}

            {/* URL Preview */}
            {(form.slug || (form.city && form.serviceName)) && (
              <div className={`bg-gradient-to-r p-4 rounded-lg border ${
                originalData?.slug !== (slugType === 'nested' ? generateNestedSlug() : form.slug)
                  ? 'from-yellow-500/10 to-orange-500/10 border-yellow-500/30' 
                  : 'from-cyan-500/10 to-blue-500/10 border-cyan-500/30'
              }`}>
                <div className="flex items-center gap-2 text-gray-400 text-sm mb-2">
                  <GlobeAltIcon className="w-4 h-4" />
                  <span>Live URL Preview:</span>
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                  <code className="text-gray-500 text-sm">yoursite.com/</code>
                  <code className="text-cyan-400 font-mono text-sm font-bold bg-[#0f0f1a] px-2 py-1 rounded break-all">
                    {slugType === 'nested' 
                      ? (form.city && form.serviceName ? `${form.city}/${form.serviceName}` : form.slug)
                      : form.slug}
                  </code>
                </div>
                
                {originalData?.slug !== (slugType === 'nested' ? generateNestedSlug() : form.slug) && (
                  <div className="flex items-center gap-2 mt-2 text-yellow-500 text-xs bg-yellow-500/10 p-2 rounded">
                    <ExclamationTriangleIcon className="w-4 h-4 flex-shrink-0" />
                    <div>
                      <p>URL will change from: <code className="font-mono">yoursite.com/{originalData?.slug}</code></p>
                      <p className="text-gray-400 mt-1">This may affect existing links to this service.</p>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Mini Description */}
            <div>
              <label className="block text-gray-400 mb-2 font-medium">
                Mini Description
              </label>
              <textarea
                name="miniDescription"
                value={form.miniDescription}
                onChange={handleChange}
                placeholder="Brief description about this service (max 200 characters)"
                rows="4"
                maxLength="200"
                className="w-full p-3 bg-[#0f0f1a] border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition resize-none"
              />
              <div className="flex justify-end mt-1">
                <span className={`text-sm ${
                  form.miniDescription.length >= 180 
                    ? 'text-yellow-500' 
                    : form.miniDescription.length >= 150 
                      ? 'text-orange-500' 
                      : 'text-gray-500'
                }`}>
                  {form.miniDescription.length}/200 characters
                </span>
              </div>
            </div>

            {/* Button Text */}
            <div>
              <label className="block text-gray-400 mb-2 font-medium">
                Button Text
              </label>
              <input
                name="buttonText"
                value={form.buttonText}
                onChange={handleChange}
                placeholder="e.g., Learn More, Get Started, Contact Us"
                className="w-full p-3 bg-[#0f0f1a] border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition"
              />
            </div>
          </div>

          {/* Rich Text Editor Card */}
          <div className="bg-[#1a1a2e] rounded-2xl border border-gray-800 p-6 md:p-8 space-y-8">
            <h2 className="text-2xl font-bold text-cyan-400 mb-6 flex items-center gap-3 border-b border-gray-700 pb-4">
              <PaintBrushIcon className="w-6 h-6" />
              Rich Content
            </h2>

            {/* Heading Section */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white">Main Heading</h3>
              
              <div>
                <label className="block text-gray-400 mb-2 text-sm">Heading Text</label>
                <input
                  type="text"
                  value={form.heroHeading.text}
                  onChange={(e) => handleHeadingChange('text', e.target.value)}
                  placeholder="Enter main heading..."
                  className="w-full p-3 bg-[#0f0f1a] border border-gray-700 rounded-lg text-white"
                />
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <label className="block text-gray-400 mb-2 text-sm">Type</label>
                  <select
                    value={form.heroHeading.type}
                    onChange={(e) => handleHeadingChange('type', e.target.value)}
                    className="w-full p-2 bg-[#0f0f1a] border border-gray-700 rounded-lg text-white"
                  >
                    <option value="h1">Heading 1</option>
                    <option value="h2">Heading 2</option>
                    <option value="h3">Heading 3</option>
                    <option value="h4">Heading 4</option>
                  </select>
                </div>

                <div>
                  <label className="block text-gray-400 mb-2 text-sm">Color</label>
                  <input
                    type="color"
                    value={form.heroHeading.color}
                    onChange={(e) => handleHeadingChange('color', e.target.value)}
                    className="w-full h-10 bg-[#0f0f1a] border border-gray-700 rounded-lg"
                  />
                </div>

                <div>
                  <label className="block text-gray-400 mb-2 text-sm">Font Size</label>
                  <select
                    value={form.heroHeading.fontSize}
                    onChange={(e) => handleHeadingChange('fontSize', e.target.value)}
                    className="w-full p-2 bg-[#0f0f1a] border border-gray-700 rounded-lg text-white"
                  >
                    <option value="32px">Small (32px)</option>
                    <option value="40px">Medium (40px)</option>
                    <option value="48px">Large (48px)</option>
                    <option value="56px">Extra Large (56px)</option>
                    <option value="64px">Huge (64px)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-gray-400 mb-2 text-sm">Alignment</label>
                  <select
                    value={form.heroHeading.alignment}
                    onChange={(e) => handleHeadingChange('alignment', e.target.value)}
                    className="w-full p-2 bg-[#0f0f1a] border border-gray-700 rounded-lg text-white"
                  >
                    <option value="left">Left</option>
                    <option value="center">Center</option>
                    <option value="right">Right</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Paragraphs Section */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-white">Paragraphs</h3>
                <button
                  type="button"
                  onClick={addParagraph}
                  className="bg-cyan-600 hover:bg-cyan-700 px-4 py-2 rounded-lg text-sm flex items-center gap-2 transition hover:scale-105"
                >
                  <span>+</span> Add Paragraph
                </button>
              </div>

              {form.heroParagraphs.map((para, index) => (
                <div key={index} className="bg-[#0f0f1a] p-4 rounded-lg border border-gray-700 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-cyan-400 text-sm">Paragraph {index + 1}</span>
                    {form.heroParagraphs.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeParagraph(index)}
                        className="text-red-400 hover:text-red-300 text-sm transition hover:scale-110"
                      >
                        Remove
                      </button>
                    )}
                  </div>

                  {/* Formatting Toolbar */}
                  <div className="flex gap-2 p-2 bg-[#1a1a2e] rounded-lg border border-gray-700">
                    <button
                      type="button"
                      onClick={() => {
                        const textarea = document.getElementById(`edit-paragraph-${index}`);
                        if (textarea && textarea.selectionStart === textarea.selectionEnd) {
                          showNotification('Select some text first', 'warning');
                        } else {
                          applyFormatting(index, 'link');
                        }
                      }}
                      className={`p-2 hover:bg-gray-700 rounded transition relative group active:scale-95 ${
                        activeButton === 'link' ? 'bg-cyan-600 scale-95' : ''
                      }`}
                      title="Insert Link"
                    >
                      <LinkIcon className="w-4 h-4" />
                      <span className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition whitespace-nowrap pointer-events-none border border-gray-700">
                        Add Link (Ctrl+K)
                      </span>
                    </button>
                    
                    <button
                      type="button"
                      onClick={() => applyFormatting(index, 'italic')}
                      className={`p-2 hover:bg-gray-700 rounded transition relative group active:scale-95 ${
                        activeButton === 'italic' ? 'bg-cyan-600 scale-95' : ''
                      }`}
                      title="Italic"
                    >
                      <ItalicIcon className="w-4 h-4" />
                      <span className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition whitespace-nowrap pointer-events-none border border-gray-700">
                        Italic (Ctrl+I)
                      </span>
                    </button>
                    
                    <button
                      type="button"
                      onClick={() => applyFormatting(index, 'underline')}
                      className={`p-2 hover:bg-gray-700 rounded transition relative group active:scale-95 ${
                        activeButton === 'underline' ? 'bg-cyan-600 scale-95' : ''
                      }`}
                      title="Underline"
                    >
                      <UnderlineIcon className="w-4 h-4" />
                      <span className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition whitespace-nowrap pointer-events-none border border-gray-700">
                        Underline (Ctrl+U)
                      </span>
                    </button>
                    
                    <button
                      type="button"
                      onClick={() => applyFormatting(index, 'color')}
                      className={`p-2 hover:bg-gray-700 rounded transition relative group active:scale-95 ${
                        activeButton === 'color' ? 'bg-cyan-600 scale-95' : ''
                      }`}
                      title="Text Color"
                    >
                      <PaintBrushIcon className="w-4 h-4" />
                      <span className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition whitespace-nowrap pointer-events-none border border-gray-700">
                        Text Color
                      </span>
                    </button>
                  </div>

                  {/* Editable textarea for HTML */}
                  <textarea
                    id={`edit-paragraph-${index}`}
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
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white">Hero Image</h3>
              
              {/* Image Upload Section */}
              <div className="space-y-4">
                {/* Current Image Preview */}
                {form.heroImage && (
                  <div className="relative group">
                    <img
                      src={form.heroImage}
                      alt={form.heroImageAlt || "Hero image"}
                      className="w-full h-48 object-cover rounded-lg border border-gray-700"
                      onError={(e) => {
                        e.target.src = 'https://via.placeholder.com/800x400?text=Invalid+Image+URL';
                        showNotification('Failed to load image', 'error');
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => setForm({...form, heroImage: ""})}
                      className="absolute top-2 right-2 bg-red-500/80 hover:bg-red-600 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition"
                      title="Remove image"
                    >
                      <XMarkIcon className="w-4 h-4" />
                    </button>
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
                    className={`flex-1 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 px-4 py-3 rounded-lg text-center cursor-pointer flex items-center justify-center gap-2 transition hover:scale-105 ${
                      uploading ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
                  >
                    {uploading ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        Uploading...
                      </>
                    ) : (
                      <>
                        <CloudArrowUpIcon className="w-5 h-5" />
                        {form.heroImage ? 'Change Image' : 'Upload Image'}
                      </>
                    )}
                  </label>
                  {uploading && (
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center rounded-lg">
                      <div className="w-6 h-6 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin"></div>
                    </div>
                  )}
                </div>

                {/* Image URL Input (fallback) */}
                <div className="relative">
                  <input
                    type="url"
                    value={form.heroImage}
                    onChange={(e) => setForm({...form, heroImage: e.target.value})}
                    placeholder="Or enter image URL directly..."
                    className="w-full p-3 pl-10 bg-[#0f0f1a] border border-gray-700 rounded-lg text-white"
                  />
                  <PhotoIcon className="w-5 h-5 text-gray-500 absolute left-3 top-3.5" />
                </div>

                {/* Alt Text */}
                <div>
                  <input
                    type="text"
                    value={form.heroImageAlt}
                    onChange={(e) => setForm({...form, heroImageAlt: e.target.value})}
                    placeholder="Image alt text (for SEO)"
                    className="w-full p-3 bg-[#0f0f1a] border border-gray-700 rounded-lg text-white"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Live Preview */}
          <div className="bg-[#1a1a2e] rounded-2xl border border-gray-800 p-6">
            <h3 className="text-cyan-400 font-semibold mb-4 flex items-center gap-2">
              <PhotoIcon className="w-5 h-5" />
              Live Preview
            </h3>
            
            <div className="bg-gradient-to-br from-[#0f0f1a] to-[#1a1a2e] p-6 rounded-lg border border-gray-700">
              {/* Heading Preview */}
              {form.heroHeading.text && (
                <div style={{ textAlign: form.heroHeading.alignment }}>
                  {form.heroHeading.type === 'h1' && (
                    <h1 style={{ 
                      color: form.heroHeading.color,
                      fontSize: form.heroHeading.fontSize,
                      fontWeight: form.heroHeading.fontWeight,
                      marginBottom: '1rem'
                    }}>
                      {form.heroHeading.text}
                    </h1>
                  )}
                  {form.heroHeading.type === 'h2' && (
                    <h2 style={{ 
                      color: form.heroHeading.color,
                      fontSize: form.heroHeading.fontSize,
                      fontWeight: form.heroHeading.fontWeight,
                      marginBottom: '1rem'
                    }}>
                      {form.heroHeading.text}
                    </h2>
                  )}
                  {form.heroHeading.type === 'h3' && (
                    <h3 style={{ 
                      color: form.heroHeading.color,
                      fontSize: form.heroHeading.fontSize,
                      fontWeight: form.heroHeading.fontWeight,
                      marginBottom: '1rem'
                    }}>
                      {form.heroHeading.text}
                    </h3>
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
                    lineHeight: '1.6'
                  }}
                  dangerouslySetInnerHTML={{ 
                    __html: para.text
                      .replace(/<em>(.*?)<\/em>/g, '<em>$1</em>')
                      .replace(/<u>(.*?)<\/u>/g, '<u>$1</u>')
                      .replace(/<a href="(.*?)" target="_blank" rel="noopener noreferrer" class="text-cyan-400 hover:text-cyan-300 underline">(.*?)<\/a>/g, '<a href="$1" target="_blank" rel="noopener noreferrer" class="text-cyan-400 hover:text-cyan-300 underline">$2</a>')
                      .replace(/<span style="color:(.*?)">(.*?)<\/span>/g, '<span style="color:$1">$2</span>')
                  }}
                />
              ))}

              {/* Image Preview */}
              {form.heroImage && (
                <img
                  src={form.heroImage}
                  alt={form.heroImageAlt || 'Hero image'}
                  className="mt-4 max-w-full h-auto rounded-lg border border-gray-700"
                  onError={(e) => {
                    e.target.src = 'https://via.placeholder.com/800x400?text=Invalid+Image+URL';
                  }}
                />
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4">
            <button
              type="button"
              onClick={() => navigate("/admin/services")}
              className="flex-1 bg-gray-700 hover:bg-gray-600 p-4 rounded-xl font-bold text-lg transition hover:scale-[1.02]"
            >
              Cancel
            </button>
            
            <button
              type="submit"
              disabled={submitting || !form.pageTitle.trim() || 
                (slugType === 'simple' && !autoGenerateSlug && !form.slug.trim()) || 
                (slugType === 'nested' && (!form.city || !form.serviceName))}
              className={`flex-1 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 p-4 rounded-xl font-bold text-lg transition disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-cyan-500/20 hover:scale-[1.02] ${
                activeButton === 'submit' ? 'animate-pulse' : ''
              }`}
            >
              {submitting ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Updating...
                </span>
              ) : (
                "Update Service"
              )}
            </button>
          </div>
        </form>
      </section>

      {/* Styles */}
      <style jsx>{`
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