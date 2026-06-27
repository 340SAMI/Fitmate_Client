"use client"

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Users, Dumbbell, CalendarCheck, ArrowUpRight, ShieldCheck, Mail, Calendar } from 'lucide-react';
import { adminStats } from '@/lib/api/stats';
import Loading from '@/app/loading';
import { toast } from 'react-toastify';

function formatDate(dateStr) {
  if (!dateStr) return '—';
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
}

function deriveLastLogin(dateStr) {
  if (!dateStr) return '—';
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now - date;
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays === 1) return 'Yesterday';
  return `${diffDays} days ago`;
}

export default function AdminStats({ user }) {

  const router = useRouter();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  const fetchStats = async () => {
    try {
      setLoading(true);
      setError(false);
      const data = await adminStats(user.id);
      setStats(data);
    } catch (err) {
      console.error(err);
      toast.error(err?.message || "Failed to load dashboard.");
      setError(true);
    } finally {
      setLoading(false);
    }
  };
  // eslint-disable-next-line react-compiler/react-compiler
  useEffect(() => {

    if (user?.id) fetchStats();
  }, [user]);

  if (loading) return <Loading />;

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh]">
        <h2 className="text-xl font-semibold text-gray-200">Failed to load dashboard.</h2>
        <button onClick={fetchStats} className="btn btn-primary mt-4">Try Again</button>
      </div>
    );
  }

  return (
    <div className="min-h-screen text-gray-100 font-sans p-6">
      <div className="max-w-7xl mx-auto space-y-6">

        {/* --- Header --- */}
        <div className="flex items-center justify-between pb-5 border-b border-gray-900">
          <div className="text-xs font-medium text-gray-500 space-x-2">
            <span>Dashboard</span>
            <span>&rsaquo;</span>
            <span className="text-gray-300">Overview</span>
          </div>
        </div>

        {/* --- Row 1: Stat Cards --- */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

          <div className="p-6 bg-[#2b1d92] border border-gray-800 rounded-xl flex justify-between items-start">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 block">Total Users</span>
              <h3 className="text-2xl font-bold tracking-tight text-white mt-2">{stats?.totalUsers ?? '—'}</h3>
            </div>
            <div className="p-2 bg-[#161520] border border-gray-800 rounded-lg text-indigo-400">
              <Users className="w-4 h-4" />
            </div>
          </div>

          <div className="p-6 bg-[#12111a] border border-gray-800 rounded-xl flex justify-between items-start">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-gray-500 block">Total Classes</span>
              <h3 className="text-2xl font-bold tracking-tight text-white mt-2">{stats?.totalClasses ?? '—'}</h3>
            </div>
            <div className="p-2 bg-[#161520] border border-gray-800 rounded-lg text-amber-500">
              <Dumbbell className="w-4 h-4" />
            </div>
          </div>

          <div className="p-6 bg-[#12111a] border border-gray-800 rounded-xl flex justify-between items-start">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-gray-500 block">Classes Booked</span>
              <h3 className="text-2xl font-bold tracking-tight text-emerald-400 mt-2">{stats?.totalBookings ?? '—'}</h3>
            </div>
            <div className="p-2 bg-[#161520] border border-gray-800 rounded-lg text-emerald-400">
              <CalendarCheck className="w-4 h-4" />
            </div>
          </div>

        </div>

        {/* --- Row 2: Profile + Quick Actions --- */}
        <div className="grid grid-cols-1 lg:grid-cols-10 gap-6">

          {/* Left: Profile Card (70%) */}
          <div className="lg:col-span-7">
            <div className="bg-[#12111a] border border-gray-800 rounded-xl p-6 space-y-6">

              {/* Profile Header */}
              <div className="p-5 bg-[#161520] border border-gray-800 rounded-xl flex items-center space-x-4">
                {user?.image ? (
                  <img
                    src={user.image}
                    alt={user.name}
                    className="w-14 h-14 rounded-xl object-cover border border-gray-700"
                  />
                ) : (
                  <div className="w-14 h-14 bg-indigo-600 rounded-xl flex items-center justify-center font-bold text-white text-xl">
                    {user?.name?.[0]?.toUpperCase() ?? 'A'}
                  </div>
                )}
                <div className="space-y-1">
                  <h4 className="text-base font-bold text-white">{user?.name ?? 'Admin'}</h4>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-xs text-gray-400 flex items-center gap-1">
                      <Mail className="w-3 h-3 text-gray-500" /> {user?.email ?? '—'}
                    </span>
                    <span className="px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider bg-indigo-950 text-indigo-300 border border-indigo-900/60 rounded-md">
                      Administrator
                    </span>
                  </div>
                </div>
              </div>

              {/* 2x2 Info Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 bg-[#161520] border border-gray-800 rounded-xl">
                  <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider block">Status</span>
                  <p className="text-sm font-semibold text-emerald-400 flex items-center gap-1.5 mt-1">
                    <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full"></span>
                    {user?.status ? user.status.charAt(0).toUpperCase() + user.status.slice(1) : 'Active'}
                  </p>
                </div>
                <div className="p-4 bg-[#161520] border border-gray-800 rounded-xl">
                  <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider block">Role</span>
                  <p className="text-sm font-semibold text-indigo-400 flex items-center gap-1.5 mt-1">
                    <ShieldCheck className="w-4 h-4" />
                    {user?.role ? user.role.charAt(0).toUpperCase() + user.role.slice(1) : 'Admin'}
                  </p>
                </div>
                <div className="p-4 bg-[#161520] border border-gray-800 rounded-xl">
                  <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider block">Member Since</span>
                  <p className="text-sm font-semibold text-gray-200 flex items-center gap-1.5 mt-1">
                    <Calendar className="w-4 h-4 text-gray-500" />
                    {formatDate(user?.createdAt)}
                  </p>
                </div>
                <div className="p-4 bg-[#161520] border border-gray-800 rounded-xl">
                  <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider block">Last Login</span>
                  <p className="text-sm font-semibold text-gray-200 mt-1">
                    {deriveLastLogin(user?.updatedAt)}
                  </p>
                </div>
              </div>

            </div>
          </div>

          {/* Right: Quick Actions (30%) */}
          <div className="lg:col-span-3">
            <div className="bg-[#12111a] border border-gray-800 rounded-xl p-4 space-y-3">
              <span className="text-[10px] font-bold uppercase tracking-wider text-gray-500 block px-1">Quick Actions</span>

              <button
                onClick={() => router.push('/dashboard/admin/applied-trainers')}
                className="w-full text-left p-3 bg-[#161520] border border-gray-800 hover:border-gray-700 rounded-xl flex items-center justify-between group transition-colors"
              >
                <div className="flex items-center space-x-3">
                  <CalendarCheck className="w-4 h-4 text-amber-500 flex-shrink-0" />
                  <div>
                    <h4 className="text-xs font-semibold text-white">Review Applications</h4>
                    <p className="text-[10px] text-gray-500">Trainer requests pending</p>
                  </div>
                </div>
                <ArrowUpRight className="w-3 h-3 text-gray-600 group-hover:text-gray-400 transition-colors" />
              </button>

              <button
                onClick={() => router.push('/dashboard/admin/manage-classes')}
                className="w-full text-left p-3 bg-[#161520] border border-gray-800 hover:border-gray-700 rounded-xl flex items-center justify-between group transition-colors"
              >
                <div className="flex items-center space-x-3">
                  <Dumbbell className="w-4 h-4 text-indigo-400 flex-shrink-0" />
                  <div>
                    <h4 className="text-xs font-semibold text-white">Approve Classes</h4>
                    <p className="text-[10px] text-gray-500">7 tracks awaiting clearance</p>
                  </div>
                </div>
                <ArrowUpRight className="w-3 h-3 text-gray-600 group-hover:text-gray-400 transition-colors" />
              </button>

              <button
                onClick={() => router.push('/dashboard/admin/manage-users')}
                className="w-full text-left p-3 bg-[#161520] border border-gray-800 hover:border-gray-700 rounded-xl flex items-center justify-between group transition-colors"
              >
                <div className="flex items-center space-x-3">
                  <Users className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                  <div>
                    <h4 className="text-xs font-semibold text-white">Manage Users</h4>
                    <p className="text-[10px] text-gray-500">Client operations directory</p>
                  </div>
                </div>
                <ArrowUpRight className="w-3 h-3 text-gray-600 group-hover:text-gray-400 transition-colors" />
              </button>

              <button
                onClick={() => router.push('/dashboard/admin/transactions')}
                className="w-full text-left p-3 bg-[#161520] border border-gray-800 hover:border-gray-700 rounded-xl flex items-center justify-between group transition-colors"
              >
                <div className="flex items-center space-x-3">
                  <ShieldCheck className="w-4 h-4 text-gray-400 flex-shrink-0" />
                  <div>
                    <h4 className="text-xs font-semibold text-white">Total Transactions</h4>
                    <p className="text-[10px] text-gray-500">check payments made so far</p>
                  </div>
                </div>
                <ArrowUpRight className="w-3 h-3 text-gray-600 group-hover:text-gray-400 transition-colors" />
              </button>

            </div>
          </div>

        </div>
      </div>
    </div>
  );
}