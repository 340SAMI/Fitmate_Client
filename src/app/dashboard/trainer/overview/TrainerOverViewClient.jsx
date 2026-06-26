"use client";

import { Dumbbell, Users } from "lucide-react";

export default function TrainerOverviewClient({ user, stats }) {
  return (
    <div className="mx-auto max-w-4xl space-y-6">

      {/* Page header */}
      <div>
        <h1 className="text-2xl font-bold text-white">Overview</h1>
        <p className="mt-1 text-sm text-white/40">
          Welcome back, {user.name?.split(" ")[0]}
        </p>
      </div>

      {/* Stat cards — fixed height, side by side */}
      <div className="grid grid-cols-2 gap-4">
        <div className="flex items-center gap-4 rounded-2xl border border-[#8B5CF6]/20 bg-[#12141A] px-5 py-4">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#8B5CF6]/10">
            <Dumbbell size={20} className="text-[#A78BFA]" />
          </div>
          <div>
            <p className="text-xs text-white/40">Classes Created</p>
            <p className="mt-0.5 text-2xl font-bold text-white">{stats.totalClasses ?? 0}</p>
          </div>
        </div>

        <div className="flex items-center gap-4 rounded-2xl border border-emerald-500/20 bg-[#12141A] px-5 py-4">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-emerald-500/10">
            <Users size={20} className="text-emerald-400" />
          </div>
          <div>
            <p className="text-xs text-white/40">Students Enrolled</p>
            <p className="mt-0.5 text-2xl font-bold text-white">{stats.totalEnrolled ?? 0}</p>
          </div>
        </div>
      </div>

      {/* Profile card */}
      <div className="rounded-2xl border border-white/[0.06] bg-[#12141A] p-6">
        <p className="mb-5 text-xs font-semibold uppercase tracking-widest text-white/30">
          Profile
        </p>

        {/* Avatar + info row */}
        <div className="flex items-center gap-5">
          {user.image ? (
            <img
              src={user.image}
              alt={user.name}
              className="h-16 w-16 rounded-full object-cover ring-2 ring-[#8B5CF6]/30"
            />
          ) : (
            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-[#8B5CF6]/20 text-xl font-bold text-[#A78BFA]">
              {user.name?.slice(0, 2).toUpperCase()}
            </div>
          )}

          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <p className="text-base font-semibold text-white">{user.name}</p>
              <span className="rounded-full border border-[#8B5CF6]/25 bg-[#8B5CF6]/15 px-2.5 py-0.5 text-[11px] font-semibold text-[#A78BFA]">
                Trainer
              </span>
            </div>
            <p className="mt-1 text-sm text-white/50">{user.email}</p>
            <div className="mt-1.5 flex items-center gap-1.5">
              <span className={`h-1.5 w-1.5 rounded-full ${user.emailVerified ? "bg-emerald-400" : "bg-amber-400"}`} />
              <span className="text-xs text-white/35">
                {user.emailVerified ? "Email verified" : "Email not verified"}
              </span>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="my-5 border-t border-white/[0.06]" />

        {/* Meta row */}
        <div className="flex flex-wrap items-center gap-6">
          <div>
            <p className="text-xs text-white/35">Member since</p>
            <p className="mt-0.5 text-sm font-medium text-white">
              {new Date(user.createdAt).toLocaleDateString("en-US", {
                month: "long", day: "numeric", year: "numeric",
              })}
            </p>
          </div>
          <div className="h-8 w-px bg-white/[0.06]" />
          <div>
            <p className="text-xs text-white/35">Account status</p>
            <div className="mt-0.5 flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
              <p className="text-sm font-medium text-white capitalize">
                {user.status ?? "Active"}
              </p>
            </div>
          </div>
          <div className="h-8 w-px bg-white/[0.06]" />
          <div>
            <p className="text-xs text-white/35">Role</p>
            <p className="mt-0.5 text-sm font-medium text-white capitalize">
              {user.role}
            </p>
          </div>
        </div>
      </div>

    </div>
  );
}