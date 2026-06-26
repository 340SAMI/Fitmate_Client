import { getUserSession } from "@/lib/core/Session";
import TrainerOverviewClient from "./TrainerOverViewClient";


export default async function TrainerOverviewPage() {
  const user = await getUserSession();

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/trainer/stats/${user.id}`,
    { cache: "no-store" }
  );
  const stats = await res.json();

  return <TrainerOverviewClient user={user} stats={stats} />;
}