import { requireRole } from "@/lib/core/Session";

export default async function AdminDashboardLayout({ children }) {
  await requireRole("admin");

  return <>{children}</>;
}
