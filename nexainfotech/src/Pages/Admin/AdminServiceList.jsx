// Done
import { useEffect, useState } from "react";
import axios from "../../Protected/axios"; // ✅ Correct - using custom axios instance
import { useNavigate } from "react-router-dom";
import {
  PlusIcon,
  PencilIcon,
  TrashIcon,
  DocumentTextIcon,
  DocumentDuplicateIcon,
  SparklesIcon,
  CalendarIcon,
  LinkIcon,
  EyeIcon,
  ClipboardIcon,
  CheckCircleIcon,
  XCircleIcon,
  FunnelIcon,
  ArrowPathIcon,
  PhotoIcon,
  DocumentIcon,
  PaintBrushIcon,
  BuildingOfficeIcon,
  GlobeAltIcon,
  ExclamationCircleIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';

export default function AdminServiceList() {
  const [services, setServices] = useState([]);
  const [filteredServices, setFilteredServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteLoading, setDeleteLoading] = useState(null);
  const [copiedSlug, setCopiedSlug] = useState(null);

  // Duplication states
  const [showDuplicateModal, setShowDuplicateModal] = useState(false);
  const [serviceToDuplicate, setServiceToDuplicate] = useState(null);
  const [isDuplicating, setIsDuplicating] = useState(false);
  const [duplicateForm, setDuplicateForm] = useState({
    pageTitle: "",
    slug: "",
    city: "",
    serviceName: "",
    slugType: 'simple',
    autoGenerateSlug: true
  });

  // Filter states
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    search: "",
    hasDescription: "all",
    hasButton: "all",
    hasImage: "all",
    hasRichText: "all",
    slugType: "all",
    sortBy: "newest"
  });

  const navigate = useNavigate();

  const fetchServices = async () => {
    setLoading(true);
    try {
      // ✅ Fixed: Using relative path with axios instance
      const res = await axios.get("/api/services");

      let fetchedServices = [];
      if (res.data.success && Array.isArray(res.data.data)) {
        fetchedServices = res.data.data;
      } else if (Array.isArray(res.data)) {
        fetchedServices = res.data;
      }

      setServices(fetchedServices);
      applyFilters(fetchedServices, filters);
    } catch (error) {
      console.error("Error fetching services:", error);
      if (error.response?.status === 401) {
        navigate("/admin/login");
      } else {
        alert(error.response?.data?.message || "Failed to load services");
      }
    } finally {
      setLoading(false);
    }
  };

  // Apply filters to services
  const applyFilters = (servicesList, currentFilters) => {
    let filtered = [...servicesList];

    // Search filter
    if (currentFilters.search) {
      const searchTerm = currentFilters.search.toLowerCase();
      filtered = filtered.filter(s =>
        s.pageTitle?.toLowerCase().includes(searchTerm) ||
        s.miniDescription?.toLowerCase().includes(searchTerm) ||
        s.slug?.toLowerCase().includes(searchTerm) ||
        s.heroHeading?.text?.toLowerCase().includes(searchTerm) ||
        s.heroImageAlt?.toLowerCase().includes(searchTerm)
      );
    }

    // Description filter
    if (currentFilters.hasDescription === 'yes') {
      filtered = filtered.filter(s => s.miniDescription && s.miniDescription.trim() !== '');
    } else if (currentFilters.hasDescription === 'no') {
      filtered = filtered.filter(s => !s.miniDescription || s.miniDescription.trim() === '');
    }

    // Button filter
    if (currentFilters.hasButton === 'yes') {
      filtered = filtered.filter(s => s.buttonText && s.buttonText.trim() !== '');
    } else if (currentFilters.hasButton === 'no') {
      filtered = filtered.filter(s => !s.buttonText || s.buttonText.trim() === '');
    }

    // Image filter
    if (currentFilters.hasImage === 'yes') {
      filtered = filtered.filter(s => s.heroImage && s.heroImage.trim() !== '');
    } else if (currentFilters.hasImage === 'no') {
      filtered = filtered.filter(s => !s.heroImage || s.heroImage.trim() === '');
    }

    // Rich text filter
    if (currentFilters.hasRichText === 'yes') {
      filtered = filtered.filter(s =>
        (s.heroHeading?.text && s.heroHeading.text.trim() !== '') ||
        (s.heroParagraphs?.length > 0 && s.heroParagraphs[0]?.text)
      );
    } else if (currentFilters.hasRichText === 'no') {
      filtered = filtered.filter(s =>
        (!s.heroHeading?.text || s.heroHeading.text.trim() === '') &&
        (!s.heroParagraphs || s.heroParagraphs.length === 0 || !s.heroParagraphs[0]?.text)
      );
    }

    // Slug type filter
    if (currentFilters.slugType === 'custom') {
      filtered = filtered.filter(s => {
        const generatedFromTitle = s.pageTitle?.toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/^-+|-+$/g, '');
        return s.slug && s.slug !== generatedFromTitle && !s.slug.includes('/');
      });
    } else if (currentFilters.slugType === 'nested') {
      filtered = filtered.filter(s => s.slug && s.slug.includes('/'));
    } else if (currentFilters.slugType === 'default') {
      filtered = filtered.filter(s => {
        const generatedFromTitle = s.pageTitle?.toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/^-+|-+$/g, '');
        return s.slug && s.slug === generatedFromTitle;
      });
    }

    // Sort
    if (currentFilters.sortBy === 'newest') {
      filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    } else if (currentFilters.sortBy === 'oldest') {
      filtered.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
    } else if (currentFilters.sortBy === 'name') {
      filtered.sort((a, b) => (a.pageTitle || '').localeCompare(b.pageTitle || ''));
    }

    setFilteredServices(filtered);
  };

  // Handle filter changes
  const handleFilterChange = (key, value) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    applyFilters(services, newFilters);
  };

  // Reset all filters
  const resetFilters = () => {
    const defaultFilters = {
      search: "",
      hasDescription: "all",
      hasButton: "all",
      hasImage: "all",
      hasRichText: "all",
      slugType: "all",
      sortBy: "newest"
    };
    setFilters(defaultFilters);
    applyFilters(services, defaultFilters);
  };

  useEffect(() => {
    fetchServices();
  }, []);

  const handleDelete = async (id, pageTitle) => {
    if (!window.confirm(`Are you sure you want to delete "${pageTitle}"?`)) return;

    setDeleteLoading(id);
    try {
      // ✅ Fixed: Using relative path with axios instance
      const res = await axios.delete(`/api/services/delete/${id}`);

      if (res.data.success) {
        const updatedServices = services.filter(s => s._id !== id);
        setServices(updatedServices);
        applyFilters(updatedServices, filters);
      }
    } catch (error) {
      console.error("Delete failed:", error);
      if (error.response?.status === 401) {
        navigate("/admin/login");
      } else {
        alert(error.response?.data?.message || "Delete Failed ❌");
      }
    } finally {
      setDeleteLoading(null);
    }
  };

  const handleCopySlug = (slug) => {
    navigator.clipboard.writeText(slug);
    setCopiedSlug(slug);
    setTimeout(() => setCopiedSlug(null), 2000);
  };

  const handlePreview = (slug) => {
    window.open(`/${slug}`, '_blank');
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Duplicate handlers
  const handleDuplicateClick = (service) => {
    setServiceToDuplicate(service);

    // Check if original slug was nested
    const isNested = service.slug && service.slug.includes('/');
    let city = "";
    let serviceName = "";

    if (isNested) {
      const parts = service.slug.split('/');
      city = parts[0];
      serviceName = parts[1] + "-copy";
    }

    setDuplicateForm({
      pageTitle: service.pageTitle + " (Copy)",
      slug: isNested ? "" : (service.slug + "-copy"),
      city: city,
      serviceName: serviceName,
      slugType: isNested ? 'nested' : 'simple',
      autoGenerateSlug: !isNested
    });
    setShowDuplicateModal(true);
  };

  const handleDuplicateSubmit = async (e) => {
    e.preventDefault();
    if (!serviceToDuplicate) return;

    setIsDuplicating(true);
    try {
      const formData = new FormData();

      // Basic info from modal
      formData.append('pageTitle', duplicateForm.pageTitle);
      formData.append('miniDescription', serviceToDuplicate.miniDescription || "");
      formData.append('buttonText', serviceToDuplicate.buttonText || "");

      // Slug logic
      let finalSlug = "";
      if (duplicateForm.slugType === 'nested') {
        const citySlug = duplicateForm.city.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
        const serviceSlug = duplicateForm.serviceName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
        finalSlug = `${citySlug}/${serviceSlug}`;
      } else {
        finalSlug = duplicateForm.slug;
      }
      formData.append('slug', finalSlug);

      // Template data from original service
      formData.append('heroHeading', JSON.stringify(serviceToDuplicate.heroHeading));
      formData.append('heroParagraphs', JSON.stringify(serviceToDuplicate.heroParagraphs));
      formData.append('heroImage', serviceToDuplicate.heroImage || "");
      formData.append('heroImageAlt', serviceToDuplicate.heroImageAlt || "");

      const res = await axios.post("/api/services/add", formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      if (res.data.success) {
        setShowDuplicateModal(false);
        fetchServices();
        alert("Service Duplicated Successfully! 🚀");
      }
    } catch (error) {
      console.error("Duplication failed:", error);
      alert(error.response?.data?.error || "Duplication Failed ❌");
    } finally {
      setIsDuplicating(false);
    }
  };

  // Calculate stats
  const stats = {
    total: services.length,
    filtered: filteredServices.length,
    withCustomSlugs: services.filter(s => {
      const generatedFromTitle = s.pageTitle?.toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');
      return s.slug && s.slug !== generatedFromTitle && !s.slug.includes('/');
    }).length,
    withNestedSlugs: services.filter(s => s.slug && s.slug.includes('/')).length,
    withDescriptions: services.filter(s => s.miniDescription).length,
    withButtons: services.filter(s => s.buttonText).length,
    withImages: services.filter(s => s.heroImage).length,
    withRichText: services.filter(s => s.heroHeading?.text || (s.heroParagraphs?.length > 0 && s.heroParagraphs[0]?.text)).length,
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white text-lg">Loading Services...</p>
        </div>
      </div>
    );
  }

  return (
    <section className="bg-transparent text-white">
      {/* Header */}
      <div className="max-w-7xl mx-auto">
        <div className="mb-10">
          <h1 className="text-4xl font-bold text-cyan-400 mb-4 flex items-center gap-3">
            <SparklesIcon className="w-10 h-10" />
            Services Management
          </h1>
          <p className="text-gray-400">Manage your service pages and rich content</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-linear-to-br from-cyan-900/20 to-blue-900/20 border border-cyan-500/30 rounded-xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Total Services</p>
                <p className="text-3xl font-bold text-white">{stats.total}</p>
              </div>
              <div className="w-12 h-12 bg-cyan-500/20 rounded-lg flex items-center justify-center">
                <DocumentTextIcon className="w-6 h-6 text-cyan-400" />
              </div>
            </div>
          </div>

          <div className="bg-linear-to-br from-purple-900/20 to-pink-900/20 border border-purple-500/30 rounded-xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Custom URLs</p>
                <p className="text-3xl font-bold text-white">{stats.withCustomSlugs + stats.withNestedSlugs}</p>
                <p className="text-xs text-gray-500 mt-1">
                  {stats.withNestedSlugs} nested • {stats.withCustomSlugs} simple
                </p>
              </div>
              <div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center">
                <LinkIcon className="w-6 h-6 text-purple-400" />
              </div>
            </div>
          </div>

          <div className="bg-linear-to-br from-green-900/20 to-emerald-900/20 border border-green-500/30 rounded-xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Rich Content</p>
                <p className="text-3xl font-bold text-white">{stats.withRichText}</p>
                <p className="text-xs text-gray-500 mt-1">
                  {stats.withImages} with images
                </p>
              </div>
              <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center">
                <PaintBrushIcon className="w-6 h-6 text-green-400" />
              </div>
            </div>
          </div>

          <div className="bg-linear-to-br from-yellow-900/20 to-orange-900/20 border border-yellow-500/30 rounded-xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">With Buttons</p>
                <p className="text-3xl font-bold text-white">{stats.withButtons}</p>
                <p className="text-xs text-gray-500 mt-1">
                  {stats.withDescriptions} descriptions
                </p>
              </div>
              <div className="w-12 h-12 bg-yellow-500/20 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Filter Section */}
        <div className="mb-6">
          {/* Search Bar and Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 mb-4">
            {/* Search Input */}
            <div className="flex-1">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search by title, description, slug or rich text..."
                  value={filters.search}
                  onChange={(e) => handleFilterChange('search', e.target.value)}
                  className="w-full bg-[#1a1a2e] border border-gray-700 rounded-lg pl-10 pr-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500 transition"
                />
                <svg className="w-5 h-5 text-gray-500 absolute left-3 top-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                {filters.search && (
                  <button
                    onClick={() => handleFilterChange('search', '')}
                    className="absolute right-3 top-3.5 text-gray-500 hover:text-gray-400"
                  >
                    <XCircleIcon className="w-5 h-5" />
                  </button>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2">
              <button
                onClick={fetchServices}
                className="bg-gray-800 hover:bg-gray-700 px-4 py-3 rounded-lg transition flex items-center gap-2 text-sm border border-gray-700"
                title="Refresh"
              >
                <ArrowPathIcon className="w-4 h-4" />
                <span className="hidden sm:inline">Refresh</span>
              </button>

              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`px-4 py-3 rounded-lg transition flex items-center gap-2 text-sm border ${showFilters
                  ? 'bg-cyan-600 border-cyan-500 text-white'
                  : 'bg-gray-800 border-gray-700 hover:bg-gray-700'
                  }`}
              >
                <FunnelIcon className="w-4 h-4" />
                <span className="hidden sm:inline">Filters</span>
                {Object.values(filters).some(v => v !== 'all' && v !== 'newest' && v !== '') && (
                  <span className="bg-red-500 w-2 h-2 rounded-full"></span>
                )}
              </button>

              <button
                onClick={() => navigate("/admin/add-service")}
                className="bg-linear-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 px-6 py-3 rounded-lg font-semibold transition flex items-center gap-2 shadow-lg"
              >
                <PlusIcon className="w-5 h-5" />
                <span className="hidden sm:inline">Add New</span>
              </button>
            </div>
          </div>

          {/* Filter Panel */}
          {showFilters && (
            <div className="bg-[#1a1a2e] rounded-xl p-6 border border-gray-700 mb-4 animate-fadeIn">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-cyan-400 flex items-center gap-2">
                  <FunnelIcon className="w-5 h-5" />
                  Filter Options
                </h3>
                <button
                  onClick={resetFilters}
                  className="text-sm text-gray-400 hover:text-white transition flex items-center gap-1"
                >
                  <ArrowPathIcon className="w-4 h-4" />
                  Reset All
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Description Filter */}
                <div>
                  <label className="block text-sm text-gray-400 mb-2">Description</label>
                  <select
                    value={filters.hasDescription}
                    onChange={(e) => handleFilterChange('hasDescription', e.target.value)}
                    className="w-full bg-[#0f0f1a] border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-cyan-500"
                  >
                    <option value="all">All</option>
                    <option value="yes">Has Description</option>
                    <option value="no">No Description</option>
                  </select>
                </div>

                {/* Button Filter */}
                <div>
                  <label className="block text-sm text-gray-400 mb-2">Button</label>
                  <select
                    value={filters.hasButton}
                    onChange={(e) => handleFilterChange('hasButton', e.target.value)}
                    className="w-full bg-[#0f0f1a] border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-cyan-500"
                  >
                    <option value="all">All</option>
                    <option value="yes">Has Button</option>
                    <option value="no">No Button</option>
                  </select>
                </div>

                {/* Image Filter */}
                <div>
                  <label className="block text-sm text-gray-400 mb-2">Image</label>
                  <select
                    value={filters.hasImage}
                    onChange={(e) => handleFilterChange('hasImage', e.target.value)}
                    className="w-full bg-[#0f0f1a] border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-cyan-500"
                  >
                    <option value="all">All</option>
                    <option value="yes">Has Image</option>
                    <option value="no">No Image</option>
                  </select>
                </div>

                {/* Rich Text Filter */}
                <div>
                  <label className="block text-sm text-gray-400 mb-2">Rich Text</label>
                  <select
                    value={filters.hasRichText}
                    onChange={(e) => handleFilterChange('hasRichText', e.target.value)}
                    className="w-full bg-[#0f0f1a] border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-cyan-500"
                  >
                    <option value="all">All</option>
                    <option value="yes">Has Rich Text</option>
                    <option value="no">No Rich Text</option>
                  </select>
                </div>

                {/* Slug Type Filter */}
                <div>
                  <label className="block text-sm text-gray-400 mb-2">URL Type</label>
                  <select
                    value={filters.slugType}
                    onChange={(e) => handleFilterChange('slugType', e.target.value)}
                    className="w-full bg-[#0f0f1a] border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-cyan-500"
                  >
                    <option value="all">All URLs</option>
                    <option value="custom">Custom Simple</option>
                    <option value="nested">Location Based</option>
                    <option value="default">Auto-generated</option>
                  </select>
                </div>

                {/* Sort By */}
                <div>
                  <label className="block text-sm text-gray-400 mb-2">Sort By</label>
                  <select
                    value={filters.sortBy}
                    onChange={(e) => handleFilterChange('sortBy', e.target.value)}
                    className="w-full bg-[#0f0f1a] border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-cyan-500"
                  >
                    <option value="newest">Newest First</option>
                    <option value="oldest">Oldest First</option>
                    <option value="name">Name A-Z</option>
                  </select>
                </div>
              </div>

              {/* Active Filters Display */}
              {(filters.search || filters.hasDescription !== 'all' || filters.hasButton !== 'all' ||
                filters.hasImage !== 'all' || filters.hasRichText !== 'all' || filters.slugType !== 'all') && (
                  <div className="mt-4 pt-4 border-t border-gray-700">
                    <p className="text-sm text-gray-400 mb-2">Active Filters:</p>
                    <div className="flex flex-wrap gap-2">
                      {filters.search && (
                        <span className="bg-cyan-500/20 text-cyan-400 px-3 py-1 rounded-full text-xs flex items-center gap-1">
                          Search: "{filters.search}"
                          <button onClick={() => handleFilterChange('search', '')}>
                            <XCircleIcon className="w-3 h-3" />
                          </button>
                        </span>
                      )}
                      {filters.hasDescription !== 'all' && (
                        <span className="bg-green-500/20 text-green-400 px-3 py-1 rounded-full text-xs">
                          {filters.hasDescription === 'yes' ? 'Has Description' : 'No Description'}
                        </span>
                      )}
                      {filters.hasButton !== 'all' && (
                        <span className="bg-yellow-500/20 text-yellow-400 px-3 py-1 rounded-full text-xs">
                          {filters.hasButton === 'yes' ? 'Has Button' : 'No Button'}
                        </span>
                      )}
                      {filters.hasImage !== 'all' && (
                        <span className="bg-purple-500/20 text-purple-400 px-3 py-1 rounded-full text-xs">
                          {filters.hasImage === 'yes' ? 'Has Image' : 'No Image'}
                        </span>
                      )}
                      {filters.hasRichText !== 'all' && (
                        <span className="bg-blue-500/20 text-blue-400 px-3 py-1 rounded-full text-xs">
                          {filters.hasRichText === 'yes' ? 'Has Rich Text' : 'No Rich Text'}
                        </span>
                      )}
                      {filters.slugType !== 'all' && (
                        <span className="bg-pink-500/20 text-pink-400 px-3 py-1 rounded-full text-xs">
                          {filters.slugType === 'custom' ? 'Custom URLs' :
                            filters.slugType === 'nested' ? 'Location Based' : 'Auto-generated URLs'}
                        </span>
                      )}
                    </div>
                  </div>
                )}
            </div>
          )}

          {/* Results Info */}
          <div className="flex justify-between items-center text-sm text-gray-400 mb-2">
            <p>
              Showing <span className="text-white font-medium">{filteredServices.length}</span> of <span className="text-white font-medium">{services.length}</span> services
            </p>
            {filteredServices.length === 0 && services.length > 0 && (
              <button
                onClick={resetFilters}
                className="text-cyan-400 hover:text-cyan-300 transition"
              >
                Clear filters
              </button>
            )}
          </div>
        </div>

        {/* Services List */}
        {filteredServices.length === 0 ? (
          <div className="text-center py-20 bg-[#1a1a2e] rounded-2xl border border-gray-800">
            <DocumentTextIcon className="w-20 h-20 text-gray-600 mx-auto mb-4" />
            <p className="text-gray-400 text-xl mb-2">
              {services.length === 0 ? 'No services found.' : 'No matching services.'}
            </p>
            <p className="text-gray-500 mb-6">
              {services.length === 0
                ? 'Get started by creating your first service'
                : 'Try adjusting your filters'}
            </p>
            {services.length === 0 ? (
              <button
                onClick={() => navigate("/admin/add-service")}
                className="bg-cyan-600 hover:bg-cyan-700 px-6 py-3 rounded-lg transition inline-flex items-center gap-2"
              >
                <PlusIcon className="w-5 h-5" />
                Add Your First Service
              </button>
            ) : (
              <button
                onClick={resetFilters}
                className="bg-gray-700 hover:bg-gray-600 px-6 py-3 rounded-lg transition inline-flex items-center gap-2"
              >
                <FunnelIcon className="w-5 h-5" />
                Clear Filters
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredServices.map((service) => {
              const generatedFromTitle = service.pageTitle?.toLowerCase()
                .replace(/[^a-z0-9]+/g, '-')
                .replace(/^-+|-+$/g, '');
              const isCustomSlug = service.slug && service.slug !== generatedFromTitle && !service.slug.includes('/');
              const isNestedSlug = service.slug && service.slug.includes('/');
              const hasRichText = service.heroHeading?.text || (service.heroParagraphs?.length > 0 && service.heroParagraphs[0]?.text);

              return (
                <div
                  key={service._id}
                  className="bg-[#1a1a2e] rounded-2xl border border-gray-800 overflow-hidden hover:border-cyan-500/50 hover:shadow-lg hover:shadow-cyan-500/10 transition-all duration-300 group"
                >
                  {/* Card Header */}
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-3">
                      <div className="w-10 h-10 bg-cyan-500/20 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                        <DocumentTextIcon className="w-5 h-5 text-cyan-400" />
                      </div>

                      {/* Action Buttons */}
                      <div className="flex gap-1">
                        <button
                          onClick={() => handlePreview(service.slug)}
                          className="p-2 hover:bg-green-500/20 rounded-lg transition group"
                          title="Preview Service"
                        >
                          <EyeIcon className="w-4 h-4 text-green-400 group-hover:scale-110 transition" />
                        </button>

                        <button
                          onClick={() => handleDuplicateClick(service)}
                          className="p-2 hover:bg-cyan-500/20 rounded-lg transition group"
                          title="Duplicate Service"
                        >
                          <DocumentDuplicateIcon className="w-4 h-4 text-cyan-400 group-hover:scale-110 transition" />
                        </button>

                        <button
                          onClick={() => navigate(`/admin/edit/${service._id}`)}
                          className="p-2 hover:bg-yellow-500/20 rounded-lg transition group"
                          title="Edit Service"
                        >
                          <PencilIcon className="w-4 h-4 text-yellow-400 group-hover:scale-110 transition" />
                        </button>

                        <button
                          onClick={() => handleDelete(service._id, service.pageTitle)}
                          disabled={deleteLoading === service._id}
                          className="p-2 hover:bg-red-500/20 rounded-lg transition group"
                          title="Delete Service"
                        >
                          {deleteLoading === service._id ? (
                            <div className="w-4 h-4 border-2 border-red-400 border-t-transparent rounded-full animate-spin"></div>
                          ) : (
                            <TrashIcon className="w-4 h-4 text-red-400 group-hover:scale-110 transition" />
                          )}
                        </button>
                      </div>
                    </div>

                    {/* Content */}
                    <h3 className="text-xl font-semibold text-white mb-2 line-clamp-1">
                      {service.pageTitle}
                    </h3>

                    {service.miniDescription ? (
                      <p className="text-gray-400 text-sm mb-4 line-clamp-2">
                        {service.miniDescription}
                      </p>
                    ) : (
                      <p className="text-gray-600 text-sm mb-4 italic">
                        No description
                      </p>
                    )}

                    {/* Rich Text Indicators */}
                    <div className="flex flex-wrap gap-2 mb-4">
                      {hasRichText && (
                        <span className="inline-flex items-center gap-1 bg-blue-500/20 text-blue-400 px-2 py-1 rounded-full text-xs">
                          <PaintBrushIcon className="w-3 h-3" />
                          Rich Text
                        </span>
                      )}
                      {service.heroImage && (
                        <span className="inline-flex items-center gap-1 bg-purple-500/20 text-purple-400 px-2 py-1 rounded-full text-xs">
                          <PhotoIcon className="w-3 h-3" />
                          Image
                        </span>
                      )}
                      {service.buttonText && (
                        <span className="inline-flex items-center gap-1 bg-cyan-500/20 text-cyan-400 px-2 py-1 rounded-full text-xs">
                          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5" />
                          </svg>
                          {service.buttonText}
                        </span>
                      )}
                    </div>

                    {/* Slug Section */}
                    {service.slug && (
                      <div className="mb-3">
                        <div className="flex items-center gap-2 mb-1">
                          <LinkIcon className={`w-3 h-3 ${isNestedSlug ? 'text-pink-400' : isCustomSlug ? 'text-purple-400' : 'text-gray-500'
                            }`} />
                          <span className="text-xs text-gray-500">URL Slug:</span>
                          {isNestedSlug && (
                            <span className="text-xs bg-pink-500/20 text-pink-400 px-2 py-0.5 rounded-full">
                              Location Based
                            </span>
                          )}
                          {isCustomSlug && !isNestedSlug && (
                            <span className="text-xs bg-purple-500/20 text-purple-400 px-2 py-0.5 rounded-full">
                              Custom
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          <code className="text-xs bg-[#0f0f1a] px-2 py-1 rounded border border-gray-700 text-cyan-400 font-mono flex-1 truncate">
                            /{service.slug}
                          </code>
                          <button
                            onClick={() => handleCopySlug(service.slug)}
                            className="p-1 hover:bg-gray-700 rounded transition group"
                            title="Copy slug"
                          >
                            {copiedSlug === service.slug ? (
                              <CheckCircleIcon className="w-4 h-4 text-green-400" />
                            ) : (
                              <ClipboardIcon className="w-4 h-4 text-gray-400 group-hover:text-white transition" />
                            )}
                          </button>
                        </div>
                      </div>
                    )}

                    {/* Meta Info */}
                    <div className="border-t border-gray-700 pt-4 mt-2">
                      <div className="flex items-center gap-2 text-xs text-gray-500">
                        <CalendarIcon className="w-3 h-3" />
                        <span>{formatDate(service.createdAt)}</span>
                      </div>
                    </div>
                  </div>

                  {/* Card Footer */}
                  <div className="bg-[#0f0f1a] px-6 py-3 border-t border-gray-700">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-gray-500">ID: {service._id?.slice(-6)}</span>
                      <button
                        onClick={() => navigate(`/admin/edit/${service._id}`)}
                        className="text-cyan-400 hover:text-cyan-300 transition flex items-center gap-1"
                      >
                        Edit Details
                        <PencilIcon className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Duplicate Modal */}
      {showDuplicateModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center z-50 p-4 animate-fadeIn">
          <div className="bg-[#1a1a2e] rounded-3xl border border-white/10 p-6 md:p-8 max-w-2xl w-full shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-linear-to-r from-cyan-500 to-blue-600"></div>

            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                <DocumentDuplicateIcon className="w-6 h-6 text-cyan-400" />
                Duplicate Service
              </h2>
              <button onClick={() => setShowDuplicateModal(false)} className="text-gray-400 hover:text-white transition">
                <XCircleIcon className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleDuplicateSubmit} className="space-y-6">
              {/* Title */}
              <div>
                <label className="block text-sm text-gray-400 mb-2">New Page Title</label>
                <input
                  type="text"
                  value={duplicateForm.pageTitle}
                  onChange={(e) => {
                    const val = e.target.value;
                    const newSlug = duplicateForm.autoGenerateSlug && duplicateForm.slugType === 'simple'
                      ? val.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '')
                      : duplicateForm.slug;
                    setDuplicateForm({ ...duplicateForm, pageTitle: val, slug: newSlug });
                  }}
                  className="w-full bg-[#0f0f1a] border border-gray-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-cyan-500 transition"
                  required
                />
              </div>

              {/* URL Type Toggle */}
              <div className="flex gap-2 p-1 bg-[#0f0f1a] rounded-xl border border-gray-800">
                <button
                  type="button"
                  onClick={() => setDuplicateForm({ ...duplicateForm, slugType: 'simple', autoGenerateSlug: true, slug: duplicateForm.pageTitle.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '') })}
                  className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-all ${duplicateForm.slugType === 'simple' ? 'bg-cyan-600 text-white shadow-lg' : 'text-gray-400 hover:text-white'}`}
                >
                  Simple URL
                </button>
                <button
                  type="button"
                  onClick={() => setDuplicateForm({ ...duplicateForm, slugType: 'nested', autoGenerateSlug: false })}
                  className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-all ${duplicateForm.slugType === 'nested' ? 'bg-purple-600 text-white shadow-lg' : 'text-gray-400 hover:text-white'}`}
                >
                  Location Based
                </button>
              </div>

              {duplicateForm.slugType === 'nested' ? (
                <div className="grid grid-cols-2 gap-4 animate-fadeIn">
                  <div>
                    <label className="block text-sm text-gray-400 mb-2">City</label>
                    <input
                      type="text"
                      value={duplicateForm.city}
                      onChange={(e) => setDuplicateForm({ ...duplicateForm, city: e.target.value })}
                      className="w-full bg-[#0f0f1a] border border-gray-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-500"
                      placeholder="e.g., london"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-400 mb-2">Service Name</label>
                    <input
                      type="text"
                      value={duplicateForm.serviceName}
                      onChange={(e) => setDuplicateForm({ ...duplicateForm, serviceName: e.target.value })}
                      className="w-full bg-[#0f0f1a] border border-gray-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-500"
                      placeholder="e.g., seo-services"
                      required
                    />
                  </div>
                </div>
              ) : (
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-sm text-gray-400">URL Slug</label>
                    <button
                      type="button"
                      onClick={() => setDuplicateForm({ ...duplicateForm, autoGenerateSlug: !duplicateForm.autoGenerateSlug })}
                      className={`text-[10px] uppercase tracking-wider px-2 py-0.5 rounded transition ${duplicateForm.autoGenerateSlug ? 'bg-cyan-500/20 text-cyan-400' : 'bg-gray-700 text-gray-400'}`}
                    >
                      {duplicateForm.autoGenerateSlug ? 'Auto Sync' : 'Manual Edit'}
                    </button>
                  </div>
                  <input
                    type="text"
                    value={duplicateForm.slug}
                    onChange={(e) => setDuplicateForm({ ...duplicateForm, slug: e.target.value, autoGenerateSlug: false })}
                    disabled={duplicateForm.autoGenerateSlug}
                    className="w-full bg-[#0f0f1a] border border-gray-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-cyan-500 disabled:opacity-50 disabled:cursor-not-allowed"
                    required
                  />
                </div>
              )}

              {/* URL Preview */}
              <div className="bg-[#0f0f1a] p-4 rounded-xl border border-gray-800">
                <p className="text-xs text-gray-500 mb-1 flex items-center gap-1">
                  <GlobeAltIcon className="w-3 h-3" /> URL Preview:
                </p>
                <code className="text-cyan-400 text-sm font-mono break-all">
                  /services/{duplicateForm.slugType === 'nested'
                    ? `${duplicateForm.city || '{city}'}/${duplicateForm.serviceName || '{service}'}`
                    : (duplicateForm.slug || '{slug}')}
                </code>
              </div>

              <div className="flex gap-4 pt-4">
                <button
                  type="button"
                  onClick={() => setShowDuplicateModal(false)}
                  className="flex-1 px-6 py-3 bg-gray-800 hover:bg-gray-700 text-white rounded-xl font-semibold transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isDuplicating}
                  className="flex-1 px-6 py-3 bg-linear-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white rounded-xl font-semibold transition shadow-lg shadow-cyan-500/20 flex items-center justify-center gap-2"
                >
                  {isDuplicating ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  ) : (
                    <DocumentDuplicateIcon className="w-5 h-5" />
                  )}
                  {isDuplicating ? 'Duplicating...' : 'Duplicate Now'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add animation CSS */}
      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
      `}</style>
    </section>
  );
}
