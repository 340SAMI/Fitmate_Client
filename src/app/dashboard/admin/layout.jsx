import DashboardHeader from "@/component/dashboard/DashBoardHeader";
import { requireRole } from "@/lib/core/Session";

export const metadata = {
  title: 'Admin'
}

export default async function AdminDashboardLayout({ children }) {
  await requireRole("admin");

  return <div className='bg-[#11131A]'>
<DashboardHeader></DashboardHeader>
  {children}
  </div>

  
}
