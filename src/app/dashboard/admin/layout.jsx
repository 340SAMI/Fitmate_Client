import DashboardHeader from "@/component/dashboard/DashBoardHeader";
import { requireRole } from "@/lib/core/Session";

export default async function AdminDashboardLayout({ children }) {
  await requireRole("admin");

  return <>
<DashboardHeader></DashboardHeader>
  {children}
  </>;
}
