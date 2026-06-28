import DashboardHeader from "@/component/dashboard/DashBoardHeader";
import { requireRole } from "@/lib/core/Session";

export default async function UserDashboardLayout({ children }) {
  await requireRole("user");

  return <div className='bg-[#11131A]'>
  <DashboardHeader></DashboardHeader>
    {children}
    </div>;
}
