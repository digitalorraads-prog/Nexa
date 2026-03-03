// src/pages/admin/NavbarEditor.jsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../../Protected/axios"; // ✅ Correct - using custom axios instance

export default function NavbarEditor() {
  const navigate = useNavigate();
  const [navItems, setNavItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showSubItemModal, setShowSubItemModal] = useState(false);
  const [currentParent, setCurrentParent] = useState(null);
  const [message, setMessage] = useState({ type: "", text: "" });
  const [lastUpdated, setLastUpdated] = useState(null);
  const [history, setHistory] = useState([]);
  const [showHistory, setShowHistory] = useState(false);

  // Default navbar structure
  const defaultNavItems = [
    { id: "1", name: "Home", path: "/", type: "link" },
    { id: "2", name: "Blog", path: "/blog", type: "link" },
    { 
      id: "3", 
      name: "Services", 
      type: "dropdown",
      dropdown: [
        { id: "3-1", name: "New York", path: "/services/new-york" },
        { id: "3-2", name: "USA", path: "/services/usa" }
      ]
    },
    { id: "4", name: "About", path: "/about", type: "link" },
    { id: "5", name: "Contact", path: "/contact", type: "link" },
  ];

  // Check auth and load navbar
  useEffect(() => {
    checkAuthAndLoad();
  }, []);

  const checkAuthAndLoad = async () => {
    try {
      // ✅ Fixed: Using relative path with axios instance
      const authResponse = await axios.get("/api/admin/check-auth");
      if (authResponse.data.authenticated) {
        await loadNavItems();
      } else {
        navigate('/admin/login');
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      navigate('/admin/login');
    }
  };

  // Load navbar items from database
  const loadNavItems = async () => {
    setLoading(true);
    try {
      // ✅ Fixed: Using relative path with axios instance
      const response = await axios.get("/api/navbar");
      if (response.data.success) {
        setNavItems(response.data.data);
        setLastUpdated(response.data.lastUpdated);
        
        // Also save to localStorage as backup
        localStorage.setItem("navbarItems", JSON.stringify(response.data.data));
        showMessage("success", "Loaded from database");
      }
    } catch (error) {
      console.error('Error loading navbar:', error);
      
      // Fallback to localStorage
      const saved = localStorage.getItem("navbarItems");
      if (saved) {
        setNavItems(JSON.parse(saved));
        showMessage("warning", "Loaded from local backup (database unavailable)");
      } else {
        setNavItems(defaultNavItems);
        localStorage.setItem("navbarItems", JSON.stringify(defaultNavItems));
        showMessage("info", "Using default navbar");
      }
    } finally {
      setLoading(false);
    }
  };

  // Load history
  const loadHistory = async () => {
    try {
      // ✅ Fixed: Using relative path with axios instance
      const response = await axios.get("/api/navbar/history");
      if (response.data.success) {
        setHistory(response.data.data);
        setShowHistory(true);
      }
    } catch (error) {
      console.error('Error loading history:', error);
      showMessage('error', 'Failed to load history');
    }
  };

  // Form states
  const [editForm, setEditForm] = useState({
    name: "",
    path: "",
    type: "link"
  });

  const [subItemForm, setSubItemForm] = useState({
    name: "",
    path: ""
  });

  const showMessage = (type, text) => {
    setMessage({ type, text });
    setTimeout(() => setMessage({ type: "", text: "" }), 3000);
  };

  // Generate unique ID
  const generateId = () => {
    return Date.now().toString() + Math.random().toString(36).substr(2, 5);
  };

  // Move item up/down
  const moveItem = (index, direction) => {
    const newItems = [...navItems];
    if (direction === "up" && index > 0) {
      [newItems[index - 1], newItems[index]] = [newItems[index], newItems[index - 1]];
    } else if (direction === "down" && index < newItems.length - 1) {
      [newItems[index], newItems[index + 1]] = [newItems[index + 1], newItems[index]];
    }
    setNavItems(newItems);
  };

  // Move sub-item
  const moveSubItem = (parentIndex, subIndex, direction) => {
    const newItems = [...navItems];
    const dropdown = [...newItems[parentIndex].dropdown];
    
    if (direction === "up" && subIndex > 0) {
      [dropdown[subIndex - 1], dropdown[subIndex]] = [dropdown[subIndex], dropdown[subIndex - 1]];
    } else if (direction === "down" && subIndex < dropdown.length - 1) {
      [dropdown[subIndex], dropdown[subIndex + 1]] = [dropdown[subIndex + 1], dropdown[subIndex]];
    }
    
    newItems[parentIndex].dropdown = dropdown;
    setNavItems(newItems);
  };

  // Delete item
  const deleteItem = (index) => {
    if (window.confirm("Are you sure you want to delete this item?")) {
      const newItems = navItems.filter((_, i) => i !== index);
      setNavItems(newItems);
    }
  };

  // Delete sub-item
  const deleteSubItem = (parentIndex, subIndex) => {
    if (window.confirm("Are you sure you want to delete this sub-item?")) {
      const newItems = [...navItems];
      newItems[parentIndex].dropdown = newItems[parentIndex].dropdown.filter((_, i) => i !== subIndex);
      setNavItems(newItems);
    }
  };

  // Add new nav item
  const addNavItem = () => {
    setEditForm({ name: "", path: "", type: "link" });
    setEditingItem(null);
    setShowEditModal(true);
  };

  // Edit nav item
  const editItem = (item, index) => {
    setEditForm({
      name: item.name,
      path: item.path || "",
      type: item.type || "link"
    });
    setEditingItem({ item, index });
    setShowEditModal(true);
  };

  // Edit sub-item
  const editSubItem = (parentIndex, subIndex, subItem) => {
    setCurrentParent({ item: navItems[parentIndex], index: parentIndex });
    setSubItemForm({
      name: subItem.name,
      path: subItem.path
    });
    setEditingItem({ type: 'sub', parentIndex, subIndex, item: subItem });
    setShowSubItemModal(true);
  };

  // Save edit
  const saveEdit = () => {
    if (!editForm.name.trim()) {
      showMessage("error", "Name is required");
      return;
    }

    const newItems = [...navItems];

    if (editingItem !== null) {
      // Edit existing
      if (editForm.type === "dropdown") {
        newItems[editingItem.index] = {
          id: editingItem.item.id,
          name: editForm.name,
          type: "dropdown",
          dropdown: editingItem.item.dropdown || []
        };
      } else {
        newItems[editingItem.index] = {
          id: editingItem.item.id,
          name: editForm.name,
          type: "link",
          path: editForm.path || "/"
        };
      }
    } else {
      // Add new
      const newItem = editForm.type === "dropdown" 
        ? {
            id: generateId(),
            name: editForm.name,
            type: "dropdown",
            dropdown: []
          }
        : {
            id: generateId(),
            name: editForm.name,
            type: "link",
            path: editForm.path || "/"
          };
      
      newItems.push(newItem);
    }

    setNavItems(newItems);
    setShowEditModal(false);
  };

  // Add sub-item
  const addSubItem = (parent) => {
    setCurrentParent(parent);
    setSubItemForm({ name: "", path: "" });
    setEditingItem(null);
    setShowSubItemModal(true);
  };

  // Save sub-item
  const saveSubItem = () => {
    if (!subItemForm.name.trim() || !subItemForm.path.trim()) {
      showMessage("error", "Name and path are required");
      return;
    }

    const newItems = [...navItems];
    
    if (editingItem?.type === 'sub') {
      // Edit existing sub-item
      newItems[editingItem.parentIndex].dropdown[editingItem.subIndex] = {
        id: editingItem.item.id,
        name: subItemForm.name,
        path: subItemForm.path
      };
    } else {
      // Add new sub-item
      if (!newItems[currentParent.index].dropdown) {
        newItems[currentParent.index].dropdown = [];
      }
      
      newItems[currentParent.index].dropdown.push({
        id: generateId(),
        name: subItemForm.name,
        path: subItemForm.path
      });
    }

    setNavItems(newItems);
    setShowSubItemModal(false);
  };

  // Save changes to database
  const saveChanges = async () => {
    try {
      setSaving(true);
      
      console.log("Saving nav items to database:", navItems);
      
      // ✅ Fixed: Using relative path with axios instance
      const response = await axios.put(
        "/api/navbar", 
        { items: navItems }
      );
      
      if (response.data.success) {
        // Save to localStorage as backup
        localStorage.setItem("navbarItems", JSON.stringify(navItems));
        
        // Trigger update events
        window.dispatchEvent(new CustomEvent('navbarUpdated', { 
          detail: navItems 
        }));
        localStorage.setItem('navbarUpdate', Date.now().toString());
        
        setLastUpdated(response.data.lastUpdated);
        showMessage("success", "Navbar updated successfully in database!");
      }
      
    } catch (error) {
      console.error("Save error:", error);
      
      if (error.response?.status === 401) {
        showMessage("error", "Please login again");
        setTimeout(() => navigate('/admin/login'), 2000);
      } else {
        // Fallback to localStorage only
        localStorage.setItem("navbarItems", JSON.stringify(navItems));
        window.dispatchEvent(new CustomEvent('navbarUpdated', { detail: navItems }));
        localStorage.setItem('navbarUpdate', Date.now().toString());
        showMessage("warning", "Saved locally only. Database connection failed.");
      }
    } finally {
      setSaving(false);
    }
  };

  // Reset to default
  const resetToDefault = async () => {
    if (window.confirm("Reset to default navbar? This cannot be undone.")) {
      try {
        setSaving(true);
        // ✅ Fixed: Using relative path with axios instance
        const response = await axios.post("/api/navbar/reset", {});
        
        if (response.data.success) {
          setNavItems(response.data.data);
          localStorage.setItem("navbarItems", JSON.stringify(response.data.data));
          showMessage("success", "Reset to default successfully!");
          
          window.dispatchEvent(new CustomEvent('navbarUpdated', { 
            detail: response.data.data 
          }));
        }
      } catch (error) {
        console.error('Reset error:', error);
        if (error.response?.status === 401) {
          showMessage("error", "Please login again");
        } else {
          // Fallback to local reset
          setNavItems(defaultNavItems);
          localStorage.setItem("navbarItems", JSON.stringify(defaultNavItems));
          window.dispatchEvent(new CustomEvent('navbarUpdated', { detail: defaultNavItems }));
          showMessage("warning", "Reset locally only. Database connection failed.");
        }
      } finally {
        setSaving(false);
      }
    }
  };

  // Restore from history
  const restoreFromHistory = async (version) => {
    if (window.confirm("Restore this version? Current changes will be lost.")) {
      try {
        // ✅ Fixed: Using relative path with axios instance
        const response = await axios.post(`/api/navbar/restore/${version}`, {});
        
        if (response.data.success) {
          setNavItems(response.data.data);
          localStorage.setItem("navbarItems", JSON.stringify(response.data.data));
          setShowHistory(false);
          showMessage("success", `Restored to version ${version}`);
          
          window.dispatchEvent(new CustomEvent('navbarUpdated', { 
            detail: response.data.data 
          }));
        }
      } catch (error) {
        console.error('Restore error:', error);
        showMessage('error', 'Failed to restore version');
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0f] text-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400">Loading navbar editor...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white py-26">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
              NAVBAR EDITOR
            </h1>
            <p className="text-gray-400 mt-2">
              Edit your navbar links and dropdown menus
              {lastUpdated && (
                <span className="ml-4 text-sm text-cyan-400">
                  Last updated: {new Date(lastUpdated).toLocaleString()}
                </span>
              )}
            </p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={loadHistory}
              className="px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg transition"
            >
              View History
            </button>
            <button
              onClick={() => navigate("/admin/dashboard")}
              className="px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition"
            >
              ← Back to Dashboard
            </button>
          </div>
        </div>

        {/* Message */}
        {message.text && (
          <div className={`mb-6 p-4 rounded-lg ${
            message.type === "success" ? "bg-green-500/20 border border-green-500" :
            message.type === "warning" ? "bg-yellow-500/20 border border-yellow-500" :
            message.type === "info" ? "bg-blue-500/20 border border-blue-500" :
            "bg-red-500/20 border border-red-500"
          }`}>
            {message.text}
          </div>
        )}

        {/* History Modal */}
        {showHistory && (
          <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50">
            <div className="bg-[#1a1a2e] rounded-xl p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto">
              <h3 className="text-xl font-bold mb-4">Version History</h3>
              <div className="space-y-3">
                {history.map((version) => (
                  <div 
                    key={version._id}
                    className="bg-[#0f0f1a] p-4 rounded-lg border border-white/10 cursor-pointer hover:border-cyan-500"
                    onClick={() => restoreFromHistory(version.version)}
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="font-medium">
                          Version {version.version} - {new Date(version.lastUpdated).toLocaleString()}
                        </p>
                        <p className="text-sm text-gray-400">
                          Updated by: {version.updatedBy || 'Unknown'}
                        </p>
                      </div>
                      <span className="text-xs bg-cyan-600/30 text-cyan-400 px-2 py-1 rounded">
                        {version.items.length} items
                      </span>
                    </div>
                  </div>
                ))}
              </div>
              <button
                onClick={() => setShowHistory(false)}
                className="mt-4 w-full py-2 bg-gray-700 hover:bg-gray-600 rounded-lg"
              >
                Close
              </button>
            </div>
          </div>
        )}

        {/* Live Preview */}
        <div className="bg-[#1a1a2e] rounded-xl p-6 mb-8 border border-white/10">
          <h2 className="text-xl font-semibold mb-4 text-gray-300">LIVE PREVIEW</h2>
          <div className="bg-[#0f0f1a] p-4 rounded-lg">
            <nav className="flex gap-6 text-white flex-wrap">
              {navItems.map((item, i) => (
                <div key={item.id} className="relative group">
                  {item.type === "dropdown" ? (
                    <div className="flex items-center gap-1 cursor-pointer text-cyan-400">
                      {item.name} ▼
                      <div className="absolute top-full left-0 mt-2 w-48 bg-[#1a1a2e] rounded-lg shadow-xl hidden group-hover:block z-50">
                        {item.dropdown?.map((sub) => (
                          <div key={sub.id} className="px-4 py-2 hover:bg-cyan-600 hover:text-white transition">
                            {sub.name}
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <span className="hover:text-cyan-400 transition cursor-pointer">{item.name}</span>
                  )}
                </div>
              ))}
            </nav>
          </div>
        </div>

        {/* Editor Grid - Same as before but with updated save button */}
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Left Column - Main Items */}
          <div className="bg-[#1a1a2e] rounded-xl p-6 border border-white/10">
            <h2 className="text-xl font-semibold mb-4">MAIN MENU ITEMS</h2>
            <div className="space-y-3 max-h-[600px] overflow-y-auto pr-2">
              {navItems.map((item, index) => (
                <div key={item.id} className="bg-[#0f0f1a] rounded-lg p-4 border border-white/5">
                  {/* Same item rendering code as before */}
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <span className="font-medium text-lg">{item.name}</span>
                      <span className="text-sm text-gray-400 ml-2">{item.path || "/"}</span>
                      {item.type === "dropdown" && (
                        <span className="ml-2 text-xs bg-cyan-600/30 text-cyan-400 px-2 py-1 rounded">
                          DROPDOWN ({item.dropdown?.length || 0})
                        </span>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => moveItem(index, "up")}
                        className="p-1 hover:bg-gray-700 rounded disabled:opacity-30"
                        disabled={index === 0}
                        title="Move up"
                      >
                        ↑
                      </button>
                      <button
                        onClick={() => moveItem(index, "down")}
                        className="p-1 hover:bg-gray-700 rounded disabled:opacity-30"
                        disabled={index === navItems.length - 1}
                        title="Move down"
                      >
                        ↓
                      </button>
                      <button
                        onClick={() => editItem(item, index)}
                        className="px-3 py-1 bg-blue-600 hover:bg-blue-700 rounded text-sm"
                      >
                        EDIT
                      </button>
                      <button
                        onClick={() => deleteItem(index)}
                        className="px-3 py-1 bg-red-600 hover:bg-red-700 rounded text-sm"
                      >
                        DELETE
                      </button>
                      {item.type === "dropdown" && (
                        <button
                          onClick={() => addSubItem({ item, index })}
                          className="px-3 py-1 bg-green-600 hover:bg-green-700 rounded text-sm"
                        >
                          ADD SUB-ITEM
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Sub-items */}
                  {item.type === "dropdown" && item.dropdown && item.dropdown.length > 0 && (
                    <div className="ml-6 mt-3 space-y-2 border-l-2 border-cyan-500/30 pl-4">
                      {item.dropdown.map((subItem, subIndex) => (
                        <div key={subItem.id} className="flex items-center justify-between bg-[#1a1a2e] p-2 rounded">
                          <div>
                            <span className="text-sm">{subItem.name}</span>
                            <span className="text-xs text-gray-400 ml-2">{subItem.path}</span>
                          </div>
                          <div className="flex gap-1">
                            <button
                              onClick={() => moveSubItem(index, subIndex, "up")}
                              className="p-1 hover:bg-gray-700 rounded text-xs disabled:opacity-30"
                              disabled={subIndex === 0}
                            >
                              ↑
                            </button>
                            <button
                              onClick={() => moveSubItem(index, subIndex, "down")}
                              className="p-1 hover:bg-gray-700 rounded text-xs disabled:opacity-30"
                              disabled={subIndex === item.dropdown.length - 1}
                            >
                              ↓
                            </button>
                            <button 
                              onClick={() => editSubItem(index, subIndex, subItem)}
                              className="px-2 py-1 bg-blue-600 hover:bg-blue-700 rounded text-xs"
                            >
                              EDIT
                            </button>
                            <button
                              onClick={() => deleteSubItem(index, subIndex)}
                              className="px-2 py-1 bg-red-600 hover:bg-red-700 rounded text-xs"
                            >
                              REMOVE
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div className="flex gap-4 mt-6">
              <button
                onClick={resetToDefault}
                disabled={saving}
                className="px-6 py-3 bg-gray-700 hover:bg-gray-600 rounded-lg font-medium transition disabled:opacity-50"
              >
                RESET TO DEFAULT
              </button>
              <button
                onClick={addNavItem}
                disabled={saving}
                className="px-6 py-3 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 rounded-lg font-medium transition disabled:opacity-50"
              >
                + ADD NAV ITEM
              </button>
            </div>
          </div>

          {/* Right Column - Structure & Save */}
          <div className="bg-[#1a1a2e] rounded-xl p-6 border border-white/10">
            <h2 className="text-xl font-semibold mb-4">CURRENT STRUCTURE</h2>
            <div className="space-y-2 font-mono text-sm bg-[#0f0f1a] p-4 rounded-lg max-h-[400px] overflow-y-auto">
              {navItems.map((item) => (
                <div key={item.id} className="border-l-2 border-gray-700 pl-4 py-1">
                  <div className="text-cyan-400">
                    📁 {item.name} 
                    {item.type === "link" && <span className="text-gray-400"> → {item.path}</span>}
                  </div>
                  {item.type === "dropdown" && item.dropdown && item.dropdown.length > 0 && (
                    <div className="ml-4 mt-1 space-y-1">
                      <div className="text-yellow-400 text-xs">└─ DROPDOWN ITEMS</div>
                      {item.dropdown.map((sub) => (
                        <div key={sub.id} className="text-gray-300 ml-4">
                          <span className="text-green-400">├─</span> {sub.name} <span className="text-gray-500">({sub.path})</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Save Button */}
            <div className="mt-8">
              <button
                onClick={saveChanges}
                disabled={saving}
                className="w-full py-4 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 rounded-xl font-bold text-lg transition disabled:opacity-50"
              >
                {saving ? "SAVING TO DATABASE..." : "SAVE CHANGES TO DATABASE"}
              </button>
              <p className="text-center text-gray-400 text-sm mt-2">
                Changes are saved to database (with localStorage backup)
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Modal - Same as before */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50">
          <div className="bg-[#1a1a2e] rounded-xl p-6 max-w-md w-full">
            <h3 className="text-xl font-bold mb-4">{editingItem ? "Edit Item" : "Add New Item"}</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-gray-400 mb-1">Name</label>
                <input
                  type="text"
                  value={editForm.name}
                  onChange={(e) => setEditForm({...editForm, name: e.target.value})}
                  className="w-full bg-[#0f0f1a] border border-white/10 rounded-lg px-4 py-2 text-white"
                  placeholder="e.g., Home"
                  autoFocus
                />
              </div>

              <div className="flex gap-4">
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    checked={editForm.type === "link"}
                    onChange={() => setEditForm({...editForm, type: "link"})}
                  />
                  <span>Link</span>
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    checked={editForm.type === "dropdown"}
                    onChange={() => setEditForm({...editForm, type: "dropdown"})}
                  />
                  <span>Dropdown</span>
                </label>
              </div>

              {editForm.type === "link" && (
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Path</label>
                  <input
                    type="text"
                    value={editForm.path}
                    onChange={(e) => setEditForm({...editForm, path: e.target.value})}
                    className="w-full bg-[#0f0f1a] border border-white/10 rounded-lg px-4 py-2 text-white"
                    placeholder="/about"
                  />
                </div>
              )}

              <div className="flex gap-3 mt-6">
                <button
                  onClick={saveEdit}
                  className="flex-1 bg-cyan-600 hover:bg-cyan-700 py-2 rounded-lg"
                >
                  Save
                </button>
                <button
                  onClick={() => setShowEditModal(false)}
                  className="flex-1 bg-gray-700 hover:bg-gray-600 py-2 rounded-lg"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Sub-item Modal - Same as before */}
      {showSubItemModal && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50">
          <div className="bg-[#1a1a2e] rounded-xl p-6 max-w-md w-full">
            <h3 className="text-xl font-bold mb-4">
              {editingItem?.type === 'sub' ? 'Edit Sub-Item' : `Add Sub-Item to ${currentParent?.item?.name}`}
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-gray-400 mb-1">Name</label>
                <input
                  type="text"
                  value={subItemForm.name}
                  onChange={(e) => setSubItemForm({...subItemForm, name: e.target.value})}
                  className="w-full bg-[#0f0f1a] border border-white/10 rounded-lg px-4 py-2 text-white"
                  placeholder="e.g., New York"
                  autoFocus
                />
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-1">Path</label>
                <input
                  type="text"
                  value={subItemForm.path}
                  onChange={(e) => setSubItemForm({...subItemForm, path: e.target.value})}
                  className="w-full bg-[#0f0f1a] border border-white/10 rounded-lg px-4 py-2 text-white"
                  placeholder="/services/new-york"
                />
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  onClick={saveSubItem}
                  className="flex-1 bg-green-600 hover:bg-green-700 py-2 rounded-lg"
                >
                  {editingItem?.type === 'sub' ? 'Update' : 'Add'}
                </button>
                <button
                  onClick={() => setShowSubItemModal(false)}
                  className="flex-1 bg-gray-700 hover:bg-gray-600 py-2 rounded-lg"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}