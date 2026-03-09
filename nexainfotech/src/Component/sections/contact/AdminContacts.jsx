import { useEffect, useState } from "react";
import axios from "../../../Protected/axios";
import {
  EnvelopeIcon,
  PhoneIcon,
  UserIcon,
  CalendarIcon,
  CheckCircleIcon,
  EyeIcon,
  TrashIcon,
  ClockIcon
} from '@heroicons/react/24/outline';
import { useNavigate } from "react-router-dom";

export default function AdminContacts() {
  const navigate = useNavigate();
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState(null);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchContacts();
  }, []);

  const fetchContacts = async () => {
    try {
      const response = await axios.get("/api/contact");
      setContacts(response.data.data || response.data || []);
    } catch (error) {
      console.log(error);
      if (error.response?.status === 401) {
        navigate("/admin/login");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this message?")) return;

    try {
      await axios.delete(`/api/contact/${id}`);
      setContacts((prev) => prev.filter((item) => item._id !== id));
    } catch (error) {
      if (error.response?.status === 401) {
        navigate("/admin/login");
      } else {
        alert("Delete Failed ❌");
      }
    }
  };

  const handleMarkAsRead = async (id) => {
    try {
      const response = await axios.patch(`/api/contact/${id}/read`);
      setContacts((prev) =>
        prev.map((item) =>
          item._id === id ? response.data.data : item
        )
      );
    } catch (error) {
      if (error.response?.status === 401) {
        navigate("/admin/login");
      } else {
        alert("Mark as Read Failed ❌");
      }
    }
  };

  const filteredContacts = contacts.filter(item => {
    const matchesFilter = filter === 'all' ||
      (filter === 'read' && item.isRead) ||
      (filter === 'unread' && !item.isRead);

    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.message.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesFilter && matchesSearch;
  });

  const stats = {
    total: contacts.length,
    read: contacts.filter(c => c.isRead).length,
    unread: contacts.filter(c => !c.isRead).length
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white text-lg">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <section className="bg-transparent text-white">
      {/* Header */}
      <div className="mb-10">
        <h1 className="text-4xl font-bold text-cyan-400 mb-4">
          Contact Messages
        </h1>
        <p className="text-gray-400">Manage and respond to user inquiries</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <div className="bg-cyan-900/20 border border-cyan-500 rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Total Messages</p>
              <p className="text-3xl font-bold text-white">{stats.total}</p>
            </div>
            <EnvelopeIcon className="w-10 h-10 text-cyan-400" />
          </div>
        </div>

        <div className="bg-green-900/30 border border-green-500 rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Read</p>
              <p className="text-3xl font-bold text-green-400">{stats.read}</p>
            </div>
            <CheckCircleIcon className="w-10 h-10 text-green-400" />
          </div>
        </div>

        <div className="bg-yellow-900/20 border border-yellow-500 rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Unread</p>
              <p className="text-3xl font-bold text-yellow-400">{stats.unread}</p>
            </div>
            <ClockIcon className="w-10 h-10 text-yellow-400" />
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="mb-8 flex flex-col sm:flex-row gap-4">
        <div className="flex gap-2">
          {['all', 'unread', 'read'].map((filterOption) => (
            <button
              key={filterOption}
              onClick={() => setFilter(filterOption)}
              className={`px-4 py-2 rounded-lg capitalize transition-all ${filter === filterOption
                  ? 'bg-cyan-500 text-white'
                  : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                }`}
            >
              {filterOption}
            </button>
          ))}
        </div>

        <input
          type="text"
          placeholder="Search by name, email or message..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-1 px-4 py-2 bg-[#1f2937] border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400"
        />
      </div>

      {/* Messages List */}
      {filteredContacts.length === 0 ? (
        <div className="text-center py-20">
          <EnvelopeIcon className="w-20 h-20 text-gray-600 mx-auto mb-4" />
          <p className="text-gray-400 text-xl">No messages found.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {filteredContacts.map((item) => (
            <div
              key={item._id}
              className={`p-6 rounded-2xl border transition-all duration-300 ${item.isRead
                  ? "bg-green-900/30 border-green-500"
                  : "bg-cyan-900/20 border-cyan-500"
                }`}
            >
              {/* Header */}
              <div className="flex flex-wrap justify-between items-start mb-4">
                <div className="flex items-center gap-2 mb-2 sm:mb-0">
                  <UserIcon className="w-5 h-5 text-gray-400" />
                  <p className="text-white">
                    <span className="text-gray-400">Name:</span> {item.name}
                  </p>
                  {item.isRead ? (
                    <span className="px-2 py-1 bg-green-500/20 text-green-400 text-xs rounded-full flex items-center gap-1">
                      <CheckCircleIcon className="w-3 h-3" /> Read
                    </span>
                  ) : (
                    <span className="px-2 py-1 bg-yellow-500/20 text-yellow-400 text-xs rounded-full">
                      New
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-400">
                  <CalendarIcon className="w-4 h-4" />
                  {new Date(item.createdAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </div>
              </div>

              {/* Contact Info */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
                <div className="flex items-center gap-2">
                  <EnvelopeIcon className="w-4 h-4 text-cyan-400" />
                  <p className="text-white">
                    <span className="text-gray-400">Email:</span> {item.email}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <PhoneIcon className="w-4 h-4 text-cyan-400" />
                  <p className="text-white">
                    <span className="text-gray-400">Phone:</span> {item.phone}
                  </p>
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-wrap gap-3">
                {!item.isRead && (
                  <button
                    onClick={() => handleMarkAsRead(item._id)}
                    className="bg-yellow-600 px-4 py-1 rounded hover:bg-yellow-700 transition flex items-center gap-2"
                  >
                    <CheckCircleIcon className="w-4 h-4" />
                    Mark as Read
                  </button>
                )}

                <button
                  onClick={() => setExpandedId(expandedId === item._id ? null : item._id)}
                  className="bg-cyan-600 px-4 py-1 rounded hover:bg-cyan-700 transition flex items-center gap-2"
                >
                  <EyeIcon className="w-4 h-4" />
                  {expandedId === item._id ? "Hide" : "View"}
                </button>

                <button
                  onClick={() => handleDelete(item._id)}
                  className="bg-red-600 px-4 py-1 rounded hover:bg-red-700 transition flex items-center gap-2"
                >
                  <TrashIcon className="w-4 h-4" />
                  Delete
                </button>
              </div>

              {/* Expanded Message */}
              {expandedId === item._id && (
                <div className="mt-4 text-gray-300">
                  <p className="mt-2 p-4 bg-black/20 rounded-lg border border-gray-700">
                    {item.message}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </section>
  );
}