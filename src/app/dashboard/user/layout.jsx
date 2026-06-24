import { requireRole } from "@/lib/core/Session";

export default async function UserDashboardLayout({ children }) {
  await requireRole("user");

  return <>{children}</>;
}
