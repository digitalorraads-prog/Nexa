import React, { useState, useEffect, useMemo } from "react";
import axios from "../../Protected/axios";

const SeoReport = () => {
    const [seos, setSeos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");

    const fetchSeos = async () => {
        try {
            const response = await axios.get("/api/seo");
            setSeos(response.data);
            setLoading(false);
        } catch (error) {
            console.error("Error fetching SEO data:", error);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSeos();
    }, []);

    // Aggregate data by user
    const userStats = useMemo(() => {
        const stats = {};
        seos.forEach(seo => {
            const creator = seo.createdBy || "Unknown";
            const updater = seo.updatedBy || "Unknown";
            
            // Track creations
            if (!stats[creator]) stats[creator] = { created: 0, updated: 0, totalActions: 0 };
            stats[creator].created += 1;
            stats[creator].totalActions += 1;
            
            // Track updates (only if different from creator or if explicit update exists)
            if (updater !== creator) {
                if (!stats[updater]) stats[updater] = { created: 0, updated: 0, totalActions: 0 };
                stats[updater].updated += 1;
                stats[updater].totalActions += 1;
            } else if (seo.updatedAt && new Date(seo.updatedAt).getTime() > new Date(seo.createdAt || 0).getTime() + 1000) {
                // Same person, but updated later
                stats[updater].updated += 1;
                stats[updater].totalActions += 1;
            }
        });
        return Object.entries(stats).map(([email, data]) => ({ email, ...data }))
            .sort((a, b) => b.totalActions - a.totalActions);
    }, [seos]);

    const [selectedHistory, setSelectedHistory] = useState(null);

    const activityLog = useMemo(() => {
        let logs = [];
        seos.forEach(seo => {
            // Add initial creation
            logs.push({
                id: seo._id + "_created",
                url: seo.pageUrl,
                user: seo.createdBy || "Admin",
                date: new Date(seo.createdAt),
                type: "Created",
                changes: null
            });

            // Add history updates
            if (seo.history && seo.history.length > 0) {
                seo.history.forEach((h, idx) => {
                    logs.push({
                        id: seo._id + "_h_" + idx,
                        url: seo.pageUrl,
                        user: h.updatedBy || "Unknown",
                        date: new Date(h.updatedAt),
                        type: "Updated",
                        changes: h.changes
                    });
                });
            }
        });

        if (searchTerm) {
            logs = logs.filter(log => 
                log.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
                log.url.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        return logs.sort((a, b) => b.date - a.date);
    }, [seos, searchTerm]);

    return (
        <div className="bg-[#0c0c16] min-h-screen text-white font-sans pb-10 rounded-xl relative">
            {/* History Details Modal */}
            {selectedHistory && (
                <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
                    <div className="bg-[#111827] border border-gray-800 w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
                        <div className="p-6 border-b border-gray-800 flex justify-between items-center bg-gray-900/50">
                            <div>
                                <h2 className="text-xl font-bold flex items-center gap-2">
                                    <span className="text-cyan-400">Changed Details</span>
                                </h2>
                                <p className="text-gray-500 text-xs mt-1">Work by {selectedHistory.user} on {selectedHistory.url}</p>
                            </div>
                            <button onClick={() => setSelectedHistory(null)} className="text-gray-500 hover:text-white text-2xl">&times;</button>
                        </div>
                        <div className="p-6 max-h-[60vh] overflow-y-auto">
                            <div className="space-y-4">
                                {selectedHistory.changes.map((change, idx) => (
                                    <div key={idx} className="bg-gray-800/30 p-4 rounded-xl border border-gray-800/50">
                                        <p className="text-cyan-400 text-[10px] font-bold uppercase mb-2">Field: {change.field}</p>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div className="space-y-1">
                                                <p className="text-gray-500 text-[9px] uppercase font-bold">Old Value</p>
                                                <p className="text-red-400/80 text-xs bg-red-500/5 p-2 rounded border border-red-500/10 line-through truncate" title={change.oldValue}>
                                                    {change.oldValue || "(Empty)"}
                                                </p>
                                            </div>
                                            <div className="space-y-1">
                                                <p className="text-gray-500 text-[9px] uppercase font-bold">New Value</p>
                                                <p className="text-green-400 text-xs bg-green-500/5 p-2 rounded border border-green-500/10 break-words" title={change.newValue}>
                                                    {change.newValue || "(Cleared)"}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="p-4 bg-gray-900/50 border-t border-gray-800 flex justify-end">
                            <button 
                                onClick={() => setSelectedHistory(null)}
                                className="px-6 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg text-sm font-bold transition-all"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Header Section */}
            <div className="p-6 border-b border-gray-800">
                <h1 className="text-3xl font-bold">SEO <span className="text-cyan-400">Activity Report</span></h1>
                <p className="text-gray-400 text-sm mt-1">Track productivity and work log for all SEO specialists.</p>
            </div>

            <div className="p-6">
                {loading ? (
                    <div className="text-center py-20">
                        <div className="w-12 h-12 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                        <p className="text-gray-400">Generating report...</p>
                    </div>
                ) : (
                    <>
                        {/* Summary Cards */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                            {userStats.slice(0, 4).map((stat, idx) => (
                                <div key={idx} className="bg-[#111827] p-6 rounded-2xl border border-gray-800 shadow-xl border-l-4 border-l-cyan-500">
                                    <p className="text-cyan-400 text-xs font-bold uppercase mb-2 truncate" title={stat.email}>{stat.email}</p>
                                    <div className="flex justify-between items-end">
                                        <div>
                                            <p className="text-2xl font-bold">{stat.totalActions}</p>
                                            <p className="text-gray-500 text-[10px]">Total Contributions</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-green-400 text-sm font-bold">{stat.created} <span className="text-[10px] text-gray-500">New</span></p>
                                            <p className="text-purple-400 text-sm font-bold">{stat.updated} <span className="text-[10px] text-gray-500">Edits</span></p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Search bar */}
                        <div className="mb-6 relative max-w-md">
                            <input 
                                type="text"
                                placeholder="Search by User or URL..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full bg-[#111827] border border-gray-700 rounded-xl px-10 py-3 text-sm outline-none focus:border-cyan-500 transition-all"
                            />
                            <span className="absolute left-3 top-3.5 text-gray-500">🔍</span>
                        </div>

                        {/* Activity Table */}
                        <div className="bg-[#111827] rounded-2xl border border-gray-800 shadow-2xl overflow-hidden">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-gray-800/50 text-cyan-400 text-[10px] uppercase font-bold tracking-wider">
                                        <th className="p-4">User Specialist</th>
                                        <th className="p-4">Page / Resource</th>
                                        <th className="p-4">Action</th>
                                        <th className="p-4">Date & Time</th>
                                        <th className="p-4 text-center">Details</th>
                                    </tr>
                                </thead>
                                <tbody className="text-gray-300">
                                    {activityLog.map((log) => (
                                        <tr key={log.id} className="border-b border-gray-800 hover:bg-white/5 transition-all">
                                            <td className="p-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 rounded-full bg-cyan-500/20 flex items-center justify-center text-cyan-400 font-bold text-xs uppercase">
                                                        {log.user.charAt(0)}
                                                    </div>
                                                    <span className="text-sm font-medium">{log.user}</span>
                                                </div>
                                            </td>
                                            <td className="p-4">
                                                <span className="text-cyan-400/80 text-xs font-mono break-all">{log.url}</span>
                                            </td>
                                            <td className="p-4">
                                                <span className={`px-2 py-1 rounded-md text-[9px] font-bold uppercase ${
                                                    log.type === "Updated" 
                                                    ? "bg-purple-500/10 text-purple-400 border border-purple-500/20" 
                                                    : "bg-green-500/10 text-green-400 border border-green-500/20"
                                                }`}>
                                                    {log.type}
                                                </span>
                                            </td>
                                            <td className="p-4 text-xs text-gray-500">
                                                {log.date.toLocaleString()}
                                            </td>
                                            <td className="p-4 text-center">
                                                {log.changes ? (
                                                    <button 
                                                        onClick={() => setSelectedHistory(log)}
                                                        className="px-3 py-1 bg-cyan-500/10 text-cyan-400 rounded-md text-[10px] font-bold hover:bg-cyan-500 hover:text-white transition-all border border-cyan-500/20"
                                                    >
                                                        Highlights
                                                    </button>
                                                ) : (
                                                    <span className="text-gray-700 text-[10px]">Initial View</span>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                    {activityLog.length === 0 && (
                                        <tr>
                                            <td colSpan="5" className="p-10 text-center text-gray-500 italic">No activity logs found.</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default SeoReport;
