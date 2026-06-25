"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import Link from "next/link";

export default function DetailsPage({ classes, userId }) {
  const router = useRouter();
  const [isBooking, setIsBooking] = useState(false);
  const [isFavoriting, setIsFavoriting] = useState(false);
  const [isFavorited, setIsFavorited] = useState(false);
  if (!classes) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#0A0B0F]">
        <p className="text-white/50">Class not found.</p>
      </div>
    );
  }

  const handleBookNow = async () => {
    if (!userId) {
      toast.error("Please sign in to book a class");
      router.push("/authenticate/signin");
      return;
    }
    setIsBooking(true);
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/bookings/check?userId=${userId}&classId=${classes._id}`
      );
      const data = await res.json();
      if (data.alreadyBooked) {
        toast.error("You have already booked this class");
        return;
      }
      router.push(`/payment?classId=${classes._id}`);
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsBooking(false);
    }
  };

  const handleFavorite = async () => {
    if (!userId) {
      toast.error("Please sign in to save favorites");
      return;
    }
    if (isFavorited) {
      toast.info("Already saved to favorites");
      return;
    }
    setIsFavoriting(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/favorites`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, classId: classes._id }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Failed to save");
      setIsFavorited(true);
      toast.success("Added to favorites!");
    } catch (err) {
      toast.error(err.message);
    } finally {
      setIsFavoriting(false);
    }
  };

  const difficultyColor = {
    Beginner: "bg-emerald-500/15 text-emerald-400 border border-emerald-500/25",
    Intermediate: "bg-amber-500/15 text-amber-400 border border-amber-500/25",
    Advanced: "bg-red-500/15 text-red-400 border border-red-500/25",
  }[classes.difficulty] ?? "bg-white/5 text-white/50 border border-white/10";

  const formatTime = (time) => {
    if (!time) return "";
    const [h, m] = time.split(":");
    const hour = parseInt(h);
    const ampm = hour >= 12 ? "PM" : "AM";
    const formatted = hour % 12 || 12;
    return `${formatted}:${m} ${ampm}`;
  };

  return (
    <div className="min-h-screen bg-[#0A0B0F]">

      {/* Hero image — using plain img to avoid Next.js Image stacking context issues */}
      <div style={{ position: "relative", height: "400px", width: "100%", overflow: "hidden" }}>
        <img
          src={classes.image}
          alt={classes.className}
          style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
        />
        {/* Gradient overlay */}
        <div style={{
          position: "absolute", inset: 0,
          background: "linear-gradient(to top, #0A0B0F 0%, rgba(10,11,15,0.6) 50%, rgba(10,11,15,0.2) 100%)"
        }} />

        {/* Back button */}
        <div style={{ position: "absolute", top: "20px", left: "20px", zIndex: 10 }}>
          <Link
            href="/classes"
            className="flex items-center gap-2 rounded-xl border border-white/20 bg-black/50 px-4 py-2 text-sm font-medium text-white backdrop-blur-sm transition hover:bg-black/70"
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 12H5M12 5l-7 7 7 7" />
            </svg>
            Back
          </Link>
        </div>

        {/* Category badge */}
        <div style={{ position: "absolute", top: "20px", right: "20px", zIndex: 10 }}>
          <span className="rounded-full border border-[#8B5CF6]/30 bg-[#8B5CF6]/20 px-3 py-1.5 text-xs font-semibold text-[#C4B5FD]">
            {classes.category}
          </span>
        </div>
      </div>

      {/* Main content */}
      <div className="mx-auto max-w-5xl px-4 pb-20 pt-8 sm:px-6 lg:px-8">

        {/* Title block */}
        <div className="mb-6">
          <div className="flex items-start justify-between gap-6">
            <div>
              <h1 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
                {classes.className}
              </h1>
              <p className="mt-1.5 text-sm text-white/45">
                by <span className="font-medium text-white/70">{classes.trainerName}</span>
              </p>
            </div>
            {/* Price — right aligned next to title */}
            <div className="shrink-0 rounded-2xl border border-white/10 bg-[#16181C] px-5 py-3 text-right">
              <span className="block text-2xl font-bold text-white">${classes.price}</span>
              <span className="text-xs text-white/35">per session</span>
            </div>
          </div>
        </div>

        {/* Tags */}
        <div className="mb-8 flex flex-wrap gap-2">
          <span className={`rounded-full px-3 py-1 text-xs font-semibold ${difficultyColor}`}>
            {classes.difficulty}
          </span>
          <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-semibold text-white/60">
            {classes.duration}
          </span>
          <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-semibold text-white/60">
            {classes.bookingCount} booked
          </span>
        </div>

        {/* Two column grid */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">

          {/* Left — description */}
          <div className="lg:col-span-2">
            <div className="rounded-2xl border border-white/10 bg-[#16181C] p-6">
              <h2 className="mb-4 text-xs font-semibold uppercase tracking-widest text-white/35">
                About this class
              </h2>
              <p className="text-sm leading-relaxed text-white/65">
                {classes.description}
              </p>
            </div>
          </div>

          {/* Right — schedule + actions */}
          <div className="flex flex-col gap-4">

            {/* Schedule */}
            <div className="rounded-2xl border border-white/10 bg-[#16181C] p-6">
              <h2 className="mb-4 text-xs font-semibold uppercase tracking-widest text-white/35">
                Schedule
              </h2>
              <div className="mb-5 flex flex-col gap-2">
                <span className="text-xs text-white/30">Days</span>
                <div className="flex flex-wrap gap-1.5">
                  {classes.schedule?.days?.map((day) => (
                    <span
                      key={day}
                      className="rounded-full border border-[#8B5CF6]/25 bg-[#8B5CF6]/10 px-2.5 py-1 text-xs font-semibold text-[#C4B5FD]"
                    >
                      {day.slice(0, 3)}
                    </span>
                  ))}
                </div>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-xs text-white/30">Time</span>
                <div className="flex items-center gap-2">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white/35">
                    <circle cx="12" cy="12" r="10" /><path d="M12 6v6l4 2" />
                  </svg>
                  <span className="text-sm font-bold text-white">
                    {formatTime(classes.schedule?.time)}
                  </span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="rounded-2xl border border-[#8B5CF6]/20 bg-[#16181C] p-6">
              <h2 className="mb-1 text-xs font-semibold uppercase tracking-widest text-white/35">
                Ready to join?
              </h2>
              <p className="mb-5 text-sm text-white/50">
                Secure your spot before it fills up
              </p>

              {/* Checkout */} 

              <form action="/api/checkout_sessions" method="POST" className="mb-3 w-full">
                <input type="hidden" name="classId" value={classes._id} />
                <input type="hidden" name="price" value={classes.price} />
                <input type="hidden" name="userId" value={userId} />
                <input type="hidden" name="name" value={classes.className} />
                <input type="hidden" name="trainerId" value={classes.trainerId} />
                
                
             
                <button
                  type="submit"
                  role="link"
                  className="w-full rounded-xl bg-[#8B5CF6] py-3 text-sm font-bold text-white shadow-lg shadow-[#8B5CF6]/25 transition hover:bg-[#7C3AED]"
                >
                  Checkout
                </button>
              </form>

              {/* Add to Favorites */}
              <button
                onClick={handleFavorite}
                disabled={isFavoriting || isFavorited}
                className={`w-full rounded-xl border py-3 text-sm font-semibold transition disabled:opacity-60 ${
                  isFavorited
                    ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-400"
                    : "border-white/10 bg-white/5 text-white/70 hover:bg-white/10 hover:text-white"
                }`}
              >
                {isFavorited ? "✓ Saved to Favorites" : isFavoriting ? "Saving…" : "♡ Add to Favorites"}
              </button>

              <p className="mt-3 text-center text-xs text-white/25">
                You&apos;ll be redirected to payment
              </p>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}