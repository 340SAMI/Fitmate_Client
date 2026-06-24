import { requireRole } from "@/lib/core/Session";

export default async function TrainerDashboardLayout({ children }) {
  await requireRole("trainer");

  return <>{children}</>;
}
