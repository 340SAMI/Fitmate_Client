"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Card, Avatar, Chip, Skeleton } from "@heroui/react";
import { Calendar, Heart, ArrowsRotateLeft, ChevronRight } from "@gravity-ui/icons";
import { userStats } from "@/lib/api/stats";

export default function OverViewStats({ user }) {
  const [stats, setStats] = useState({ totalBooked: 0, totalFavorites: 0 });
  const [statsLoading, setStatsLoading] = useState(true);

  useEffect(() => {
    if (!user?.id) return;
    (async () => {
      try {
        const data = await userStats(user.id);
        if (data?.success) {
          setStats({ totalBooked: data.totalBooked, totalFavorites: data.totalFavorites });
        }
      } finally {
        setStatsLoading(false);
      }
    })();
  }, [user?.id]);

  const memberSince = user?.createdAt
    ? new Date(user.createdAt).toLocaleDateString("en-US", { month: "short", year: "numeric" })
    : "—";

  const displayName = user?.name ?? "—";
  const displayEmail = user?.email ?? "—";
  const displayRole = user?.role ?? "user";
  const displayStatus = user?.status ?? "active";

  return (
    <div className="min-h-screen bg-[#11131A] font-sans p-6 lg:p-8">
      <div className="max-w-5xl mx-auto space-y-5">

        {/* Stat Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <StatCard
            label="Booked Classes"
            value={stats.totalBooked}
            sub="Classes registered & paid"
            accentColor="#6D6AFE"
            iconBgClass="bg-[#6D6AFE]/15 text-[#6D6AFE]"
            topBorderColor="border-t-[#6D6AFE]/40"
            loading={statsLoading}
            icon={<Calendar width={16} height={16} />}
          />
          <StatCard
            label="Favorite Classes"
            value={stats.totalFavorites}
            sub="Saved for later"
            accentColor="#8B5CF6"
            iconBgClass="bg-[#8B5CF6]/15 text-[#8B5CF6]"
            topBorderColor="border-t-[#8B5CF6]/40"
            loading={statsLoading}
            icon={<Heart width={16} height={16} />}
          />
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-5">

          {/* Left: Profile */}
          <Card className="bg-[#1A1D28] border border-white/[0.06] rounded-[14px] shadow-none p-0">
            <Card.Header className="px-5 pt-5 pb-0">
              <p className="text-[10.5px] font-semibold tracking-widest uppercase text-white/30">
                Profile Details
              </p>
            </Card.Header>

            <Card.Content className="px-5 pb-5 space-y-4">
              {/* Profile header */}
              <div className="bg-white/[0.03] border border-white/[0.05] rounded-[10px] p-4 flex items-center gap-4">
                <div className="relative flex-shrink-0">
                  <Avatar
                    src={user?.image || undefined}
                    name={displayName}
                    className="w-14 h-14 rounded-[14px] text-white font-bold text-xl"
                    style={{ background: "linear-gradient(135deg, #20E3A2 0%, #6D6AFE 100%)" }}
                  />
                  <span className="absolute bottom-0.5 right-0.5 w-2.5 h-2.5 rounded-full bg-[#20E3A2] border-2 border-[#1A1D28]" />
                </div>
                <div className="min-w-0">
                  <p className="text-[17px] font-semibold text-white mb-0.5 truncate">{displayName}</p>
                  <p className="text-[13px] text-white/40 mb-2 truncate">{displayEmail}</p>
                  <Chip
                    size="sm"
                    className="bg-[#20E3A2]/10 text-[#20E3A2] border border-[#20E3A2]/20 text-[11px] font-semibold capitalize"
                  >
                    {displayRole}
                  </Chip>
                </div>
              </div>

              {/* Info grid */}
              <div className="grid grid-cols-2 gap-2.5">
                <InfoBox label="Member since" value={memberSince} />
                <InfoBox label="Account status" value={displayStatus} valueClass="text-[#20E3A2] capitalize" />
                <InfoBox
                  label="Booked classes"
                  value={statsLoading ? null : stats.totalBooked}
                  valueClass="text-[#6D6AFE]"
                />
                <InfoBox
                  label="Saved favorites"
                  value={statsLoading ? null : stats.totalFavorites}
                  valueClass="text-[#8B5CF6]"
                />
              </div>
            </Card.Content>
          </Card>

          {/* Right Column */}
          <div className="flex flex-col gap-4">

            {/* Trainer Application — hardcoded until backend is ready */}
            <Card className="bg-[#1A1D28] border border-white/[0.06] rounded-[14px] shadow-none p-0">
              <Card.Header className="px-4 pt-5 pb-0">
                <p className="text-[10.5px] font-semibold tracking-widest uppercase text-white/30">
                  Trainer Application
                </p>
              </Card.Header>
              <Card.Content className="px-4 pb-5 space-y-3">
                <div className="bg-white/[0.03] border border-white/[0.05] rounded-[9px] p-4 flex items-center justify-between gap-3">
                  <div>
                    <p className="text-[14px] font-medium text-white mb-0.5">Application status</p>
                    <p className="text-[12px] text-white/35">Submitted Jun 18, 2025</p>
                  </div>
                  <Chip
                    size="sm"
                    className="bg-red-500/15 text-red-400 border border-red-500/20 text-[11px] font-semibold flex-shrink-0"
                  >
                    <span className="flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-red-400 inline-block" />
                      Rejected
                    </span>
                  </Chip>
                </div>
                <div className="bg-red-500/[0.08] border border-red-500/15 rounded-[9px] p-4">
                  <p className="text-[10.5px] font-bold tracking-widest uppercase text-red-400/70 mb-2">
                    Admin Feedback
                  </p>
                  <p className="text-[13px] text-red-400/55 leading-relaxed">
                    Your application lacks sufficient experience details. Please reapply with a
                    more complete specialty profile and certifications.
                  </p>
                </div>
              </Card.Content>
            </Card>

            {/* Quick Actions */}
            <Card className="bg-[#1A1D28] border border-white/[0.06] rounded-[14px] shadow-none p-0">
              <Card.Header className="px-4 pt-5 pb-0">
                <p className="text-[10.5px] font-semibold tracking-widest uppercase text-white/30">
                  Quick Actions
                </p>
              </Card.Header>
              <Card.Content className="px-0 pb-0">
                <ActionItem
                  iconClass="bg-[#6D6AFE]/15 text-[#6D6AFE]"
                  icon={<Calendar width={16} height={16} />}
                  title="View booked classes"
                  sub={statsLoading ? "Loading…" : `${stats.totalBooked} active registration${stats.totalBooked !== 1 ? "s" : ""}`}
                  first
                  href="/dashboard/user/booked-classes"
                />
                <ActionItem
                  iconClass="bg-[#8B5CF6]/15 text-[#8B5CF6]"
                  icon={<Heart width={16} height={16} />}
                  title="Favorite classes"
                  sub={statsLoading ? "Loading…" : `${stats.totalFavorites} saved class${stats.totalFavorites !== 1 ? "es" : ""}`}
                  href="/dashboard/user/favorites"
                />
                <ActionItem
                  iconClass="bg-red-500/10 text-red-400"
                  icon={<ArrowsRotateLeft width={16} height={16} />}
                  title="Apply as trainer"
                  sub="Previous application rejected"
                  last
                  href="/dashboard/user/apply-trainer"
                />
              </Card.Content>
            </Card>

          </div>
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

function StatCard({ label, value, sub, accentColor, iconBgClass, topBorderColor, loading, icon }) {
  return (
    <div className={`bg-[#1A1D28] rounded-[14px] border border-white/[0.06] border-t-[1.5px] ${topBorderColor} p-5 relative overflow-hidden`}>
      <div className="flex items-start justify-between mb-4">
        <p className="text-[10.5px] font-semibold tracking-widest uppercase text-white/35">{label}</p>
        <div className={`w-9 h-9 rounded-[9px] flex items-center justify-center ${iconBgClass}`}>
          {icon}
        </div>
      </div>
      {loading ? (
        <Skeleton className="h-10 w-16 rounded-lg mb-2" />
      ) : (
        <p className="text-[42px] font-bold leading-none mb-1.5 tracking-tight" style={{ color: accentColor }}>
          {value}
        </p>
      )}
      <p className="text-[12.5px] text-white/35">{sub}</p>
    </div>
  );
}

function InfoBox({ label, value, valueClass = "text-white" }) {
  return (
    <div className="bg-white/[0.03] border border-white/[0.05] rounded-[9px] p-4">
      <p className="text-[11px] text-white/35 mb-1.5">{label}</p>
      {value === null ? (
        <Skeleton className="h-4 w-20 rounded-md" />
      ) : (
        <p className={`text-[15px] font-medium ${valueClass}`}>{value}</p>
      )}
    </div>
  );
}

function ActionItem({ iconClass, icon, title, sub, first, last, href }) {
  return (
    <Link
      href={href}
      className={`flex items-center gap-3 px-4 py-3 cursor-pointer hover:bg-white/[0.03] transition-colors border-t border-white/[0.04]
        ${first ? "mt-3 border-t-0" : ""}
        ${last ? "rounded-b-[13px]" : ""}
      `}
    >
      <div className={`w-9 h-9 rounded-[9px] flex items-center justify-center flex-shrink-0 ${iconClass}`}>
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-[13.5px] font-medium text-white/85 mb-0.5 truncate">{title}</p>
        <p className="text-[12px] text-white/35 truncate">{sub}</p>
      </div>
      <ChevronRight width={14} height={14} className="text-white/20 flex-shrink-0" />
    </Link>
  );
}