"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard, Dumbbell, GraduationCap, Heart,
  PlusCircle, ClipboardList, FileText, MessagesSquare,
  Users, UserCheck, CreditCard,
} from "lucide-react";

const iconMap = {
  LayoutDashboard,
  Dumbbell,
  GraduationCap,
  Heart,
  PlusCircle,
  ClipboardList,
  FileText,
  MessagesSquare,
  Users,
  UserCheck,
  CreditCard,
};

export function NavLink({ href, label, icon }) {
  const pathname = usePathname();
  const isActive = pathname === href;
  const Icon = iconMap[icon]; // ← look up by string name

  return (
    <Link
      href={href}
      className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors ${
        isActive
          ? "bg-[#8B5CF6]/15 text-[#A78BFA]"
          : "text-white/50 hover:bg-white/5 hover:text-white"
      }`}
    >
      {Icon && (
        <Icon
          size={17}
          className={`shrink-0 ${isActive ? "text-[#8B5CF6]" : "text-white/30"}`}
        />
      )}
      {label}
      {isActive && <span className="ml-auto h-1.5 w-1.5 rounded-full bg-[#8B5CF6]" />}
    </Link>
  );
}