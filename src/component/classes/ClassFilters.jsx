"use client";

const CATEGORIES = ["all", "Yoga", "Cardio", "HIIT", "Strength", "Pilates", "CrossFit", "Boxing", "Cycling"];

export default function ClassFilters({ search, category, onSearchChange, onCategoryChange }) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
      
      {/* Search */}
      <div className="relative flex-1">
        <svg
          className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/30"
          width="16" height="16" viewBox="0 0 24 24" fill="none"
          stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
        >
          <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
        </svg>
        <input
          type="text"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search classes..."
          className="w-full rounded-xl border border-white/10 bg-white/5 py-2.5 pl-10 pr-4 text-sm text-white placeholder-white/25 outline-none transition focus:border-[#8B5CF6]/60 focus:ring-2 focus:ring-[#8B5CF6]/20"
        />
      </div>

      {/* Category filter */}
      <select
        value={category}
        onChange={(e) => onCategoryChange(e.target.value)}
        className="rounded-xl border border-white/10 bg-[#0F1013] px-4 py-2.5 text-sm text-white outline-none transition focus:border-[#8B5CF6]/60 focus:ring-2 focus:ring-[#8B5CF6]/20 sm:w-48"
      >
        {CATEGORIES.map((c) => (
          <option key={c} value={c}>
            {c === "all" ? "All Categories" : c}
          </option>
        ))}
      </select>

    </div>
  );
}