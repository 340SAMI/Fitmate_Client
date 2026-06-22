import { getUserSession } from "@/lib/core/Session";
import { redirect } from "next/navigation";
import { DashboardSidebar } from "@/component/dashboard/DashBoardSideBar";

export default async function DashboardLayout({ children }) {
  const user = await getUserSession();

  if (!user) redirect("/authenticate/signin");

  return (
    <div className="flex min-h-screen">
      <DashboardSidebar />
      <div className="flex-1">{children}</div>
    </div>
  );
}