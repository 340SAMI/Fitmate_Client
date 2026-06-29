// src/app/dashboard/user/apply-trainer/page.jsx
import { getApplication } from "@/lib/api/application";
import { getUserSession } from "@/lib/core/Session";
import ApplyTrainerClient from "./applyTrainerClient";


export default async function ApplyTrainerPage() {
  const user = await getUserSession();
  const application = await getApplication();

  return <ApplyTrainerClient user={user} application={application} />;
}