"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { deleteFavorite } from "@/lib/actions/favorites";
import { getFavorite } from "@/lib/api/favorite";
import { Skeleton } from "@heroui/react";
import { TrashBin } from "@gravity-ui/icons";

export default function FavoritemLists({ user }) {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [removingId, setRemovingId] = useState(null);

  useEffect(() => {
    if (!user?.id) return;
    (async () => {
      try {
        const data = await getFavorite(user.id);
        setFavorites(data?.favorites ?? []);
      } finally {
        setLoading(false);
      }
    })();
  }, [user?.id]);

  const handleRemove = async (classId) => {
    setRemovingId(classId);
    try {
      await deleteFavorite(user.id, classId);
      setFavorites((prev) => prev.filter((f) => f.classId !== classId));
    } finally {
      setRemovingId(null);
    }
  };

  return (
    <div className="min-h-screen bg-[#11131A] p-6 lg:p-8 font-sans">
      <div className="max-w-5xl mx-auto">

        {/* Header */}
        <div className="mb-6">
          <h1 className="text-[22px] font-bold text-white">Favorite Classes</h1>
          {!loading && (
            <p className="text-[13px] text-[#8B5CF6] mt-0.5">
              {favorites.length} saved class{favorites.length !== 1 ? "es" : ""}
            </p>
          )}
        </div>

        {/* Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="h-72 rounded-2xl" />
            ))}
          </div>
        ) : favorites.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <p className="text-4xl mb-4">♡</p>
            <p className="text-white/50 text-sm">No favorites yet.</p>
            <Link
              href="/classes"
              className="mt-4 rounded-xl bg-[#8B5CF6] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#7C3AED] transition"
            >
              Browse classes
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {favorites.map((fav) => (
              <FavoriteCard
                key={fav.classId}
                favorite={fav}
                removing={removingId === fav.classId}
                onRemove={() => handleRemove(fav.classId)}
              />
            ))}
          </div>
        )}

      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// FavoriteCard — wraps the same visual as ClassCard + adds delete button
// ---------------------------------------------------------------------------
function FavoriteCard({ favorite, removing, onRemove }) {
  return (
    <div className={`group flex flex-col overflow-hidden rounded-2xl border border-white/10 bg-[#16181C] transition hover:border-[#8B5CF6]/40 hover:shadow-xl hover:shadow-black/30 ${removing ? "opacity-50 pointer-events-none" : ""}`}>

      {/* Image */}
      <div className="relative h-48 w-full overflow-hidden">
        <img
          src={favorite.image}
          alt={favorite.className}
          className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
        />
        <span className="absolute left-3 top-3 rounded-full border border-[#8B5CF6]/30 bg-[#8B5CF6]/20 px-3 py-1 text-xs font-semibold text-[#C4B5FD]">
          {favorite.category}
        </span>

        {/* Delete button — top right */}
        <button
          onClick={onRemove}
          className="absolute right-3 top-3 flex items-center justify-center w-8 h-8 rounded-full bg-black/60 border border-red-500/30 text-red-400 hover:bg-red-500/20 transition backdrop-blur-sm"
          title="Remove from favorites"
        >
          {removing
            ? <span className="w-3 h-3 rounded-full border-2 border-red-400 border-t-transparent animate-spin" />
            : <TrashBin width={14} height={14} />
          }
        </button>
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col gap-3 p-5">
        <h3 className="text-base font-bold leading-snug text-white line-clamp-1">
          {favorite.className}
        </h3>
        <p className="text-xs text-white/45">
          by <span className="text-white/70 font-medium">{favorite.trainerName}</span>
        </p>
        <div className="flex flex-wrap gap-2">
          <span className="rounded-full bg-white/5 border border-white/10 px-3 py-1 text-xs text-white/60">
            {favorite.difficulty}
          </span>
        </div>

        <div className="border-t border-white/5 mt-auto pt-3 flex items-center justify-between">
          <div className="flex flex-col gap-0.5">
            <span className="text-lg font-bold text-white">${favorite.price}</span>
          </div>
          <Link
            href={`/classes/${favorite.classId}`}
            className="rounded-xl bg-[#8B5CF6] px-4 py-2 text-xs font-semibold text-white transition hover:bg-[#7C3AED]"
          >
            View Details
          </Link>
        </div>
      </div>
    </div>
  );
}