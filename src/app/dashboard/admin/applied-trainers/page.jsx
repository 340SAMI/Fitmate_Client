// src/app/dashboard/admin/trainer-applications/page.jsx
import { getApplication } from "@/lib/api/application";
import TrainerApplicationsClient from "./TrainerApplicationsClient";

export default async function TrainerApplicationsPage() {
  const applications = await getApplication();

  return <TrainerApplicationsClient applications={applications ?? []} />;
}