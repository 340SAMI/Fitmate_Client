import { getUserSession } from "@/lib/core/Session";

import MyClassesClient from "./MyClassesClient";
import { getClasses } from "@/lib/api/classes";

export default async function MyClassesPage() {
  const user = await getUserSession();
  const data = await getClasses("", user.id);

  return <MyClassesClient initialClasses={data?.classes ?? []} />;
}