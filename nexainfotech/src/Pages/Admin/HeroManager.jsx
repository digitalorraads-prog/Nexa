import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../../Protected/axios";
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
  CloudArrowUpIcon,
  ListBulletIcon,
  TagIcon,
  AcademicCapIcon,
  BriefcaseIcon,
  ClockIcon,
  DocumentTextIcon,
  AdjustmentsHorizontalIcon,
  SwatchIcon,
  ArrowsPointingOutIcon
} from '@heroicons/react/24/outline';

// Font size options
const FONT_SIZE_OPTIONS = {
  title: {
    small: 'text-2xl sm:text-3xl lg:text-4xl',
    medium: 'text-3xl sm:text-4xl lg:text-5xl xl:text-6xl',
    large: 'text-4xl sm:text-5xl lg:text-6xl xl:text-7xl',
    custom: 'text-5xl sm:text-6xl lg:text-7xl xl:text-8xl'
  },
  subtitle: {
    small: 'text-xs sm:text-sm',
    medium: 'text-sm sm:text-base',
    large: 'text-base sm:text-lg',
    custom: 'text-lg sm:text-xl'
  },
  description: {
    small: 'text-sm sm:text-base',
    medium: 'text-base sm:text-lg',
    large: 'text-lg sm:text-xl',
    custom: 'text-xl sm:text-2xl'
  },
  badge: {
    small: 'text-xs px-2 py-1',
    medium: 'text-sm px-3 py-1.5',
    large: 'text-base px-4 py-2',
    custom: 'text-lg px-5 py-2.5'
  }
};

// Color scheme presets - ab sirf text colors ke liye
const COLOR_PRESETS = {
  dark: {
    name: 'Dark Theme',
    title: 'text-white',
    subtitle: 'text-cyan-400',
    description: 'text-gray-300',
  },
  light: {
    name: 'Light Theme',
    title: 'text-gray-900',
    subtitle: 'text-blue-600',
    description: 'text-gray-700',
  },
  colorful: {
    name: 'Colorful Theme',
    title: 'text-transparent bg-clip-text bg-linear-to-r from-purple-600 via-pink-500 to-red-500',
    subtitle: 'text-pink-500',
    description: 'text-gray-800',
  },
  nature: {
    name: 'Nature Theme',
    title: 'text-emerald-900',
    subtitle: 'text-green-600',
    description: 'text-gray-700',
  }
};

// Badge style options
const BADGE_STYLES = [
  { name: 'Cyan Blue', value: 'bg-linear-to-r from-cyan-500 to-blue-600 text-white' },
  { name: 'Purple Pink', value: 'bg-linear-to-r from-purple-500 to-pink-500 text-white' },
  { name: 'Green', value: 'bg-linear-to-r from-green-500 to-emerald-500 text-white' },
  { name: 'Yellow Orange', value: 'bg-linear-to-r from-yellow-500 to-orange-500 text-white' },
  { name: 'Red Pink', value: 'bg-linear-to-r from-red-500 to-pink-500 text-white' },
  { name: 'Solid Blue', value: 'bg-blue-500 text-white' },
  { name: 'Solid Green', value: 'bg-green-500 text-white' },
  { name: 'Solid Purple', value: 'bg-purple-500 text-white' },
  { name: 'Solid Red', value: 'bg-red-500 text-white' },
  { name: 'Solid Cyan', value: 'bg-cyan-500 text-white' },
];

// Individual color picker options
const TEXT_COLORS = [
  { name: 'White', value: 'text-white' },
  { name: 'Black', value: 'text-black' },
  { name: 'Gray', value: 'text-gray-300' },
  { name: 'Cyan', value: 'text-cyan-400' },
  { name: 'Blue', value: 'text-blue-400' },
  { name: 'Purple', value: 'text-purple-400' },
  { name: 'Pink', value: 'text-pink-400' },
  { name: 'Green', value: 'text-green-400' },
  { name: 'Yellow', value: 'text-yellow-400' },
  { name: 'Red', value: 'text-red-400' },
  { name: 'Orange', value: 'text-orange-400' },
  { name: 'Gradient 1', value: 'text-transparent bg-clip-text bg-linear-to-r from-cyan-400 to-blue-500' },
  { name: 'Gradient 2', value: 'text-transparent bg-clip-text bg-linear-to-r from-purple-400 to-pink-500' },
  { name: 'Gradient 3', value: 'text-transparent bg-clip-text bg-linear-to-r from-green-400 to-blue-500' },
];

function HeroManager() {
  const navigate = useNavigate();
  const [heroes, setHeroes] = useState([]);
  const [groupedHeroes, setGroupedHeroes] = useState({});
  const [availablePages, setAvailablePages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedHero, setSelectedHero] = useState(null);
  const [message, setMessage] = useState("");
  const [uploading, setUploading] = useState(false);
  const [expandedPage, setExpandedPage] = useState('home');
  const [showFormattingHelp, setShowFormattingHelp] = useState(false);
  const [showAddPageModal, setShowAddPageModal] = useState(false);
  const [newPageName, setNewPageName] = useState("");
  const [newPageIdUrl, setNewPageIdUrl] = useState("");
  const [editingPageObjId, setEditingPageObjId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("content"); // New tab state for editor

  // Hero duplication states
  const [showHeroDuplicateModal, setShowHeroDuplicateModal] = useState(false);
  const [heroToDuplicate, setHeroToDuplicate] = useState(null);
  const [isDuplicatingHero, setIsDuplicatingHero] = useState(false);
  const [duplicateHeroForm, setDuplicateHeroForm] = useState({
    heroName: "",
    title: "",
    pageId: ""
  });

  // Hero import states
  const [showImportHeroModal, setShowImportHeroModal] = useState(false);
  const [searchImportQuery, setSearchImportQuery] = useState("");
  const [isImportingHero, setIsImportingHero] = useState(false);
  const [importTargetPageId, setImportTargetPageId] = useState("");

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
    isActive: true,
    // New formatting options
    showAsBadges: true,
    fontSize: {
      title: 'large',
      subtitle: 'medium',
      description: 'medium',
      badge: 'medium'
    },
    colorScheme: 'dark',
    customColors: {
      title: 'text-white',
      subtitle: 'text-cyan-400',
      description: 'text-gray-300',
      titleHex: '#ffffff',
      subtitleHex: '#22d3ee',
      descriptionHex: '#d1d5db',
    },
    badgeStyle: 'bg-linear-to-r from-cyan-500 to-blue-600 text-white',
    useCustomColors: false,
    useHexColors: {
      title: false,
      subtitle: false,
      description: false
    }
  });

  useEffect(() => {
    fetchHeroes();
    fetchPages();
  }, []);

  const fetchHeroes = async () => {
    setLoading(true);
    try {
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
      // Changed to fetch all admin pages so user can fully manage pages here
      const response = await axios.get("/api/pages/admin/all");
      if (response.data.success) {
        setAvailablePages(response.data.data);
      }
    } catch (err) {
      console.error('Fetch pages error:', err);
    }
  };

  const handleOpenEditPage = (page, e) => {
    e.stopPropagation();
    setEditingPageObjId(page._id);
    setNewPageName(page.pageName);
    setNewPageIdUrl(page.pageId);
    setShowAddPageModal(true);
  };

  const handleCreatePage = async (e) => {
    e.preventDefault();
    if (!newPageName.trim()) return;

    // Auto-generate ID if user leaves it blank
    const finalPageId = newPageIdUrl.trim()
      ? newPageIdUrl.toLowerCase().replace(/\s+/g, '-')
      : newPageName.toLowerCase().replace(/\s+/g, '-');

    try {
      setLoading(true);

      if (editingPageObjId) {
        // Edit existing page
        const response = await axios.put(`/api/pages/admin/${editingPageObjId}`, {
          pageName: newPageName,
          pageId: finalPageId,
        });

        if (response.data.success) {
          setMessage(`✅ Page "${newPageName}" updated!`);
          setNewPageName("");
          setNewPageIdUrl("");
          setEditingPageObjId(null);
          setShowAddPageModal(false);
          // Force immediate refresh
          const pagesRes = await axios.get("/api/pages/admin/all");
          if (pagesRes.data.success) setAvailablePages(pagesRes.data.data);
          fetchHeroes();
        }
      } else {
        // Create new page
        const response = await axios.post("/api/pages/admin/create", {
          pageName: newPageName,
          pageId: finalPageId,
          description: `Custom page for ${newPageName}`,
          icon: "DocumentTextIcon",
          isActive: true
        });

        if (response.data.success) {
          setMessage(`✅ Page "${newPageName}" created!`);
          setNewPageName("");
          setNewPageIdUrl("");
          setShowAddPageModal(false);
          fetchPages();
          setExpandedPage(finalPageId);
        }
      }
    } catch (err) {
      setMessage(err.response?.data?.message || "❌ Failed to save page");
    } finally {
      setLoading(false);
    }
  };

  const handleDeletePage = async (id, name, e) => {
    e.stopPropagation();
    if (!window.confirm(`Are you sure you want to delete the entire page "${name}" and all its heroes?`)) return;
    try {
      setLoading(true);
      const response = await axios.delete(`/api/pages/admin/${id}`);
      if (response.data.success) {
        setMessage(`✅ Page "${name}" deleted!`);
        fetchPages();
        fetchHeroes();
      }
    } catch (err) {
      setMessage(err.response?.data?.message || "❌ Failed to delete page");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateHero = async (pageId, pageName) => {
    try {
      setLoading(true);
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
    if (!hero) {
      setSelectedHero(null);
      return;
    }
    setSelectedHero(hero);
    setFormData({
      pageId: hero.pageId,
      pageName: hero.pageName,
      heroName: hero.heroName || "",
      title: hero.title || "",
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
      isActive: hero.isActive !== undefined ? hero.isActive : true,
      highlightKeywords: hero.highlightKeywords !== undefined ? hero.highlightKeywords : true,
      showAsBadges: hero.showAsBadges !== undefined ? hero.showAsBadges : true,
      fontSize: hero.fontSize || {
        title: 'large',
        subtitle: 'medium',
        description: 'medium',
        badge: 'medium'
      },
      colorScheme: hero.colorScheme || 'dark',
      customColors: hero.customColors || {
        title: 'text-white',
        subtitle: 'text-cyan-400',
        description: 'text-gray-300',
        titleHex: '#ffffff',
        subtitleHex: '#22d3ee',
        descriptionHex: '#d1d5db',
      },
      badgeStyle: hero.badgeStyle || 'bg-linear-to-r from-cyan-500 to-blue-600 text-white',
      useCustomColors: hero.useCustomColors || false,
      useHexColors: hero.useHexColors || {
        title: false,
        subtitle: false,
        description: false
      }
    });
    setMessage("");

    // Auto scroll to card for better UX
    setTimeout(() => {
      const editSection = document.getElementById(`hero-card-${hero._id}`);
      if (editSection) {
        editSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
      setActiveTab("content"); // Reset tab when switching heroes
    }, 100);
  };

  const handleUpdateHero = async (e) => {
    e.preventDefault();

    if (!selectedHero) return;

    try {
      setLoading(true);
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

  const handleDuplicateHeroClick = (hero) => {
    setHeroToDuplicate(hero);
    setDuplicateHeroForm({
      heroName: `${hero.heroName} (Copy)`,
      title: `${hero.title} (Copy)`,
      pageId: hero.pageId // Default to same page
    });
    setShowHeroDuplicateModal(true);
  };

  const handleDuplicateHeroSubmit = async (e) => {
    e.preventDefault();
    if (!heroToDuplicate) return;

    setIsDuplicatingHero(true);
    try {
      // 1. Call the backend duplicate endpoint to get a base copy
      const res = await axios.post(`/api/heroes/admin/${heroToDuplicate._id}/duplicate`);

      if (res.data.success) {
        const newHero = res.data.data;

        // 2. Update the new hero with values from modal (name, title, page)
        // Also ensure it's set to inactive by default as per duplication logic
        await axios.put(`/api/heroes/admin/${newHero._id}`, {
          heroName: duplicateHeroForm.heroName,
          title: duplicateHeroForm.title,
          pageId: duplicateHeroForm.pageId,
          isActive: false
        });

        setShowHeroDuplicateModal(false);
        fetchHeroes(); // Refresh list
        setMessage("✅ Hero duplicated successfully!");

        // If page changed, expand the target page
        if (duplicateHeroForm.pageId !== heroToDuplicate.pageId) {
          setExpandedPage(duplicateHeroForm.pageId);
        }
      }
    } catch (err) {
      console.error(err);
      setMessage("❌ Duplication failed: " + (err.response?.data?.message || err.message));
    } finally {
      setIsDuplicatingHero(false);
    }
  };

  const handleImportHero = async (sourceHero) => {
    if (!importTargetPageId) return;

    setIsImportingHero(true);
    try {
      // 1. Duplicate the source hero
      const res = await axios.post(`/api/heroes/admin/${sourceHero._id}/duplicate`);

      if (res.data.success) {
        const newHero = res.data.data;

        // 2. Move it to the target page and give it a copy name
        await axios.put(`/api/heroes/admin/${newHero._id}`, {
          heroName: `${sourceHero.heroName} (Imported)`,
          pageId: importTargetPageId,
          isActive: false
        });

        setShowImportHeroModal(false);
        setSearchImportQuery("");
        fetchHeroes();
        setMessage(`✅ Hero "${sourceHero.heroName}" imported to current page!`);
        setExpandedPage(importTargetPageId);
      }
    } catch (err) {
      console.error(err);
      setMessage("❌ Import failed: " + (err.response?.data?.message || err.message));
    } finally {
      setIsImportingHero(false);
    }
  };

  const handleDeleteImage = async (imageId) => {
    if (!selectedHero || !window.confirm("Delete this image?")) return;

    try {
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
    setFormData({ ...formData, backgroundVideo: e.target.value });
  };

  // Quick insert formatting templates
  const insertTemplate = (template) => {
    let text = formData.description || '';

    switch (template) {
      case 'duration':
        text += (text ? '\n' : '') + 'Duration: 4 Months';
        break;
      case 'internship':
        text += (text ? '\n' : '') + 'Internship Available';
        break;
      case 'placement':
        text += (text ? '\n' : '') + '100% Job Placement Assistance';
        break;
      case 'features':
        text += (text ? '\n' : '') + '• Live Projects\n• Expert Trainers\n• Flexible Timings\n• Certification';
        break;
      case 'paragraph':
        text += (text ? '\n' : '') + 'Write your detailed paragraph here...';
        break;
      default:
        break;
    }

    setFormData({ ...formData, description: text });
  };

  // Preview of formatted description
  const renderDescriptionPreview = () => {
    if (!formData.description) return null;

    const lines = formData.description.split('\n').filter(line => line.trim() !== '');

    // Determine style/color for descriptions
    const descStyle = formData.useHexColors?.description
      ? { color: formData.customColors?.descriptionHex }
      : {};
    const descClass = !formData.useHexColors?.description
      ? (formData.customColors?.description || 'text-gray-300')
      : '';

    return (
      <div className={`space-y-1 text-sm ${descClass}`} style={descStyle}>
        {lines.map((line, index) => {
          if (line.includes(':')) {
            const [label, value] = line.split(':').map(part => part.trim());
            return (
              <div key={index} className="flex items-center gap-2">
                <span className="text-cyan-400 font-semibold">{label}:</span>
                <span>{value}</span>
              </div>
            );
          }
          else if (line.toLowerCase().includes('internship') ||
            line.toLowerCase().includes('placement') ||
            line.toLowerCase().includes('job')) {
            const badgeColor = line.toLowerCase().includes('internship')
              ? 'bg-green-500/20 text-green-400'
              : line.toLowerCase().includes('placement') || line.toLowerCase().includes('job')
                ? 'bg-blue-500/20 text-blue-400'
                : 'bg-purple-500/20 text-purple-400';

            return (
              <div key={index}>
                <span className={`${badgeColor} px-2 py-0.5 rounded-full text-xs inline-block`}>
                  {line}
                </span>
              </div>
            );
          }
          else if (line.startsWith('•') || line.startsWith('-')) {
            return (
              <div key={index} className="flex items-start gap-2">
                <span className="text-cyan-400">•</span>
                <span>{line.substring(1).trim()}</span>
              </div>
            );
          }
          else {
            return <p key={index}>{line}</p>;
          }
        })}
      </div>
    );
  };

  // Filter logic
  const getFilteredHeroes = (pageId) => {
    // Grouping heroes by pageId from the total heroes list for reactivity
    const pageHeroes = (heroes || []).filter(h => h.pageId === pageId);

    let result = pageHeroes.filter(hero => {
      // Internal Search for hero content
      return !searchTerm ||
        (hero.heroName || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
        (hero.title || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
        (hero.description || "").toLowerCase().includes(searchTerm.toLowerCase());
    });

    // Default Sorting - newest default
    return result.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
  };

  const filteredPages = availablePages
    .filter(page => {
      if (!searchTerm) return true;

      // Focus strictly on results during search
      const pageNameMatches = page.pageName.toLowerCase().includes(searchTerm.toLowerCase());
      const hasMatchingHero = (heroes || []).some(h =>
        h.pageId === page.pageId && (
          (h.heroName || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
          (h.title || "").toLowerCase().includes(searchTerm.toLowerCase())
        )
      );

      return pageNameMatches || hasMatchingHero;
    })
    .sort((a, b) => {
      // If searching, keep perfect matches on top, else date-wise
      if (searchTerm) {
        const aExact = a.pageName.toLowerCase() === searchTerm.toLowerCase();
        const bExact = b.pageName.toLowerCase() === searchTerm.toLowerCase();
        if (aExact && !bExact) return -1;
        if (!aExact && bExact) return 1;
      }
      return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
    });

  const clearFilters = () => {
    setSearchTerm("");
  };

  const stats = {
    totalHeroes: heroes.length,
    activeHeroes: heroes.filter(h => h.isActive).length,
    totalPages: availablePages.length
  };

  if (loading && heroes.length === 0) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white">Loading Heroes...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-transparent text-white">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 bg-[#1a1a2e]/50 p-8 rounded-3xl border border-gray-800 backdrop-blur-md">
          <div className="flex-1">
            <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-linear-to-r from-cyan-400 to-blue-500 mb-2">
              Hero Dashboard
            </h1>
            <p className="text-gray-400 max-w-md">
              A premium space to manage your website's first impression. Search, edit, and organize with ease.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
            <div className="relative group flex-1 md:flex-none">
              <input
                type="text"
                placeholder="Search..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full md:w-48 pl-10 pr-4 py-2.5 bg-[#0f0f1a] border border-gray-700 rounded-xl text-sm focus:outline-none focus:border-cyan-500 transition-all group-hover:border-gray-600"
              />
              <EyeIcon className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-cyan-400 transition-colors" />
            </div>

            {searchTerm && (
              <button
                onClick={clearFilters}
                className="text-xs text-gray-500 hover:text-cyan-400 font-medium transition-colors"
              >
                Clear Search
              </button>
            )}

            <button
              onClick={fetchHeroes}
              className="bg-gray-800 hover:bg-gray-700 p-2.5 rounded-xl transition-all duration-300 flex items-center gap-2 group border border-gray-700 shadow-xl"
            >
              <ArrowPathIcon className={`w-5 h-5 text-cyan-400 ${loading ? 'animate-spin' : 'group-hover:rotate-180 transition-transform'}`} />
            </button>
          </div>
        </div>

        {/* Dashboard Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <div className="bg-[#1a1a2e] p-6 rounded-3xl border border-gray-800 shadow-2xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-125 transition-transform duration-500">
              <EyeIcon className="w-20 h-20 text-cyan-500" />
            </div>
            <p className="text-gray-500 text-sm font-bold uppercase tracking-widest mb-1">Total Pages</p>
            <h3 className="text-4xl font-black text-white">{stats.totalPages}</h3>
            <div className="mt-4 h-1 w-full bg-gray-800 rounded-full overflow-hidden">
              <div className="h-full bg-cyan-500 transition-all duration-1000" style={{ width: '70%' }}></div>
            </div>
          </div>

          <div className="bg-[#1a1a2e] p-6 rounded-3xl border border-gray-800 shadow-2xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-125 transition-transform duration-500">
              <CheckCircleIcon className="w-20 h-20 text-green-500" />
            </div>
            <p className="text-gray-500 text-sm font-bold uppercase tracking-widest mb-1">Active Heroes</p>
            <h3 className="text-4xl font-black text-green-400">{stats.activeHeroes} <span className="text-lg text-gray-600 font-normal">/ {stats.totalHeroes}</span></h3>
            <div className="mt-4 h-1 w-full bg-gray-800 rounded-full overflow-hidden">
              <div className="h-full bg-green-500 transition-all duration-1000" style={{ width: `${(stats.activeHeroes / stats.totalHeroes) * 100}%` }}></div>
            </div>
          </div>

          <div className="bg-[#1a1a2e] p-6 rounded-3xl border border-gray-800 shadow-2xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-125 transition-transform duration-500">
              <PhotoIcon className="w-20 h-20 text-purple-500" />
            </div>
            <p className="text-gray-500 text-sm font-bold uppercase tracking-widest mb-1">Images Managed</p>
            <h3 className="text-4xl font-black text-purple-400">{heroes.reduce((acc, h) => acc + (h.images?.length || 0), 0)}</h3>
            <div className="mt-4 h-1 w-full bg-gray-800 rounded-full overflow-hidden">
              <div className="h-full bg-purple-500 transition-all duration-1000" style={{ width: '85%' }}></div>
            </div>
          </div>
        </div>

        {message && (
          <div className={`mb-6 p-4 rounded-lg ${message.includes('✅') ? 'bg-green-500/20 border border-green-500 text-green-400' :
            message.includes('❌') ? 'bg-red-500/20 border border-red-500 text-red-400' :
              'bg-yellow-500/20 border border-yellow-500 text-yellow-400'
            }`}>
            {message}
          </div>
        )}

        <div className="max-w-4xl mx-auto space-y-6 pb-20">
          {/* Main List - Pages with Heroes */}
          <div className="w-full">
            {/* Page Edit/Create Form - Combined for better UX */}
            {showAddPageModal && (
              <div className="mb-6 animate-slideDown">
                <div className="bg-[#0f0f1a] p-5 rounded-2xl border border-cyan-500/30 shadow-xl shadow-cyan-500/10">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm font-bold text-cyan-400 flex items-center gap-2 uppercase tracking-wider">
                      {editingPageObjId ? <PencilIcon className="w-4 h-4" /> : <PlusIcon className="w-4 h-4" />}
                      {editingPageObjId ? "Update Page Name" : "Create New Page"}
                    </h3>
                    <button
                      onClick={() => {
                        setShowAddPageModal(false);
                        setEditingPageObjId(null);
                        setNewPageName("");
                        setNewPageIdUrl("");
                      }}
                      className="text-gray-500 hover:text-white transition"
                    >
                      <XMarkIcon className="w-5 h-5" />
                    </button>
                  </div>

                  <form onSubmit={handleCreatePage} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="text-[10px] uppercase text-gray-500 font-bold ml-1 mb-1 block">Page Name</label>
                        <input
                          type="text"
                          value={newPageName}
                          onChange={(e) => setNewPageName(e.target.value)}
                          placeholder="e.g., Services"
                          className="w-full bg-[#111122] border border-gray-700 rounded-lg p-3 text-sm text-white focus:border-cyan-400 focus:outline-none transition-colors"
                          required
                        />
                      </div>
                      <div>
                        <label className="text-[10px] uppercase text-gray-500 font-bold ml-1 mb-1 block">URL Slug (Optional)</label>
                        <input
                          type="text"
                          value={newPageIdUrl}
                          onChange={(e) => setNewPageIdUrl(e.target.value)}
                          placeholder="e.g., service-detail"
                          className="w-full bg-[#111122] border border-gray-700 rounded-lg p-3 text-sm text-white focus:border-cyan-400 focus:outline-none transition-colors"
                        />
                      </div>
                    </div>
                    <div className="flex justify-end gap-3 pt-2">
                      <button
                        type="button"
                        onClick={() => {
                          setShowAddPageModal(false);
                          setEditingPageObjId(null);
                          setNewPageName("");
                          setNewPageIdUrl("");
                        }}
                        className="text-sm text-gray-400 hover:text-white px-4 py-2 font-medium transition-colors"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={loading}
                        className={`text-white text-sm font-bold px-8 py-2.5 rounded-xl transition-all shadow-lg disabled:opacity-50 ${editingPageObjId ? 'bg-yellow-600 hover:bg-yellow-500 shadow-yellow-500/20' : 'bg-cyan-600 hover:bg-cyan-500 shadow-cyan-500/20'}`}
                      >
                        {loading ? 'Processing...' : editingPageObjId ? 'Update Page' : 'Create Page'}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}

            <div className="bg-[#1a1a2e] rounded-2xl border border-gray-800 p-4">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold flex items-center gap-2">
                  <EyeIcon className="w-5 h-5 text-cyan-400" />
                  Pages ({availablePages.length})
                </h2>
                <button
                  onClick={() => {
                    setEditingPageObjId(null);
                    setNewPageName("");
                    setNewPageIdUrl("");
                    setShowAddPageModal(true);
                  }}
                  className="bg-cyan-600 hover:bg-cyan-700 text-xs px-2 py-1 rounded transition flex items-center gap-1"
                >
                  <PlusIcon className="w-4 h-4" /> Add New Page
                </button>
              </div>



              <div className="space-y-4">
                {filteredPages.map((page) => (
                  <div key={page.pageId} className="border border-gray-700 rounded-lg overflow-hidden">
                    <div
                      className="bg-[#0f0f1a] p-3 flex items-center justify-between cursor-pointer"
                      onClick={() => setExpandedPage(expandedPage === page.pageId ? '' : page.pageId)}
                    >
                      <h3 className="font-medium text-cyan-400 flex items-center gap-2">
                        {page.pageName}
                        {getFilteredHeroes(page.pageId).length > 0 && searchTerm && (
                          <span className="text-[10px] bg-cyan-500/10 text-cyan-400 px-2 py-0.5 rounded-full border border-cyan-500/20">
                            {getFilteredHeroes(page.pageId).length} matches
                          </span>
                        )}
                        {!page.isActive && <span className="text-[10px] bg-red-500/20 text-red-400 px-1.5 py-0.5 rounded border border-red-500">Inactive</span>}
                      </h3>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleCreateHero(page.pageId, page.pageName);
                          }}
                          className="p-1 bg-green-600 hover:bg-green-700 rounded transition"
                          title="Add new hero to this page"
                        >
                          <PlusIcon className="w-4 h-4 text-white" />
                        </button>
                        <button
                          onClick={(e) => handleOpenEditPage(page, e)}
                          className="p-1 bg-yellow-600/20 hover:bg-yellow-600 rounded transition text-yellow-500 hover:text-white border border-yellow-500/30"
                          title="Edit page name & URL"
                        >
                          <PencilIcon className="w-4 h-4" />
                        </button>
                        <button
                          onClick={(e) => handleDeletePage(page._id, page.pageName, e)}
                          className="p-1 bg-red-600/20 hover:bg-red-600 rounded transition text-red-500 hover:text-white border border-red-500/30"
                          title="Delete this page"
                        >
                          <TrashIcon className="w-4 h-4" />
                        </button>
                        <button className="p-1 bg-gray-800 rounded">
                          {expandedPage === page.pageId ? (
                            <ChevronUpIcon className="w-4 h-4" />
                          ) : (
                            <ChevronDownIcon className="w-4 h-4" />
                          )}
                        </button>
                      </div>
                    </div>

                    {/* Inline Edit Page Form - Shows right under the page title being edited */}
                    {showAddPageModal && editingPageObjId === page._id && (
                      <div className="p-4 bg-[#0f0f1a] border-t border-cyan-500/30 animate-slideDown">
                        <div className="flex items-center gap-2 mb-3">
                          <PencilIcon className="w-4 h-4 text-yellow-500" />
                          <h4 className="text-sm font-bold text-white uppercase tracking-wider">Edit Page Settings</h4>
                        </div>
                        <form onSubmit={handleCreatePage} className="space-y-3">
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                              <label className="text-[10px] uppercase text-gray-500 font-bold ml-1 mb-1 block">Page Name</label>
                              <input
                                type="text"
                                value={newPageName}
                                onChange={(e) => setNewPageName(e.target.value)}
                                placeholder="Page Name"
                                className="w-full bg-[#111122] border border-gray-700 rounded-lg p-2.5 text-sm text-white focus:border-cyan-400 focus:outline-none transition-all"
                                required
                              />
                            </div>
                            <div>
                              <label className="text-[10px] uppercase text-gray-500 font-bold ml-1 mb-1 block">URL Slug</label>
                              <input
                                type="text"
                                value={newPageIdUrl}
                                onChange={(e) => setNewPageIdUrl(e.target.value)}
                                placeholder="URL ID"
                                className="w-full bg-[#111122] border border-gray-700 rounded-lg p-2.5 text-sm text-white focus:border-cyan-400 focus:outline-none transition-all"
                              />
                            </div>
                          </div>
                          <div className="flex justify-end gap-2 pt-1 border-t border-gray-800 mt-2">
                            <button
                              type="button"
                              onClick={() => {
                                setShowAddPageModal(false);
                                setEditingPageObjId(null);
                              }}
                              className="text-xs text-gray-400 hover:text-white px-3 py-2 transition-colors"
                            >
                              Cancel
                            </button>
                            <button
                              type="submit"
                              disabled={loading}
                              className="bg-yellow-600 hover:bg-yellow-500 text-white text-xs font-bold px-4 py-2 rounded-lg transition-all shadow-lg shadow-yellow-500/10"
                            >
                              {loading ? 'Saving...' : 'Update Page'}
                            </button>
                          </div>
                        </form>
                      </div>
                    )}

                    {/* HERO LIST WITHIN PAGE - Smart Expand on Search */}
                    {(expandedPage === page.pageId ||
                      (searchTerm && page.pageName.toLowerCase().includes(searchTerm.toLowerCase())) ||
                      (searchTerm && getFilteredHeroes(page.pageId).length > 0)
                    ) && (
                        <div className="p-2 space-y-4 animate-fadeIn bg-black/20 rounded-b-lg">
                          {/* New Hero Section Button - Always visible at top of page sections */}
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <button
                              onClick={() => handleCreateHero(page.pageId, page.pageName)}
                              className="w-full py-3 bg-cyan-600/10 hover:bg-cyan-600/20 text-cyan-400 text-xs font-bold rounded-xl border border-dashed border-cyan-500/40 transition-all flex items-center justify-center gap-2 group"
                            >
                              <PlusIcon className="w-5 h-5 group-hover:scale-125 transition-transform" />
                              Add New Hero Section
                            </button>

                            <button
                              onClick={() => {
                                setImportTargetPageId(page.pageId);
                                setShowImportHeroModal(true);
                              }}
                              className="w-full py-3 bg-purple-600/10 hover:bg-purple-600/20 text-purple-400 text-xs font-bold rounded-xl border border-dashed border-purple-500/40 transition-all flex items-center justify-center gap-2 group"
                            >
                              <ArrowPathIcon className="w-5 h-5 group-hover:rotate-180 transition-transform" />
                              Import from Other Page
                            </button>
                          </div>

                          <div className="space-y-3">
                            {getFilteredHeroes(page.pageId).length > 0 ? (
                              getFilteredHeroes(page.pageId).map((hero, index) => (
                                <div key={hero._id} id={`hero-container-${hero._id}`} className="relative border border-gray-800/50 rounded-xl overflow-hidden bg-[#0c0c16]/50">
                                  <div className="absolute top-0 right-0 px-3 py-1 bg-gray-800 rounded-bl-lg text-[9px] font-bold text-gray-500 uppercase tracking-tighter">
                                    Section {index + 1}
                                  </div>
                                  <div
                                    id={`hero-card-${hero._id}`}
                                    className={`rounded-xl transition-all duration-300 ${selectedHero?._id === hero._id
                                      ? 'bg-[#1a1a2e] border border-cyan-500/50 shadow-2xl shadow-cyan-500/10 mb-6'
                                      : 'hover:bg-gray-800 border border-gray-700 mb-2'
                                      }`}
                                  >
                                    <div
                                      className={`p-4 flex items-center justify-between cursor-pointer ${selectedHero?._id === hero._id ? 'border-b border-gray-800' : ''}`}
                                      onClick={() => handleSelectHero(selectedHero?._id === hero._id ? null : hero)}
                                    >
                                      <div className="flex-1">
                                        <div className="flex items-center gap-2">
                                          <p className={`text-sm font-bold ${selectedHero?._id === hero._id ? 'text-cyan-400' : 'text-white'}`}>
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

                                      <div className="flex gap-2">
                                        <button
                                          onClick={(e) => { e.stopPropagation(); handleDuplicateHeroClick(hero); }}
                                          className="p-1.5 hover:bg-gray-700 rounded-lg transition-colors"
                                          title="Duplicate"
                                        >
                                          <DocumentDuplicateIcon className="w-5 h-5 text-gray-400" />
                                        </button>
                                        <button
                                          onClick={(e) => { e.stopPropagation(); handleToggleStatus(hero._id); }}
                                          className="p-1.5 hover:bg-gray-700 rounded-lg transition-colors"
                                          title="Toggle status"
                                        >
                                          <ArrowPathIcon className="w-5 h-5 text-gray-400" />
                                        </button>
                                        <button
                                          onClick={(e) => { e.stopPropagation(); handleDeleteHero(hero._id); }}
                                          className="p-1.5 hover:bg-red-600/20 text-red-500 rounded-lg transition-colors"
                                          title="Delete"
                                        >
                                          <TrashIcon className="w-5 h-5" />
                                        </button>
                                        <button className={`p-1.5 rounded-lg transition-colors ${selectedHero?._id === hero._id ? 'bg-cyan-500 text-white' : 'bg-gray-800'}`}>
                                          {selectedHero?._id === hero._id ? (
                                            <ChevronUpIcon className="w-5 h-5" />
                                          ) : (
                                            <ChevronDownIcon className="w-5 h-5" />
                                          )}
                                        </button>
                                      </div>
                                    </div>

                                    {/* INLINE HERO EDIT FORM */}
                                    {selectedHero?._id === hero._id && (
                                      <div className="p-4 bg-[#0c0c16] rounded-b-xl animate-fadeIn custom-scrollbar">
                                        {/* Tab Navigation */}
                                        <div className="flex border-b border-gray-800 mb-6 sticky top-0 bg-[#0c0c16] z-10 pt-2">
                                          {['content', 'style', 'media'].map((tab) => (
                                            <button
                                              key={tab}
                                              onClick={() => setActiveTab(tab)}
                                              className={`px-6 py-3 text-sm font-bold uppercase tracking-wider transition-all border-b-2 ${activeTab === tab
                                                ? 'border-cyan-500 text-cyan-400 bg-cyan-500/5'
                                                : 'border-transparent text-gray-500 hover:text-gray-300'
                                                }`}
                                            >
                                              {tab}
                                            </button>
                                          ))}
                                        </div>

                                        <div className="max-h-[70vh] overflow-y-auto no-scrollbar px-1">
                                          <form onSubmit={handleUpdateHero} className="space-y-6">
                                            {activeTab === 'content' && (
                                              <div className="space-y-6 animate-fadeIn pb-6">
                                                {/* Live Preview Box */}
                                                <div className="bg-[#1a1a2e] rounded-2xl border border-gray-800 overflow-hidden shadow-2xl">
                                                  <div className="bg-gray-800/50 px-4 py-2 border-b border-gray-800 flex items-center justify-between">
                                                    <span className="text-[10px] uppercase font-bold text-gray-400 tracking-widest">Live Preview</span>
                                                    <span className="text-[10px] text-cyan-500">Auto-refreshing...</span>
                                                  </div>
                                                  <div className="p-6 text-center space-y-4">
                                                    {/* Preview Title */}
                                                    <h2
                                                      className={`font-black tracking-tight ${!formData.useHexColors?.title ? (formData.customColors?.title || 'text-white') : ''} text-2xl`}
                                                      style={formData.useHexColors?.title ? { color: formData.customColors?.titleHex } : {}}
                                                    >
                                                      {formData.title || 'Your Heading Here'}
                                                    </h2>

                                                    {/* Preview Subtitle */}
                                                    <div
                                                      className={`inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest ${!formData.useHexColors?.subtitle ? (formData.customColors?.subtitle || 'text-cyan-400') : ''} ${formData.badgeStyle || ''}`}
                                                      style={formData.useHexColors?.subtitle ? { color: formData.customColors?.subtitleHex } : {}}
                                                    >
                                                      {formData.subtitle || 'SUBTITLE / BADGE'}
                                                    </div>

                                                    {/* Preview Description */}
                                                    <div className="max-w-md mx-auto">
                                                      {renderDescriptionPreview() || (
                                                        <p className="text-gray-500 text-sm italic">Type a description below to see formatting...</p>
                                                      )}
                                                    </div>

                                                    {/* Preview Buttons */}
                                                    {formData.showButtons && (
                                                      <div className="flex justify-center gap-3 pt-2">
                                                        <div className="px-4 py-1.5 bg-cyan-600 rounded text-[10px] font-bold text-white uppercase">{formData.primaryButtonText}</div>
                                                        <div className="px-4 py-1.5 bg-gray-700 rounded text-[10px] font-bold text-white uppercase">{formData.secondaryButtonText}</div>
                                                      </div>
                                                    )}
                                                  </div>
                                                </div>

                                                <div>
                                                  <label className="text-[10px] font-bold text-gray-500 uppercase ml-1">Hero Title (Internal Name)</label>
                                                  <input
                                                    type="text"
                                                    value={formData.heroName}
                                                    onChange={(e) => setFormData({ ...formData, heroName: e.target.value })}
                                                    className="w-full mt-1 px-4 py-2.5 bg-[#1a1a2e] border border-gray-700 rounded-xl text-white focus:border-cyan-500 transition-all focus:ring-1 focus:ring-cyan-500/50 outline-none"
                                                    placeholder="e.g. Home Page Main Banner"
                                                  />
                                                </div>

                                                <div>
                                                  <label className="text-[10px] font-bold text-gray-500 uppercase ml-1">Main Heading</label>
                                                  <input
                                                    type="text"
                                                    value={formData.title}
                                                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                                    className="w-full mt-1 px-4 py-2.5 bg-[#1a1a2e] border border-gray-700 rounded-xl text-white focus:border-cyan-500 transition-all"
                                                    placeholder="Enter main title..."
                                                  />
                                                </div>

                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                  <div>
                                                    <label className="text-[10px] font-bold text-gray-500 uppercase ml-1">Subtitle / Badge</label>
                                                    <input
                                                      type="text"
                                                      value={formData.subtitle}
                                                      onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                                                      className="w-full mt-1 px-4 py-2.5 bg-[#1a1a2e] border border-gray-700 rounded-xl text-white focus:border-cyan-500"
                                                    />
                                                  </div>
                                                  <div>
                                                    <label className="text-[10px] font-bold text-gray-500 uppercase ml-1">Description</label>
                                                    {/* Formatting Help */}
                                                    {showFormattingHelp && (
                                                      <div className="mb-3 p-3 bg-[#1a1a2e] rounded-lg border border-cyan-500/30 text-sm">
                                                        <p className="text-cyan-400 font-medium mb-2">Formatting Tips:</p>
                                                        <ul className="space-y-1 text-gray-300 text-xs">
                                                          <li>• <span className="text-cyan-400">key: value</span> - Shows as label: value</li>
                                                          <li>• <span className="text-cyan-400">Internship, Placement, Job</span> - Auto colored badges</li>
                                                          <li>• <span className="text-cyan-400">• or -</span> at start creates bullet points</li>
                                                          <li>• <span className="text-cyan-400">Blank lines</span> create paragraphs</li>
                                                        </ul>
                                                      </div>
                                                    )}

                                                    {/* Quick Insert Buttons */}
                                                    <div className="flex flex-wrap gap-2 mb-3">
                                                      <button
                                                        type="button"
                                                        onClick={() => insertTemplate('duration')}
                                                        className="flex items-center gap-1 bg-gray-700 hover:bg-gray-600 px-2 py-1 rounded text-xs"
                                                      >
                                                        <ClockIcon className="w-3 h-3" />
                                                        Duration
                                                      </button>
                                                      <button
                                                        type="button"
                                                        onClick={() => insertTemplate('internship')}
                                                        className="flex items-center gap-1 bg-gray-700 hover:bg-gray-600 px-2 py-1 rounded text-xs"
                                                      >
                                                        <BriefcaseIcon className="w-3 h-3" />
                                                        Internship
                                                      </button>
                                                      <button
                                                        type="button"
                                                        onClick={() => insertTemplate('placement')}
                                                        className="flex items-center gap-1 bg-gray-700 hover:bg-gray-600 px-2 py-1 rounded text-xs"
                                                      >
                                                        <AcademicCapIcon className="w-3 h-3" />
                                                        Placement
                                                      </button>
                                                      <button
                                                        type="button"
                                                        onClick={() => insertTemplate('features')}
                                                        className="flex items-center gap-1 bg-gray-700 hover:bg-gray-600 px-2 py-1 rounded text-xs"
                                                      >
                                                        <ListBulletIcon className="w-3 h-3" />
                                                        Features
                                                      </button>
                                                      <button
                                                        type="button"
                                                        onClick={() => insertTemplate('paragraph')}
                                                        className="flex items-center gap-1 bg-gray-700 hover:bg-gray-600 px-2 py-1 rounded text-xs"
                                                      >
                                                        <DocumentTextIcon className="w-3 h-3" />
                                                        Paragraph
                                                      </button>
                                                    </div>
                                                    <textarea
                                                      rows="4"
                                                      value={formData.description}
                                                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                                      className="w-full mt-1 px-4 py-2.5 bg-[#1a1a2e] border border-gray-700 rounded-xl text-white focus:border-cyan-500 resize-none font-sans text-sm outline-none focus:ring-1 focus:ring-cyan-500/30 transition-all"
                                                      placeholder="Enter description... (Template buttons above help with formatting)"
                                                    />
                                                  </div>
                                                </div>

                                                {/* Buttons */}
                                                <div className="space-y-4">
                                                  <div className="flex items-center gap-2">
                                                    <input
                                                      type="checkbox"
                                                      name="showButtons"
                                                      checked={formData.showButtons}
                                                      onChange={(e) => setFormData({ ...formData, showButtons: e.target.checked })}
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
                                                            onChange={(e) => setFormData({ ...formData, primaryButtonText: e.target.value })}
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
                                                            onChange={(e) => setFormData({ ...formData, primaryButtonLink: e.target.value })}
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
                                                            onChange={(e) => setFormData({ ...formData, secondaryButtonText: e.target.value })}
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
                                                            onChange={(e) => setFormData({ ...formData, secondaryButtonLink: e.target.value })}
                                                            className="w-full px-4 py-2 bg-[#0f0f1a] border border-gray-700 rounded-lg"
                                                          />
                                                        </div>
                                                      </div>
                                                    </>
                                                  )}
                                                </div>

                                                <div className="bg-[#1a1a2e] p-4 rounded-xl border border-gray-800">
                                                  <h4 className="text-xs font-bold text-gray-400 uppercase mb-4 flex items-center gap-2">
                                                    <ArrowsPointingOutIcon className="w-4 h-4" /> Layout & Buttons
                                                  </h4>
                                                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                                                    <label className="block">
                                                      <span className="text-[10px] text-gray-500 uppercase">Alignment</span>
                                                      <select
                                                        value={formData.alignment}
                                                        onChange={(e) => setFormData({ ...formData, alignment: e.target.value })}
                                                        className="w-full mt-1 bg-gray-900 border border-gray-700 rounded-lg p-2 text-sm"
                                                      >
                                                        <option value="left">Left</option>
                                                        <option value="center">Center</option>
                                                        <option value="right">Right</option>
                                                      </select>
                                                    </label>
                                                    <label className="block">
                                                      <span className="text-[10px] text-gray-500 uppercase">Height</span>
                                                      <select
                                                        value={formData.height}
                                                        onChange={(e) => setFormData({ ...formData, height: e.target.value })}
                                                        className="w-full mt-1 bg-gray-900 border border-gray-700 rounded-lg p-2 text-sm"
                                                      >
                                                        <option value="small">Small (300px)</option>
                                                        <option value="medium">Medium (400px)</option>
                                                        <option value="large">Large (500px)</option>
                                                        <option value="full">Full Screen</option>
                                                      </select>
                                                    </label>
                                                    <label className="block">
                                                      <span className="text-[10px] text-gray-500 uppercase">Animation</span>
                                                      <select
                                                        name="animationType"
                                                        value={formData.animationType}
                                                        onChange={(e) => setFormData({ ...formData, animationType: e.target.value })}
                                                        className="w-full mt-1 bg-gray-900 border border-gray-700 rounded-lg p-2 text-sm"
                                                      >
                                                        <option value="fade">Fade In</option>
                                                        <option value="slide">Slide Up</option>
                                                        <option value="zoom">Zoom In</option>
                                                        <option value="none">No Animation</option>
                                                      </select>
                                                    </label>
                                                  </div>

                                                  <div className="flex items-center gap-4 py-2 border-t border-gray-800 mt-2">
                                                    <label className="flex items-center gap-2 cursor-pointer">
                                                      <input type="checkbox" checked={formData.showButtons} onChange={(e) => setFormData({ ...formData, showButtons: e.target.checked })} className="w-4 h-4 accent-cyan-500" />
                                                      <span className="text-sm">Show Buttons</span>
                                                    </label>
                                                    <label className="flex items-center gap-2 cursor-pointer">
                                                      <input type="checkbox" checked={formData.isActive} onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })} className="w-4 h-4 accent-cyan-500" />
                                                      <span className="text-sm">Published</span>
                                                    </label>
                                                  </div>
                                                </div>
                                              </div>
                                            )}

                                            {activeTab === 'style' && (
                                              <div className="space-y-6 animate-fadeIn">
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                  {/* Text Color Selection */}
                                                  <div className="bg-[#1a1a2e] p-4 rounded-xl border border-gray-800">
                                                    <h4 className="text-xs font-bold text-gray-400 uppercase mb-4">Text Styling</h4>
                                                    <div className="space-y-4">
                                                      <div>
                                                        <p className="text-[10px] text-gray-500 uppercase mb-2">Title Color</p>
                                                        <div className="flex flex-wrap gap-2 items-center">
                                                          {TEXT_COLORS.map((color) => (
                                                            <button
                                                              key={color.value}
                                                              type="button"
                                                              onClick={() => setFormData({
                                                                ...formData,
                                                                useCustomColors: true,
                                                                useHexColors: { ...formData.useHexColors, title: false },
                                                                customColors: { ...formData.customColors, title: color.value }
                                                              })}
                                                              className={`w-8 h-8 rounded-full border-2 transition-transform ${(!formData.useHexColors?.title && formData.customColors?.title === color.value) ? 'border-cyan-400 scale-110 shadow-lg shadow-cyan-500/50' : 'border-transparent hover:scale-105'} ${color.value.replace('text-', 'bg-')}`}
                                                              style={color.value.includes('gradient') ? { background: 'linear-gradient(45deg, #06b6d4, #3b82f6)' } : {}}
                                                              title={color.name}
                                                            />
                                                          ))}
                                                          <div className="h-8 w-px bg-gray-700 mx-1"></div>
                                                          <div className="flex items-center gap-2 bg-[#0f0f1a] p-1 rounded-lg border border-gray-700">
                                                            <input
                                                              type="color"
                                                              value={formData.customColors?.titleHex || '#ffffff'}
                                                              onChange={(e) => setFormData({
                                                                ...formData,
                                                                useCustomColors: true,
                                                                useHexColors: { ...formData.useHexColors, title: true },
                                                                customColors: { ...formData.customColors, titleHex: e.target.value }
                                                              })}
                                                              className="w-6 h-6 rounded cursor-pointer bg-transparent border-none"
                                                            />
                                                            <span className="text-[9px] text-gray-500 font-mono uppercase pr-1">Custom</span>
                                                          </div>
                                                        </div>
                                                      </div>
                                                      <div>
                                                        <p className="text-[10px] text-gray-500 uppercase mb-2">Subtitle Color</p>
                                                        <div className="flex flex-wrap gap-2 items-center">
                                                          {TEXT_COLORS.map((color) => (
                                                            <button
                                                              key={color.value}
                                                              type="button"
                                                              onClick={() => setFormData({
                                                                ...formData,
                                                                useCustomColors: true,
                                                                useHexColors: { ...formData.useHexColors, subtitle: false },
                                                                customColors: { ...formData.customColors, subtitle: color.value }
                                                              })}
                                                              className={`w-8 h-8 rounded-full border-2 transition-transform ${(!formData.useHexColors?.subtitle && formData.customColors?.subtitle === color.value) ? 'border-cyan-400 scale-110 shadow-lg shadow-cyan-500/50' : 'border-transparent hover:scale-105'} ${color.value.replace('text-', 'bg-')}`}
                                                              style={color.value.includes('gradient') ? { background: 'linear-gradient(45deg, #06b6d4, #3b82f6)' } : {}}
                                                              title={color.name}
                                                            />
                                                          ))}
                                                          <div className="h-8 w-px bg-gray-700 mx-1"></div>
                                                          <div className="flex items-center gap-2 bg-[#0f0f1a] p-1 rounded-lg border border-gray-700">
                                                            <input
                                                              type="color"
                                                              value={formData.customColors?.subtitleHex || '#22d3ee'}
                                                              onChange={(e) => setFormData({
                                                                ...formData,
                                                                useCustomColors: true,
                                                                useHexColors: { ...formData.useHexColors, subtitle: true },
                                                                customColors: { ...formData.customColors, subtitleHex: e.target.value }
                                                              })}
                                                              className="w-6 h-6 rounded cursor-pointer bg-transparent border-none"
                                                            />
                                                            <span className="text-[9px] text-gray-500 font-mono uppercase pr-1">Custom</span>
                                                          </div>
                                                        </div>
                                                      </div>
                                                      <div>
                                                        <p className="text-[10px] text-gray-500 uppercase mb-2">Description Color</p>
                                                        <div className="flex flex-wrap gap-2 items-center">
                                                          {TEXT_COLORS.map((color) => (
                                                            <button
                                                              key={color.value}
                                                              type="button"
                                                              onClick={() => setFormData({
                                                                ...formData,
                                                                useCustomColors: true,
                                                                useHexColors: { ...formData.useHexColors, description: false },
                                                                customColors: { ...formData.customColors, description: color.value }
                                                              })}
                                                              className={`w-8 h-8 rounded-full border-2 transition-transform ${(!formData.useHexColors?.description && formData.customColors?.description === color.value) ? 'border-cyan-400 scale-110 shadow-lg shadow-cyan-500/50' : 'border-transparent hover:scale-105'} ${color.value.replace('text-', 'bg-')}`}
                                                              style={color.value.includes('gradient') ? { background: 'linear-gradient(45deg, #06b6d4, #3b82f6)' } : {}}
                                                              title={color.name}
                                                            />
                                                          ))}
                                                          <div className="h-8 w-px bg-gray-700 mx-1"></div>
                                                          <div className="flex items-center gap-2 bg-[#0f0f1a] p-1 rounded-lg border border-gray-700">
                                                            <input
                                                              type="color"
                                                              value={formData.customColors?.descriptionHex || '#d1d5db'}
                                                              onChange={(e) => setFormData({
                                                                ...formData,
                                                                useCustomColors: true,
                                                                useHexColors: { ...formData.useHexColors, description: true },
                                                                customColors: { ...formData.customColors, descriptionHex: e.target.value }
                                                              })}
                                                              className="w-6 h-6 rounded cursor-pointer bg-transparent border-none"
                                                            />
                                                            <span className="text-[9px] text-gray-500 font-mono uppercase pr-1">Custom</span>
                                                          </div>
                                                        </div>
                                                      </div>
                                                      <div>
                                                        <label className="block text-sm text-gray-400 mb-2">
                                                          General Text Color
                                                        </label>
                                                        <input
                                                          type="color"
                                                          name="textColor"
                                                          value={formData.textColor}
                                                          onChange={(e) => setFormData({ ...formData, textColor: e.target.value })}
                                                          className="w-full h-10 bg-[#0f0f1a] border border-gray-700 rounded-lg"
                                                        />
                                                      </div>
                                                    </div>
                                                  </div>

                                                  {/* Background Setup */}
                                                  <div className="bg-[#1a1a2e] p-4 rounded-xl border border-gray-800">
                                                    <h4 className="text-xs font-bold text-gray-400 uppercase mb-4">Background Setting</h4>
                                                    <div className="grid grid-cols-2 gap-4">
                                                      {['image', 'slider', 'video', 'color', 'none'].map((type) => (
                                                        <button
                                                          key={type}
                                                          type="button"
                                                          onClick={() => setFormData({ ...formData, backgroundType: type })}
                                                          className={`p-3 rounded-lg border text-sm capitalize flex flex-col items-center gap-2 transition-all ${formData.backgroundType === type
                                                            ? 'bg-cyan-500/10 border-cyan-500 text-cyan-400'
                                                            : 'bg-gray-900 border-gray-700 text-gray-500'
                                                            }`}
                                                        >
                                                          {type === 'image' && <PhotoIcon className="w-5 h-5" />}
                                                          {type === 'slider' && <SwatchIcon className="w-5 h-5" />}
                                                          {type === 'video' && <VideoCameraIcon className="w-5 h-5" />}
                                                          {type === 'color' && <PaintBrushIcon className="w-5 h-5" />}
                                                          {type === 'none' && <XCircleIcon className="w-5 h-5" />}
                                                          {type}
                                                        </button>
                                                      ))}
                                                    </div>
                                                    {/* Background Color */}
                                                    {formData.backgroundType === 'color' && (
                                                      <div className="mt-4">
                                                        <label className="block text-sm text-gray-400 mb-2">
                                                          Background Color
                                                        </label>
                                                        <input
                                                          type="color"
                                                          name="backgroundColor"
                                                          value={formData.backgroundColor}
                                                          onChange={(e) => setFormData({ ...formData, backgroundColor: e.target.value })}
                                                          className="w-full h-10 bg-[#0f0f1a] border border-gray-700 rounded-lg"
                                                        />
                                                      </div>
                                                    )}
                                                    {/* Overlay Opacity */}
                                                    <div className="mt-4">
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
                                                        onChange={(e) => setFormData({ ...formData, overlayOpacity: parseFloat(e.target.value) })}
                                                        className="w-full"
                                                      />
                                                    </div>
                                                  </div>
                                                </div>

                                                {/* Badge Style */}
                                                <div className="bg-[#0f0f1a] p-4 rounded-lg border border-gray-700">
                                                  <div className="flex items-center justify-between mb-4">
                                                    <label className="text-sm text-gray-400">Badge Style</label>
                                                    <div className="flex items-center gap-2">
                                                      <TagIcon className="w-4 h-4 text-cyan-400" />
                                                      <select
                                                        value={formData.badgeStyle || 'bg-linear-to-r from-cyan-500 to-blue-600 text-white'}
                                                        onChange={(e) => setFormData({ ...formData, badgeStyle: e.target.value })}
                                                        className="text-xs bg-[#1a1a2e] border border-gray-600 rounded px-2 py-1 text-white focus:outline-none focus:border-cyan-400"
                                                      >
                                                        {BADGE_STYLES.map(style => (
                                                          <option key={style.value} value={style.value}>
                                                            {style.name}
                                                          </option>
                                                        ))}
                                                      </select>
                                                    </div>
                                                  </div>

                                                  {/* Badge Preview */}
                                                  <div className="flex flex-wrap gap-2">
                                                    <span className={`${formData.badgeStyle || 'bg-linear-to-r from-cyan-500 to-blue-600 text-white'} px-3 py-1.5 rounded-full text-sm inline-block`}>
                                                      Internship Available
                                                    </span>
                                                    <span className={`${formData.badgeStyle || 'bg-linear-to-r from-cyan-500 to-blue-600 text-white'} px-3 py-1.5 rounded-full text-sm inline-block`}>
                                                      Placement Assistance
                                                    </span>
                                                  </div>
                                                </div>

                                                {/* Formatting Options */}
                                                <div className="grid grid-cols-2 gap-4">
                                                  <div className="flex items-center gap-2">
                                                    <input
                                                      type="checkbox"
                                                      id="highlightKeywords"
                                                      checked={formData.highlightKeywords}
                                                      onChange={(e) => setFormData({ ...formData, highlightKeywords: e.target.checked })}
                                                      className="w-4 h-4"
                                                    />
                                                    <label htmlFor="highlightKeywords" className="text-sm">
                                                      Highlight Keywords
                                                    </label>
                                                  </div>
                                                  <div className="flex items-center gap-2">
                                                    <input
                                                      type="checkbox"
                                                      id="showAsBadges"
                                                      checked={formData.showAsBadges}
                                                      onChange={(e) => setFormData({ ...formData, showAsBadges: e.target.checked })}
                                                      className="w-4 h-4"
                                                    />
                                                    <label htmlFor="showAsBadges" className="text-sm">
                                                      Show as Badges
                                                    </label>
                                                  </div>
                                                </div>

                                                {/* Typography Settings - Font Sizes */}
                                                <div className="border-t border-gray-700 pt-6 mt-6">
                                                  <h3 className="text-lg font-medium mb-4 flex items-center gap-2">
                                                    <AdjustmentsHorizontalIcon className="w-5 h-5 text-cyan-400" />
                                                    Typography Settings
                                                  </h3>

                                                  <div className="grid grid-cols-2 gap-4">
                                                    <div>
                                                      <label className="block text-sm text-gray-400 mb-2">
                                                        Title Font Size
                                                      </label>
                                                      <select
                                                        value={formData.fontSize?.title || 'large'}
                                                        onChange={(e) => setFormData({
                                                          ...formData,
                                                          fontSize: { ...formData.fontSize, title: e.target.value }
                                                        })}
                                                        className="w-full px-4 py-2 bg-[#0f0f1a] border border-gray-700 rounded-lg focus:outline-none focus:border-cyan-400"
                                                      >
                                                        <option value="small">Small</option>
                                                        <option value="medium">Medium</option>
                                                        <option value="large">Large</option>
                                                        <option value="custom">Extra Large</option>
                                                      </select>
                                                    </div>

                                                    <div>
                                                      <label className="block text-sm text-gray-400 mb-2">
                                                        Subtitle Font Size
                                                      </label>
                                                      <select
                                                        value={formData.fontSize?.subtitle || 'medium'}
                                                        onChange={(e) => setFormData({
                                                          ...formData,
                                                          fontSize: { ...formData.fontSize, subtitle: e.target.value }
                                                        })}
                                                        className="w-full px-4 py-2 bg-[#0f0f1a] border border-gray-700 rounded-lg focus:outline-none focus:border-cyan-400"
                                                      >
                                                        <option value="small">Small</option>
                                                        <option value="medium">Medium</option>
                                                        <option value="large">Large</option>
                                                        <option value="custom">Extra Large</option>
                                                      </select>
                                                    </div>

                                                    <div>
                                                      <label className="block text-sm text-gray-400 mb-2">
                                                        Description Font Size
                                                      </label>
                                                      <select
                                                        value={formData.fontSize?.description || 'medium'}
                                                        onChange={(e) => setFormData({
                                                          ...formData,
                                                          fontSize: { ...formData.fontSize, description: e.target.value }
                                                        })}
                                                        className="w-full px-4 py-2 bg-[#0f0f1a] border border-gray-700 rounded-lg focus:outline-none focus:border-cyan-400"
                                                      >
                                                        <option value="small">Small</option>
                                                        <option value="medium">Medium</option>
                                                        <option value="large">Large</option>
                                                        <option value="custom">Extra Large</option>
                                                      </select>
                                                    </div>

                                                    <div>
                                                      <label className="block text-sm text-gray-400 mb-2">
                                                        Badge Font Size
                                                      </label>
                                                      <select
                                                        value={formData.fontSize?.badge || 'medium'}
                                                        onChange={(e) => setFormData({
                                                          ...formData,
                                                          fontSize: { ...formData.fontSize, badge: e.target.value }
                                                        })}
                                                        className="w-full px-4 py-2 bg-[#0f0f1a] border border-gray-700 rounded-lg focus:outline-none focus:border-cyan-400"
                                                      >
                                                        <option value="small">Small</option>
                                                        <option value="medium">Medium</option>
                                                        <option value="large">Large</option>
                                                        <option value="custom">Extra Large</option>
                                                      </select>
                                                    </div>
                                                  </div>
                                                </div>
                                              </div>
                                            )}

                                            {activeTab === 'media' && (
                                              <div className="space-y-6 animate-fadeIn">
                                                <div className="bg-[#1a1a2e] p-6 rounded-2xl border border-gray-800 border-dashed border-2 text-center">
                                                  <input type="file" multiple accept="image/*" onChange={handleImageUpload} className="hidden" id="tabbedImageUpload" disabled={uploading} />
                                                  <label htmlFor="tabbedImageUpload" className="cursor-pointer group">
                                                    <div className="mx-auto w-16 h-16 bg-gray-900 rounded-full flex items-center justify-center mb-4 group-hover:bg-cyan-500/10 transition-colors">
                                                      <CloudArrowUpIcon className="w-8 h-8 text-cyan-500" />
                                                    </div>
                                                    <p className="text-sm font-bold text-white mb-1">Click to Upload Images</p>
                                                    <p className="text-xs text-gray-500">Supports PNG, JPG (SVG recommended for icons)</p>
                                                  </label>
                                                </div>

                                                {hero.images?.length > 0 && (
                                                  <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-3">
                                                    {hero.images.map((img, idx) => (
                                                      <div key={img._id} className="group relative aspect-square rounded-xl overflow-hidden border border-gray-800 bg-gray-900">
                                                        <img src={img.url} className="w-full h-full object-cover" alt="" />
                                                        <button
                                                          type="button"
                                                          onClick={() => handleDeleteImage(img._id)}
                                                          className="absolute top-1 right-1 p-1.5 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                                        >
                                                          <XMarkIcon className="w-3 h-3" />
                                                        </button>
                                                      </div>
                                                    ))}
                                                  </div>
                                                )}

                                                {/* Video URL */}
                                                {formData.backgroundType === 'video' && (
                                                  <div className="mt-4">
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
                                              </div>
                                            )}

                                            {/* Submit Buttons - Fixed for better UX */}
                                            <div className="flex gap-4 pt-4 border-t border-gray-800 sticky bottom-0 bg-[#0c0c16] pb-2 z-10">
                                              <button
                                                type="submit"
                                                disabled={loading || uploading}
                                                className="flex-1 bg-linear-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 py-3 rounded-lg font-semibold transition disabled:opacity-50"
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
                                      </div>
                                    )}
                                  </div>
                                </div>
                              ))
                            ) : (
                              <div className="text-center py-6 bg-gray-800/20 rounded-lg border border-dashed border-gray-700">
                                <p className="text-sm text-gray-500">No hero sections found for this page.</p>
                                <button
                                  onClick={() => handleCreateHero(page.pageId, page.pageName)}
                                  className="mt-2 text-xs text-cyan-400 hover:underline"
                                >
                                  + Add First Hero
                                </button>
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                  </div>
                ))}

                {/* Empty Research State */}
                {filteredPages.length === 0 && availablePages.length > 0 && (
                  <div className="text-center py-20 bg-gray-800/5 rounded-3xl border border-dashed border-gray-800">
                    <EyeIcon className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                    <h3 className="text-xl font-bold text-gray-400 mb-2">No results for your criteria</h3>
                    <p className="text-gray-500 mb-6">Try adjusting your filters or search term to find what you need.</p>
                    <button
                      onClick={clearFilters}
                      className="bg-gray-800 hover:bg-gray-700 text-white px-6 py-2 rounded-xl transition-all border border-gray-700"
                    >
                      Reset All Filters
                    </button>
                  </div>
                )}

                {availablePages.length === 0 && (
                  <p className="text-center text-gray-500 py-10 bg-gray-800/10 rounded-xl border border-dashed border-gray-800">
                    No pages found. Create your first page to start adding hero sections.
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Hero Duplicate Modal */}
        {showHeroDuplicateModal && (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-md flex items-center justify-center z-[100] p-4 animate-fadeIn">
            <div className="bg-[#1a1a2e] rounded-3xl border border-white/10 p-6 md:p-8 max-w-xl w-full shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-linear-to-r from-cyan-500 to-blue-600"></div>

              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                  <DocumentDuplicateIcon className="w-6 h-6 text-cyan-400" />
                  Duplicate Hero Section
                </h2>
                <button onClick={() => setShowHeroDuplicateModal(false)} className="text-gray-400 hover:text-white transition">
                  <XMarkIcon className="w-6 h-6" />
                </button>
              </div>

              <form onSubmit={handleDuplicateHeroSubmit} className="space-y-6">
                <div>
                  <label className="block text-[10px] font-bold text-gray-500 uppercase mb-2 ml-1">Hero Name (Internal)</label>
                  <input
                    type="text"
                    value={duplicateHeroForm.heroName}
                    onChange={(e) => setDuplicateHeroForm({ ...duplicateHeroForm, heroName: e.target.value })}
                    className="w-full bg-[#0f0f1a] border border-gray-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-cyan-500 transition-all font-medium"
                    required
                    placeholder="Internal name for management"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-gray-500 uppercase mb-2 ml-1">Hero Title (Display)</label>
                  <input
                    type="text"
                    value={duplicateHeroForm.title}
                    onChange={(e) => setDuplicateHeroForm({ ...duplicateHeroForm, title: e.target.value })}
                    className="w-full bg-[#0f0f1a] border border-gray-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-cyan-500 transition-all font-medium"
                    required
                    placeholder="Main heading text"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-gray-500 uppercase mb-2 ml-1">Target Page</label>
                  <select
                    value={duplicateHeroForm.pageId}
                    onChange={(e) => setDuplicateHeroForm({ ...duplicateHeroForm, pageId: e.target.value })}
                    className="w-full bg-[#0f0f1a] border border-gray-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-cyan-500 transition-all font-medium appearance-none"
                    required
                  >
                    {availablePages.map(page => (
                      <option key={page.pageId} value={page.pageId}>
                        {page.pageName} ({page.pageId})
                      </option>
                    ))}
                  </select>
                  <p className="text-[10px] text-gray-500 mt-2 flex items-center gap-1">
                    <GlobeAltIcon className="w-3 h-3" />
                    You can move this copy to a different page
                  </p>
                </div>

                <div className="flex gap-4 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowHeroDuplicateModal(false)}
                    className="flex-1 px-6 py-3 bg-gray-800 hover:bg-gray-700 text-white rounded-xl font-bold transition-all hover:scale-[1.02]"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isDuplicatingHero}
                    className="flex-1 px-6 py-3 bg-linear-to-r from-cyan-600 to-blue-700 hover:from-cyan-500 hover:to-blue-600 text-white rounded-xl font-bold transition-all shadow-lg shadow-cyan-500/20 flex items-center justify-center gap-2 hover:scale-[1.02]"
                  >
                    {isDuplicatingHero ? (
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    ) : (
                      <DocumentDuplicateIcon className="w-5 h-5" />
                    )}
                    {isDuplicatingHero ? 'Duplicating...' : 'Duplicate Now'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Hero Import Modal */}
        {showImportHeroModal && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-xl flex items-center justify-center z-[100] p-4 animate-fadeIn">
            <div className="bg-[#1a1a2e] rounded-3xl border border-white/10 p-6 md:p-8 max-w-2xl w-full max-h-[90vh] shadow-2xl relative overflow-hidden flex flex-col">
              <div className="absolute top-0 left-0 w-full h-1 bg-linear-to-r from-purple-500 to-cyan-500"></div>

              <div className="flex justify-between items-center mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                    <ArrowPathIcon className="w-6 h-6 text-purple-400" />
                    Import Hero Section
                  </h2>
                  <p className="text-xs text-gray-400 mt-1">Select a hero section from any page to copy here</p>
                </div>
                <button onClick={() => setShowImportHeroModal(false)} className="text-gray-400 hover:text-white transition">
                  <XMarkIcon className="w-6 h-6" />
                </button>
              </div>

              <div className="mb-6 relative">
                <input
                  type="text"
                  placeholder="Search by hero name, title or page..."
                  value={searchImportQuery}
                  onChange={(e) => setSearchImportQuery(e.target.value)}
                  className="w-full bg-[#0f0f1a] border border-gray-700 rounded-xl pl-12 pr-4 py-3 text-white focus:outline-none focus:border-purple-500 transition-all"
                />
                <EyeIcon className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
              </div>

              <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar space-y-3">
                {heroes
                  .filter(h => {
                    const query = searchImportQuery.toLowerCase();
                    return h.heroName?.toLowerCase().includes(query) ||
                      h.title?.toLowerCase().includes(query) ||
                      h.pageName?.toLowerCase().includes(query) ||
                      h.pageId?.toLowerCase().includes(query);
                  })
                  .map(hero => (
                    <div
                      key={hero._id}
                      className="bg-[#0f0f1a] border border-gray-800 rounded-2xl p-4 flex items-center justify-between group hover:border-purple-500/50 transition-all"
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-[10px] bg-purple-500/10 text-purple-400 px-2 py-0.5 rounded border border-purple-500/20 font-bold uppercase tracking-wider">
                            {hero.pageName}
                          </span>
                          <h4 className="text-sm font-bold text-white">{hero.heroName}</h4>
                        </div>
                        <p className="text-xs text-gray-500 italic truncate max-w-[300px]">"{hero.title}"</p>
                      </div>

                      <button
                        onClick={() => handleImportHero(hero)}
                        disabled={isImportingHero}
                        className="bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold px-4 py-2 rounded-lg transition-all flex items-center gap-2 shadow-lg shadow-purple-600/10 disabled:opacity-50"
                      >
                        {isImportingHero ? (
                          <div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        ) : (
                          <PlusIcon className="w-4 h-4" />
                        )}
                        Import
                      </button>
                    </div>
                  ))
                }

                {heroes.filter(h => {
                  const query = searchImportQuery.toLowerCase();
                  return h.heroName?.toLowerCase().includes(query) ||
                    h.title?.toLowerCase().includes(query) ||
                    h.pageName?.toLowerCase().includes(query);
                }).length === 0 && (
                    <div className="text-center py-10">
                      <p className="text-gray-500 text-sm">No heroes found matching your search.</p>
                    </div>
                  )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default HeroManager;
