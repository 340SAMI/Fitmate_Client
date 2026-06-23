

import { Button, Drawer } from "@heroui/react";
import Link from "next/link";
import { getUserSession } from "@/lib/core/Session";
import { NavLink } from "./NavLink";


// src/lib/navLinks.js
// ← No lucide imports here anymore

export const userNavLinks = [
  { icon: "LayoutDashboard", href: "/dashboard/user/overview",       label: "Overview" },
  { icon: "Dumbbell",        href: "/dashboard/user/booked-classes", label: "Booked Classes" },
  { icon: "GraduationCap",   href: "/dashboard/user/apply-trainer",  label: "Apply as Trainer" },
  { icon: "Heart",           href: "/dashboard/user/favorites",       label: "Favorites" },
];

export const trainerNavLinks = [
  { icon: "LayoutDashboard", href: "/dashboard/trainer/overview",   label: "Overview" },
  { icon: "PlusCircle",      href: "/dashboard/trainer/add-class",  label: "Add Class" },
  { icon: "ClipboardList",   href: "/dashboard/trainer/my-classes", label: "My Classes" },
  { icon: "FileText",        href: "/dashboard/trainer/add-post",   label: "Add Forum Post" },
  { icon: "MessagesSquare",  href: "/dashboard/trainer/my-posts",   label: "My Forum Posts" },
];

export const adminNavLinks = [
  { icon: "LayoutDashboard", href: "/dashboard/admin/overview",         label: "Overview" },
  { icon: "Users",           href: "/dashboard/admin/manage-users",     label: "Manage Users" },
  { icon: "UserCheck",       href: "/dashboard/admin/applied-trainers", label: "Applied Trainers" },
  { icon: "GraduationCap",   href: "/dashboard/admin/manage-trainers",  label: "Manage Trainers" },
  { icon: "Dumbbell",        href: "/dashboard/admin/manage-classes",   label: "Manage Classes" },
  { icon: "FileText",        href: "/dashboard/admin/add-post",         label: "Add Forum Post" },
  { icon: "CreditCard",      href: "/dashboard/admin/transactions",     label: "Transactions" },
  { icon: "MessagesSquare",  href: "/dashboard/admin/manage-posts",     label: "Manage Posts" },
];

const navLinksMap = {
  user:    userNavLinks,
  trainer: trainerNavLinks,
  admin:   adminNavLinks,
};

const roleBadgeStyles = {
  user:    "bg-blue-500/10 text-blue-400 border border-blue-500/20",
  trainer: "bg-violet-500/10 text-violet-400 border border-violet-500/20",
  admin:   "bg-amber-500/10 text-amber-400 border border-amber-500/20",
};

export async function DashboardSidebar() {
  const user = await getUserSession()
  const role = user?.role ?? "user";
  const navItems = navLinksMap[role] ?? userNavLinks;

  const navContent = (
    <div className="flex flex-col gap-6">
      {/* User info */}
      <div className="flex flex-col gap-2 px-1">
        <div className="flex items-center gap-3">
          {user?.image ? (
            <img
              src={user.image}
              alt={user.name}
              className="h-9 w-9 rounded-full object-cover ring-2 ring-[#8B5CF6]/30"
            />
          ) : (
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#8B5CF6]/20 text-xs font-bold text-[#A78BFA]">
              {user?.name?.slice(0, 2).toUpperCase() ?? "??"}
            </div>
          )}
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-white">{user?.name}</p>
            <p className="truncate text-xs text-white/40">{user?.email}</p>
          </div>
        </div>
        <span className={`w-fit rounded-full px-2.5 py-0.5 text-[11px] font-semibold capitalize ${roleBadgeStyles[role]}`}>
          {role}
        </span>
      </div>

      {/* Nav links */}
      <nav className="flex flex-col gap-1">
                {navItems.map((item) => (
        <NavLink key={item.label} href={item.href} label={item.label} icon={item.icon} />
        ))}
      </nav>

      {/* Divider */}
      <div className="border-t border-white/[0.06]" />

      {/* Back to Home */}
      <Link href="/" className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-white/70 transition hover:bg-white/5 hover:text-white">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
          <polyline points="9 22 9 12 15 12 15 22" />
        </svg>
        <span>Back to Home</span>
      </Link>
    </div>
  );

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden w-64 shrink-0 flex-col border-r border-white/[0.06] bg-[#12141A] p-4 lg:flex">

        {navContent}
      </aside>

      {/* Mobile: Drawer trigger */}
      <div className="lg:hidden">
        <Drawer>
          <Button variant="ghost" isIconOnly aria-label="Open sidebar" className="text-white">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M3 6h18M3 12h18M3 18h18" />
            </svg>
          </Button>
          <Drawer.Backdrop>
            <Drawer.Content placement="left">
              <Drawer.Dialog className="w-64 bg-[#12141A]">
                <Drawer.CloseTrigger className="text-white" />
                <Drawer.Header>
                  <Drawer.Heading>
                    <Link href="/" className="flex items-center gap-2">
                      <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#8B5CF6]">
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round">
                          <path d="M6.5 6.5 17.5 17.5M4 9l3-3M17 20l3-3M2 11l2-2M20 13l2-2M9 4 6 7M15 17l3 3" />
                        </svg>
                      </span>
                      <span className="text-sm font-extrabold tracking-tight text-white">
                        IRON<span className="text-[#8B5CF6]">PULSE</span>
                      </span>
                    </Link>
                  </Drawer.Heading>
                </Drawer.Header>
                <Drawer.Body>
                  {navContent}
                </Drawer.Body>
              </Drawer.Dialog>
            </Drawer.Content>
          </Drawer.Backdrop>
        </Drawer>
      </div>
    </>
  );
}