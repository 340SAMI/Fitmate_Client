"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

import ClassFilters from "./ClassFilters";
import ClassCard from "./ClassCards";
import { getClasses } from "@/lib/api/classes";
import Loading from "@/app/loading";

export default function ClassListingContainer({
  initialClasses,
  initialTotal,
  search: initialSearch,
  category: initialCategory,
}) {
  const router = useRouter();

  const [classes, setClasses] = useState(initialClasses);
  const [total, setTotal] = useState(initialTotal);
  const [isLoading, setIsLoading] = useState(false);
  const [search, setSearch] = useState(initialSearch);
  const [category, setCategory] = useState(initialCategory);

  // Single useEffect — update URL + fetch in one place
  useEffect(() => {
    const params = new URLSearchParams();
    if (search){
        params.set("search", search);
        }

    if (category !== "all"){
        params.set("category", category);
    }

    // Update URL
    router.push(`/classes?${params.toString()}`);

    // Fetch classes
    const fetchClasses = async () => {
      setIsLoading(true);
      try {
        
        const data = await getClasses(params.toString());

        setClasses(data.classes ?? []);
        setTotal(data.total ?? 0);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchClasses();
  }, [search, category]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="min-h-screen bg-[#0A0B0F]">

      {/* Page header */}
      <div className="border-b border-white/[0.06] bg-[#0F1013]">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
            All Classes
          </h1>
          <p className="mt-2 text-sm text-white/50">
            {isLoading ? "Loading..." : `${total} classes available`}
          </p>
        </div>
      </div>

      <div className=" mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">

        {/* Filters */}
        <ClassFilters
          search={search}
          category={category}
          onSearchChange={(val) => setSearch(val)}
          onCategoryChange={(val) => setCategory(val)}
        />

        {/* Grid */}
        {isLoading ? (
          <div className="flex items-center justify-center">
            <Loading></Loading>
          </div>
        ) : classes.length === 0 ? (
          <div className="mt-20 flex flex-col items-center gap-3 text-center">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" className="text-white/20">
              <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
            </svg>
            <p className="text-lg font-semibold text-white/60">No classes found</p>
            <p className="text-sm text-white/30">Try adjusting your search or filter</p>
          </div>
        ) : (
          <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {classes.map((gymClass) => (
              <ClassCard key={gymClass._id} gymClass={gymClass} />
            ))}
          </div>
        )}

      </div>
    </div>
  );
}