import React, { useState, useEffect } from "react";
import axios from "../../Protected/axios";
import { Eye, EyeOff } from "lucide-react";

const ManageSeoUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);

  const fetchUsers = async () => {
    try {
      const response = await axios.get("/api/seo/users");
      setUsers(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching SEO users:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingUser) {
        await axios.put(`/api/seo/users/${editingUser._id}`, formData);
        alert("User updated successfully ✅");
      } else {
        await axios.post("/api/seo/users", formData);
        alert("New SEO user created ✅");
      }
      fetchUsers();
      resetForm();
    } catch (error) {
      alert(error.response?.data?.message || "Error saving user data");
    }
  };

  const resetForm = () => {
    setFormData({ email: "", password: "" });
    setEditingUser(null);
    setShowModal(false);
  };

  const handleEdit = (user) => {
    setEditingUser(user);
    setFormData({
      email: user.email,
      password: user.password, // Showing the password as requested
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this SEO user?")) {
      try {
        await axios.delete(`/api/seo/users/${id}`);
        fetchUsers();
      } catch (error) {
        alert("Error deleting user");
      }
    }
  };

  return (
    <div className="bg-[#0c0c16] min-h-screen text-white font-sans pb-10 rounded-xl">
      <div className="flex justify-between items-center p-6 border-b border-gray-800">
        <div>
          <h1 className="text-3xl font-bold">Manage <span className="text-cyan-400">SEO Users</span></h1>
          <p className="text-gray-400 text-sm mt-1">Create and manage access for your SEO specialists.</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="bg-cyan-500 hover:bg-cyan-600 text-white px-6 py-2.5 rounded-xl font-bold transition-all shadow-lg shadow-cyan-500/20 flex items-center gap-2"
        >
          <span>👤+</span> Create New User
        </button>
      </div>

      <div className="p-6">
        {loading ? (
          <div className="text-center py-20">
            <div className="w-12 h-12 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-400">Loading users...</p>
          </div>
        ) : (
          <div className="overflow-x-auto bg-[#111827] rounded-xl border border-gray-800 shadow-2xl">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-800 text-cyan-400 text-xs uppercase tracking-wider font-bold">
                  <th className="p-4">Email Address</th>
                  <th className="p-4">Current Password</th>
                  <th className="p-4">Created Date</th>
                  <th className="p-4">Actions</th>
                </tr>
              </thead>
              <tbody className="text-gray-300">
                {users.map((user) => (
                  <tr key={user._id} className="border-b border-gray-800 hover:bg-white/5 transition-all">
                    <td className="p-4 font-medium text-white">{user.email}</td>
                    <td className="p-4 font-mono text-gray-400">{user.password}</td>
                    <td className="p-4 text-sm text-gray-500">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <button onClick={() => handleEdit(user)} className="text-cyan-400 hover:text-cyan-300 transition-colors bg-cyan-400/10 p-2 rounded-lg" title="Edit/Change Password">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                        </button>
                        <button onClick={() => handleDelete(user._id)} className="text-red-400 hover:text-red-300 transition-colors bg-red-400/10 p-2 rounded-lg" title="Delete">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-4v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {users.length === 0 && (
                  <tr>
                    <td colSpan="4" className="p-12 text-center text-gray-500 italic">No SEO users created yet. Click "Create New User" to get started.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="bg-[#111827] w-full max-w-md rounded-2xl border border-gray-700 shadow-2xl relative animate-in fade-in zoom-in duration-200">
            <button onClick={resetForm} className="absolute top-4 right-4 text-gray-400 hover:text-white transition-all text-xl">✕</button>
            
            <form onSubmit={handleSubmit} className="p-8">
              <h2 className="text-2xl font-bold mb-6 text-cyan-400">{editingUser ? "Edit SEO User" : "Create SEO User"}</h2>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-sm text-gray-400 mb-2">User Email</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full bg-[#0c0c16] border border-gray-700 rounded-lg p-3 focus:outline-none focus:border-cyan-500 text-white transition-all"
                    placeholder="email@example.com"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-2">Password</label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      className="w-full bg-[#0c0c16] border border-gray-700 rounded-lg p-3 focus:outline-none focus:border-cyan-500 text-white font-mono transition-all pr-12"
                      placeholder="Set user password"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-cyan-400 transition-colors"
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                  <p className="text-[10px] text-gray-500 mt-2 italic">Tip: Use a strong password for security.</p>
                </div>
              </div>

              <div className="flex gap-4 mt-8">
                <button
                  type="submit"
                  className="flex-1 bg-cyan-500 hover:bg-cyan-600 text-white font-bold py-3 rounded-xl transition-all shadow-lg shadow-cyan-500/20"
                >
                  {editingUser ? "Update User" : "Create User"}
                </button>
                <button
                  type="button"
                  onClick={resetForm}
                  className="flex-1 bg-gray-800 hover:bg-gray-700 text-white font-bold py-3 rounded-xl transition-all border border-gray-700"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageSeoUsers;
