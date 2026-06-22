import { getUserSession } from "@/lib/core/Session";
import { redirect } from "next/navigation";

export default async function DashboardRoot() {
  const user = await getUserSession();

  if (!user) redirect("/authenticate/signin");

  const role = user.role ?? "user";
  redirect(`/dashboard/${role}/overview`);
}
