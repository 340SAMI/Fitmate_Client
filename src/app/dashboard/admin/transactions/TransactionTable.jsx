"use client";
import { useState, useEffect, useCallback } from "react";
import { Search } from "lucide-react";
import { getPurchase } from "@/lib/api/purchase.";


const STATUS_STYLE =
  "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20";

export default function ManageTransactionTable() {
  const [purchases, setPurchases] = useState([]);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchPurchases = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (search) params.set("search", search);
    const res = await getPurchase(null, null, params.toString());
    setPurchases(res?.purchases || []);
    setTotal(res?.total || 0);
    setLoading(false);
  }, [search]);

  useEffect(() => {
    const t = setTimeout(fetchPurchases, 300);
    return () => clearTimeout(t);
  }, [fetchPurchases]);

  const totalRevenue = purchases.reduce((sum, p) => sum + (Number(p.mainPrice) || 0), 0);

  return (
    <div
      className="min-h-screen"
      style={{ backgroundColor: "#11131A", color: "#fff", fontFamily: "Inter, sans-serif" }}
    >
      <div className="max-w-7xl mx-auto px-8 py-8">

        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">

          {/* Total Revenue */}
          <div className="relative bg-[#1A1D28] border border-white/[0.06] rounded-xl p-5 overflow-hidden shadow-sm">
            <p className="text-[10.5px] font-semibold uppercase tracking-widest text-white/40 mb-3">Total Revenue</p>
            <div className="absolute top-4 right-4 w-9 h-9 rounded-[9px] bg-emerald-500/10 flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8} className="text-emerald-400">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <p className="text-[28px] font-bold text-emerald-400 leading-none">
              ${totalRevenue.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </p>
          </div>

          {/* Total Transactions */}
          <div className="relative bg-[#1A1D28] border border-white/[0.06] rounded-xl p-5 overflow-hidden shadow-sm">
            <p className="text-[10.5px] font-semibold uppercase tracking-widest text-white/40 mb-3">Transactions</p>
            <div className="absolute top-4 right-4 w-9 h-9 rounded-[9px] bg-blue-500/10 flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8} className="text-blue-400">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
              </svg>
            </div>
            <p className="text-[28px] font-bold text-blue-400 leading-none">{total.toLocaleString()}</p>
          </div>

          {/* Avg. Per Booking */}
          <div className="relative bg-[#1A1D28] border border-white/[0.06] rounded-xl p-5 overflow-hidden shadow-sm">
            <p className="text-[10.5px] font-semibold uppercase tracking-widest text-white/40 mb-3">Avg. Per Booking</p>
            <div className="absolute top-4 right-4 w-9 h-9 rounded-[9px] bg-violet-500/10 flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8} className="text-violet-400">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <p className="text-[28px] font-bold text-violet-400 leading-none">
              ${purchases.length > 0
                ? (totalRevenue / purchases.length).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })
                : "0.00"}
            </p>
          </div>

        </div>

        {/* Table Card */}
        <div className="rounded-xl" style={{ backgroundColor: "#1A1D28", border: "1px solid rgba(255,255,255,0.06)" }}>

          {/* Header */}
          <div
            className="flex items-center justify-between px-6 py-5 flex-wrap gap-3"
            style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}
          >
            <div>
              <h2 className="text-base font-semibold text-white">Payment History</h2>
              <p className="text-sm text-gray-400 mt-0.5">All transactions — read only</p>
            </div>
            <div
              className="flex items-center gap-2 px-3 py-2 rounded-lg"
              style={{ backgroundColor: "#11131A", border: "1px solid rgba(255,255,255,0.08)", width: 240 }}
            >
              <Search size={14} className="text-gray-500 shrink-0" />
              <input
                type="text"
                placeholder="Search by email or class…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="bg-transparent text-sm text-gray-300 placeholder-gray-600 outline-none w-full"
              />
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                  {["User Email", "Class", "Amount", "Date", "Transaction ID", "Status"].map((h) => (
                    <th
                      key={h}
                      className="text-left px-6 py-3 text-xs font-semibold uppercase tracking-wider text-gray-500"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={6} className="text-center py-10 text-gray-500 text-sm">Loading…</td>
                  </tr>
                ) : purchases.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="text-center py-10 text-gray-500 text-sm">No transactions found</td>
                  </tr>
                ) : purchases.map((tx, i) => (
                  <tr
                    key={tx._id}
                    style={{
                      borderBottom: i < purchases.length - 1 ? "1px solid rgba(255,255,255,0.04)" : "none",
                      height: 64,
                    }}
                    className="hover:bg-white/[0.02] transition-colors"
                  >
                    {/* User Email */}
                    <td className="px-6">
                      <span className="text-sm font-medium text-white">{tx.userEmail || "—"}</span>
                    </td>

                    {/* Class Name */}
                    <td className="px-6">
                      <span className="text-sm text-gray-400">{tx.name || "—"}</span>
                    </td>

                    {/* Amount — mainPrice is the human-readable dollar amount */}
                    <td className="px-6">
                      <span className="text-sm font-bold text-emerald-400">
                        ${Number(tx.mainPrice || 0).toFixed(2)}
                      </span>
                    </td>

                    {/* Date */}
                    <td className="px-6">
                      <span className="text-xs text-gray-500 whitespace-nowrap">
                        {tx.createdAt
                          ? new Date(tx.createdAt).toLocaleDateString("en-US", {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                            })
                          : "—"}
                      </span>
                    </td>

                    {/* Transaction ID — using _id as the identifier */}
                    <td className="px-6">
                      <span className="text-xs font-mono text-gray-600 select-all">
                        {tx._id}
                      </span>
                    </td>

                    {/* Status — always Paid since purchases exist */}
                    <td className="px-6">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${STATUS_STYLE}`}>
                        Paid
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Footer */}
          <div
            className="flex items-center justify-between px-6 py-4"
            style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}
          >
            <p className="text-sm text-gray-500">Showing {purchases.length} of {total} transactions</p>
          </div>

        </div>
      </div>
    </div>
  );
}