import { requireRole } from "@/lib/core/Session";

export const metadata = {
  title: "Trainer"
}

export default async function TrainerDashboardLayout({ children }) {
  await requireRole("trainer");

  return <>{children}</>;
}
