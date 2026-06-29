"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

import { Skeleton } from "@heroui/react";
import { Magnifier, ChevronLeft, ChevronRight } from "@gravity-ui/icons";
import { getPurchase } from "@/lib/api/purchase.";

const PAGE_SIZE = 8;

const CATEGORY_COLORS = {
  Yoga:    "bg-[#8B5CF6]/15 text-[#C4B5FD] border border-[#8B5CF6]/25",
  Weights: "bg-[#6D6AFE]/15 text-[#A5B4FC] border border-[#6D6AFE]/25",
  Boxing:  "bg-red-500/15 text-red-400 border border-red-500/25",
  Pilates: "bg-amber-500/15 text-amber-400 border border-amber-500/25",
  Cardio:  "bg-emerald-500/15 text-emerald-400 border border-emerald-500/25",
};

function categoryClass(cat) {
  return CATEGORY_COLORS[cat] ?? "bg-white/5 text-white/50 border border-white/10";
}

function difficultyColor(d) {
  if (d === "Beginner")     return "text-emerald-400";
  if (d === "Intermediate") return "text-amber-400";
  if (d === "Advanced")     return "text-red-400";
  return "text-white/40";
}

function formatPrice(raw) {
  // price comes as cents string e.g. "1600" → $16.00
  const num = Number(raw);
  if (isNaN(num)) return `$${raw}`;
  return num >= 100
    ? `$${(num / 100).toFixed(2)}`
    : `$${num.toFixed(2)}`;
}

export default function BookedClassTable({ user }) {
  const [purchases, setPurchases] = useState([]);
  const [loading, setLoading]     = useState(true);
  const [search, setSearch]       = useState("");
  const [query, setQuery]         = useState("");   // debounced / committed search
  const [page, setPage]           = useState(1);

  useEffect(() => {
    if (!user?.id) return;
    setLoading(true);
    (async () => {
      try {
        const qs = query ? `search=${encodeURIComponent(query)}` : "";
        const data = await getPurchase(user.id, null, qs);
        setPurchases(data?.purchases ?? []);
        setPage(1);
      } catch {
        setPurchases([]);
      } finally {
        setLoading(false);
      }
    })();
  }, [user?.id, query]);

  // client-side pagination
  const totalPages = Math.max(1, Math.ceil(purchases.length / PAGE_SIZE));
  const paginated  = purchases.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const handleSearch = (e) => {
    e.preventDefault();
    setQuery(search);
  };

  return (
    <div className="min-h-screen bg-[#11131A] p-6 lg:p-8 font-sans">
      <div className="max-w-5xl mx-auto">

        {/* Header */}
        <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-[22px] font-bold text-white">My Registrations</h1>
            {!loading && (
              <p className="text-[13px] text-[#6D6AFE] mt-0.5">
                {purchases.length} active booking{purchases.length !== 1 ? "s" : ""}
              </p>
            )}
          </div>

          {/* Search */}
          <form onSubmit={handleSearch} className="flex items-center gap-2">
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30">
                <Magnifier width={14} height={14} />
              </span>
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by class or email…"
                className="w-64 rounded-[10px] border border-white/[0.08] bg-white/[0.04] py-2 pl-8 pr-3 text-[13px] text-white placeholder:text-white/25 outline-none focus:border-[#6D6AFE]/50 transition"
              />
            </div>
            <button
              type="submit"
              className="rounded-[10px] border border-white/[0.08] bg-white/[0.04] px-4 py-2 text-[13px] text-white/70 hover:bg-white/[0.08] transition"
            >
              Search
            </button>
            {query && (
              <button
                type="button"
                onClick={() => { setSearch(""); setQuery(""); }}
                className="text-[12px] text-white/30 hover:text-white/60 transition"
              >
                Clear
              </button>
            )}
          </form>
        </div>

        {/* Table card */}
        <div className="bg-[#1A1D28] rounded-[16px] border border-white/[0.06] overflow-hidden">

          {/* Table header */}
          <div className="grid grid-cols-[2fr_1fr_1fr_1fr_auto] gap-4 px-5 py-3 border-b border-white/[0.05]">
            {["Class", "Trainer", "Category", "Price Paid", "Details"].map((h) => (
              <p key={h} className="text-[10.5px] font-semibold tracking-widest uppercase text-white/30">{h}</p>
            ))}
          </div>

          {/* Rows */}
          {loading ? (
            <SkeletonRows />
          ) : paginated.length === 0 ? (
            <div className="py-16 text-center text-[13px] text-white/25">
              {query ? `No results for "${query}"` : "No bookings yet."}
            </div>
          ) : (
            paginated.map((p) => (
              <PurchaseRow key={p._id} purchase={p} />
            ))
          )}

          {/* Footer */}
          {!loading && purchases.length > 0 && (
            <div className="flex items-center justify-between px-5 py-4 border-t border-white/[0.05]">
              <p className="text-[12px] text-white/30">
                Showing {(page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, purchases.length)} of {purchases.length} classes
              </p>
              <div className="flex items-center gap-2">
                <PaginationBtn
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  icon={<ChevronLeft width={14} height={14} />}
                />
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
                  <button
                    key={n}
                    onClick={() => setPage(n)}
                    className={`w-8 h-8 rounded-[8px] text-[13px] font-medium transition ${
                      n === page
                        ? "bg-[#6D6AFE] text-white"
                        : "text-white/40 hover:bg-white/[0.06] hover:text-white"
                    }`}
                  >
                    {n}
                  </button>
                ))}
                <PaginationBtn
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  icon={<ChevronRight width={14} height={14} />}
                />
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Row
// ---------------------------------------------------------------------------
function PurchaseRow({ purchase }) {
  const { classId, name, difficulty, trainerName, price, mainPrice } = purchase;

  // use mainPrice (dollars) if available, otherwise treat price as cents
  const displayPrice = mainPrice
    ? `$${Number(mainPrice).toFixed(2)}`
    : formatPrice(price);

  return (
    <div className="grid grid-cols-[2fr_1fr_1fr_1fr_auto] gap-4 items-center px-5 py-4 border-b border-white/[0.04] hover:bg-white/[0.02] transition group">

      {/* Class */}
      <div className="flex items-center gap-3 min-w-0">
        <div className="w-9 h-9 rounded-[10px] bg-[#6D6AFE]/15 flex items-center justify-center flex-shrink-0 text-[#6D6AFE] text-base">
          🏋️
        </div>
        <div className="min-w-0">
          <p className="text-[13.5px] font-semibold text-white truncate">{name}</p>
          <p className={`text-[11.5px] mt-0.5 ${difficultyColor(difficulty)}`}>{difficulty}</p>
        </div>
      </div>

      {/* Trainer */}
      <p className="text-[13px] text-white/50 truncate">{trainerName}</p>

      {/* Category — not in purchase obj, show difficulty as fallback badge */}
      <span className={`inline-flex w-fit rounded-full px-2.5 py-1 text-[11px] font-semibold ${categoryClass(difficulty)}`}>
        {difficulty ?? "—"}
      </span>

      {/* Price */}
      <p className="text-[14px] font-bold text-[#20E3A2]">{displayPrice}</p>

      {/* Details */}
      <Link
        href={`/classes/${classId}`}
        className="rounded-[9px] border border-white/[0.08] bg-white/[0.04] px-3 py-1.5 text-[12px] font-medium text-white/70 hover:bg-white/[0.09] hover:text-white transition whitespace-nowrap"
      >
        View Details
      </Link>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
function PaginationBtn({ onClick, disabled, icon }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="w-8 h-8 rounded-[8px] border border-white/[0.08] flex items-center justify-center text-white/40 hover:bg-white/[0.06] hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition"
    >
      {icon}
    </button>
  );
}

function SkeletonRows() {
  return Array.from({ length: 5 }).map((_, i) => (
    <div key={i} className="grid grid-cols-[2fr_1fr_1fr_1fr_auto] gap-4 items-center px-5 py-4 border-b border-white/[0.04]">
      <div className="flex items-center gap-3">
        <Skeleton className="w-9 h-9 rounded-[10px]" />
        <div className="space-y-1.5">
          <Skeleton className="h-3.5 w-36 rounded-md" />
          <Skeleton className="h-3 w-20 rounded-md" />
        </div>
      </div>
      <Skeleton className="h-3.5 w-24 rounded-md" />
      <Skeleton className="h-6 w-16 rounded-full" />
      <Skeleton className="h-4 w-14 rounded-md" />
      <Skeleton className="h-7 w-24 rounded-[9px]" />
    </div>
  ));
}