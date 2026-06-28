"use client";

import { usePathname } from "next/navigation";

export default function DashboardHeader() {
  const pathname = usePathname();
  const key = pathname.split("/").pop();

  const pageInfo = {
    // ===========================
    // ADMIN
    // ===========================
    overview: {
      section: "ADMIN DASHBOARD",
      title: "Platform Overview",
      description: "Monitor your platform at a glance.",
    },

    "manage-users": {
      section: "USER MANAGEMENT",
      title: "Manage Users",
      description:
        "Control access, roles, and account status across all platform members.",
    },

    "applied-trainers": {
      section: "TRAINER APPLICATIONS",
      title: "Applied Trainers",
      description:
        "Review trainer applications and approve or reject requests.",
    },

    "manage-trainers": {
      section: "TRAINER MANAGEMENT",
      title: "Manage Trainers",
      description:
        "View, update, and manage all approved trainers.",
    },

    "manage-classes": {
      section: "CLASS MANAGEMENT",
      title: "Manage Classes",
      description:
        "Review, approve, reject, and organize all fitness classes.",
    },

    transactions: {
      section: "TRANSACTIONS",
      title: "Transactions",
      description:
        "Track payments, purchases, and platform revenue.",
    },

    "manage-posts": {
      section: "COMMUNITY FORUM",
      title: "Forum Posts",
      description:
        "Manage community discussions and moderate forum activity.",
    },

    "add-post": {
      section: "COMMUNITY FORUM",
      title: "Add Forum Post",
      description:
        "Create a new announcement or discussion for the community.",
    },

    // ===========================
    // USER
    // ===========================
    "user-overview": {
      section: "USER DASHBOARD",
      title: "Dashboard Overview",
      description:
        "View your activity, bookings, favorites, and account progress at a glance.",
    },

    "booked-classes": {
      section: "MY CLASSES",
      title: "Booked Classes",
      description:
        "Manage your upcoming fitness sessions and keep track of your booked classes.",
    },

    "apply-trainer": {
      section: "TRAINER APPLICATION",
      title: "Apply as Trainer",
      description:
        "Submit your application to become a certified trainer and start sharing your expertise.",
    },

    favorites: {
      section: "FAVORITES",
      title: "Favorite Classes",
      description:
        "Access all your saved classes in one place and quickly book them anytime.",
    },
  };

  const isUserDashboard = pathname.includes("/dashboard/user");

  const lookupKey =
    key === "overview"
      ? isUserDashboard
        ? "user-overview"
        : "overview"
      : key;

  const page = pageInfo[lookupKey] || {
    section: "DASHBOARD",
    title: "Dashboard",
    description: "",
  };

  return (
    <header className="border-b border-white/5 px-8 pt-8 pb-10">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-gray-500">
        <span>Dashboard</span>

        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-3 w-3"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M9 5l7 7-7 7"
          />
        </svg>

        <span className="text-gray-300">{page.title}</span>
      </div>

      {/* Section */}
      <p className="mt-8 text-xs font-semibold uppercase tracking-[0.18em] text-[#8B5CF6]">
        {page.section}
      </p>

      {/* Title */}
      <h1 className="mt-3 text-5xl font-bold tracking-tight text-white">
        {page.title}
      </h1>

      {/* Description */}
      <p className="mt-4 max-w-2xl text-lg leading-8 text-gray-400">
        {page.description}
      </p>
    </header>
  );
}